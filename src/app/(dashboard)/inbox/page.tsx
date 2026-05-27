'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ConversationList } from '@/components/conversation-list'
import { ChatView } from '@/components/chat-view'

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [isHumanMode, setIsHumanMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchConversations()

    const channel = supabase
      .channel('conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => fetchConversations())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (selectedId) fetchMessages(selectedId)
  }, [selectedId])

  async function fetchConversations() {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false })

    if (data) {
      setConversations(data)
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id)
      }
    }
    setLoading(false)
  }

  async function fetchMessages(conversationId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)

    // Check if human handoff
    const conv = conversations.find(c => c.id === conversationId)
    setIsHumanMode(conv?.is_human_handoff || conv?.state === 'human_handoff')
  }

  async function handleToggleMode(mode: boolean) {
    setIsHumanMode(mode)
    await supabase
      .from('conversations')
      .update({ is_human_handoff: mode, state: mode ? 'human_handoff' : 'awaiting_intent' })
      .eq('id', selectedId)
  }

  // Format for ConversationList component
  const formattedConversations = conversations.map(c => ({
    id: c.id,
    phoneNumber: c.patient_phone,
    lastMessage: c.state || 'No messages yet',
    timeAgo: new Date(c.last_message_at).toLocaleDateString('en-IN'),
    unread: 0,
    type: (c.is_human_handoff ? 'human' : 'ai') as 'ai' | 'human',
  }))

  // Format for ChatView component
  const formattedMessages = messages.map(m => ({
    id: m.id,
    text: m.content,
    sender: m.direction as 'inbound' | 'outbound',
    time: new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  }))

  const selectedConversation = conversations.find(c => c.id === selectedId)

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6 p-6">
        {loading ? (
          <div className="text-slate-400 text-center py-8 w-full">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="text-slate-400 text-center py-8 w-full">No conversations yet. Patients will appear here when they message your WhatsApp number.</div>
        ) : (
          <>
            <ConversationList
              conversations={formattedConversations}
              selectedId={selectedId}
              onSelectConversation={setSelectedId}
            />
            <ChatView
              messages={formattedMessages}
              isHumanMode={isHumanMode}
              onToggleMode={handleToggleMode}
              phoneNumber={selectedConversation?.patient_phone || ''}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
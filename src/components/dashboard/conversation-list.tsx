import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User } from 'lucide-react'

interface Conversation {
  id: string
  phoneNumber: string
  lastMessage: string
  timeAgo: string
  unread: number
  type: 'ai' | 'human'
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string
  onSelectConversation: (id: string) => void
}

export function ConversationList({
  conversations,
  selectedId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="w-80 bg-slate-900 border border-slate-800 rounded-lg flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h2 className="font-semibold text-white">Messages</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-slate-800">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full text-left p-4 transition-colors hover:bg-slate-800/50 ${
                selectedId === conversation.id ? 'bg-blue-600/20 border-l-2 border-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {conversation.phoneNumber}
                  </span>
                  {conversation.type === 'ai' ? (
                    <Bot className="w-4 h-4 text-blue-400" />
                  ) : (
                    <User className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {conversation.timeAgo}
                </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                {conversation.lastMessage}
              </p>
              {conversation.unread > 0 && (
                <Badge className="bg-blue-600 text-white">
                  {conversation.unread} new
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

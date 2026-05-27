import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Pause, Play } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'inbound' | 'outbound'
  time: string
}

interface ChatViewProps {
  messages: Message[]
  isHumanMode: boolean
  onToggleMode: (isHuman: boolean) => void
  phoneNumber: string
}

export function ChatView({
  messages,
  isHumanMode,
  onToggleMode,
  phoneNumber,
}: ChatViewProps) {
  if (!phoneNumber) {
    return (
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center">
        <p className="text-slate-400">Select a conversation to start</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{phoneNumber}</h3>
          <p className="text-xs text-slate-400">
            {isHumanMode ? 'Human Mode' : 'AI Mode'}
          </p>
        </div>
        <Button
          onClick={() => onToggleMode(!isHumanMode)}
          className={`${
            isHumanMode
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          size="sm"
        >
          {isHumanMode ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Hand Back to AI
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Take Over
            </>
          )}
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'outbound'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'outbound'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-100'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-600"
            disabled={!isHumanMode}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            size="icon"
            disabled={!isHumanMode}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isHumanMode && (
          <p className="text-xs text-slate-400 mt-2">
            Take over the conversation to send manual messages
          </p>
        )}
      </div>
    </div>
  )
}

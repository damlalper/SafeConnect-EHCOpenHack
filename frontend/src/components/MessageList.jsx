import React, { useRef, useEffect } from 'react'

export default function MessageList({ messages = [], currentUserId = 'me' }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe':
        return 'bg-green-100 border-green-300 text-green-800'
      case 'help':
        return 'bg-red-100 border-red-300 text-red-800'
      case 'water':
        return 'bg-blue-100 border-blue-300 text-blue-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe':
        return '✓'
      case 'help':
        return '⚠'
      case 'water':
        return '💧'
      default:
        return '•'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'safe':
        return 'I am Safe'
      case 'help':
        return 'Need Help!'
      case 'water':
        return 'Need Water/Shelter'
      default:
        return status
    }
  }

  const PriorityBadge = ({ priority }) => {
    if (!priority || priority === 'General') return null;

    const styles = {
      Urgent: 'bg-red-500 text-white',
      Needs: 'bg-yellow-400 text-gray-800',
      Info: 'bg-blue-400 text-white',
    };

    const icons = {
      Urgent: '🔥',
      Needs: '💧',
      Info: 'ℹ️',
    }

    return (
      <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[priority] || 'hidden'}`}>
        {icons[priority]} {priority}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <p className="text-sm">No messages yet</p>
          <p className="text-xs mt-1">Send a status or message to get started</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isOwn = msg.from === currentUserId
          const isStatus = msg.type === 'status'

          return (
            <div
              key={msg.id || index}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-slide-up`}
            >
              <div
                className={`max-w-[75%] ${
                  isStatus
                    ? `${getStatusColor(msg.status)} border-2 rounded-lg px-4 py-3`
                    : isOwn
                    ? 'bg-blue-500 text-white rounded-lg rounded-br-none px-4 py-2'
                    : 'bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2'
                }`}
              >
                {/* Sender name for non-own messages */}
                {!isOwn && (
                  <div className="text-xs font-semibold mb-1 text-gray-600">
                    {msg.from || 'Unknown'}
                  </div>
                )}

                {/* Status message */}
                {isStatus ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getStatusIcon(msg.status)}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        {getStatusText(msg.status)}
                      </div>
                      {msg.location && (
                        <div className="text-xs mt-1 opacity-75">
                          📍 Location shared
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Regular text message */
                  <div className="text-sm">{msg.text || msg.message || JSON.stringify(msg)}</div>
                )}

                {/* Timestamp and Priority */}
                <div className="flex items-center justify-end gap-2 mt-1">
                  <PriorityBadge priority={msg.priority} />
                  <div
                    className={`text-xs ${
                      isStatus
                        ? 'opacity-60'
                        : isOwn
                        ? 'text-blue-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

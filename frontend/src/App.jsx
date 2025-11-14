import React, { useState, useEffect, useRef } from 'react'
import MapView from './components/MapView'
import PeerConnection from './components/PeerConnection'
import MessageList from './components/MessageList'
import MessageInput from './components/MessageInput'
import StatusButtons from './components/StatusButtons'
import PeerList from './components/PeerList'
import OfflineIndicator from './components/OfflineIndicator'
import ErrorBoundary from './components/ErrorBoundary'
import Toast from './components/Toast'
import db from './lib/db'
import { uuidv4 } from './lib/uuid'
import { classifyMessage } from './lib/ai'

export default function App() {
  const [peers, setPeers] = useState([])
  const [messages, setMessages] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [showNamePrompt, setShowNamePrompt] = useState(true)
  const [activeTab, setActiveTab] = useState('messages') // 'messages' or 'peers'
  const [suggestedReply, setSuggestedReply] = useState(null)
  const [toast, setToast] = useState(null)
  const senderRef = useRef(null)
  const userId = useRef('user-' + uuidv4())

  useEffect(() => {
    // Initialize database and load data
    ;(async () => {
      await db.initDB()
      const msgs = await db.getMessages()
      const ps = await db.getPeers()
      if (msgs) setMessages(msgs) // Data is now pre-sorted by IndexedDB
      if (ps) setPeers(ps)

      // Load saved display name
      const savedName = localStorage.getItem('safeconnect_displayName')
      if (savedName) {
        setDisplayName(savedName)
        setShowNamePrompt(false)
      }
    })()

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.warn('Geolocation error:', error)
        }
      )
    }
  }, [])

  const handleSetName = (e) => {
    e.preventDefault()
    if (displayName.trim()) {
      localStorage.setItem('safeconnect_displayName', displayName.trim())
      setShowNamePrompt(false)
    }
  }

  const handleSendMessage = async (text) => {
    const msg = {
      id: uuidv4(),
      type: 'message',
      text: text,
      from: displayName || userId.current,
      timestamp: Date.now(),
      priority: classifyMessage(text),
    }

    // Persist locally
    await db.addMessage(msg)
    setMessages((prev) => [...prev, msg])

    // Send to peers
    if (senderRef.current) {
      try {
        senderRef.current(msg)
      } catch (e) {
        console.warn('Failed to send message:', e)
      }
    }
  }

  const handleStatusClick = async (status) => {
    // Get fresh location
    let location = currentLocation
    if (navigator.geolocation) {
      try {
        location = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }),
            reject,
            { timeout: 5000 }
          )
        })
        setCurrentLocation(location)
      } catch (error) {
        console.warn('Could not get location:', error)
      }
    }

    const msg = {
      id: uuidv4(),
      type: 'status',
      status: status,
      from: displayName || userId.current,
      timestamp: Date.now(),
      location: location,
      priority: status === 'help' ? 'Urgent' : status === 'water' ? 'Needs' : 'Info',
    }

    // Persist locally
    await db.addMessage(msg)
    setMessages((prev) => [...prev, msg])

    // Send to peers
    if (senderRef.current) {
      try {
        senderRef.current(msg)
      } catch (e) {
        console.warn('Failed to send status:', e)
      }
    }

    // Show toast notification
    const statusMessages = {
      safe: 'Status updated: You are safe',
      help: 'Status updated: Need help! Alert sent to nearby peers',
      water: 'Status updated: Need water/shelter - Alert sent',
    }

    const toastTypes = {
      safe: 'success',
      help: 'error',
      water: 'warning',
    }

    setToast({
      message: statusMessages[status],
      type: toastTypes[status],
    })
  }

  const handlePeerMessage = async (msg) => {
    // Ensure all incoming messages have a priority
    if (!msg.priority) {
      msg.priority = msg.type === 'status'
        ? (msg.status === 'help' ? 'Urgent' : msg.status === 'water' ? 'Needs' : 'Info')
        : classifyMessage(msg.text);
    }

    await db.addMessage(msg)
    setMessages((prev) => {
      // Avoid duplicates
      if (prev.some((m) => m.id === msg.id)) return prev
      // Data is pre-sorted by db, just append
      return [...prev, msg]
    })

    // AI Suggestion Logic
    if (msg.from !== (displayName || userId.current)) {
      if (msg.priority === 'Urgent') {
        setSuggestedReply("I'm on my way to help.");
      } else if (msg.priority === 'Needs') {
        setSuggestedReply("I have supplies, what is your location?");
      } else {
        setSuggestedReply(null);
      }
    }
  }

  // Name prompt overlay
  if (showNamePrompt) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">SafeConnect</h1>
            <p className="text-gray-600 text-sm">
              Offline Disaster Communication Network
            </p>
          </div>
          <form onSubmit={handleSetName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Start Connecting
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-800">SafeConnect</h1>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {displayName}
              </span>
            </div>
            <OfflineIndicator isConnected={isConnected} peersCount={peers.length} />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Panel */}
          <div className="flex-1 relative">
            <MapView
              peers={peers}
              messages={messages}
              currentLocation={currentLocation}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Hidden peer connection component */}
            <div className="hidden">
              <PeerConnection
                // TODO: In a real app, this room name could come from the URL
                // to allow for multiple, separate communication channels.
                roomName="safeconnect-demo"
                onPeerUpdate={(newPeers) => {
                  setPeers(newPeers)
                  setIsConnected(newPeers.length > 0)
                }}
                onMessage={handlePeerMessage}
                registerSender={(fn) => {
                  senderRef.current = fn
                }}
              />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'messages'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('peers')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'peers'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Peers ({peers.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'messages' ? (
              <>
                {/* Messages */}
                <MessageList messages={messages} currentUserId={displayName || userId.current} />

                              {/* Message Input */}
                              <MessageInput
                                onSend={handleSendMessage}
                                disabled={false}
                                placeholder="Type a message..."
                                suggestedReply={suggestedReply}
                                onSuggestionClick={() => {
                                  if (suggestedReply) {
                                    handleSendMessage(suggestedReply);
                                    setSuggestedReply(null);
                                  }
                                }}
                              />              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <PeerList peers={peers} />
              </div>
            )}

            {/* Status Buttons - Always visible at bottom */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <StatusButtons onStatusClick={handleStatusClick} disabled={false} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

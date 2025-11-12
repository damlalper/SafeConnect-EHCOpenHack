import React, { useState, useEffect } from 'react'

export default function OfflineIndicator({ isConnected = false, peersCount = 0 }) {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Internet status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            online ? 'bg-green-500' : 'bg-red-500'
          } animate-pulse`}
        />
        <span className="text-sm font-medium text-gray-700">
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-gray-300" />

      {/* Peer connection status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-blue-500' : 'bg-gray-400'
          }`}
        />
        <span className="text-sm text-gray-600">
          {peersCount} {peersCount === 1 ? 'peer' : 'peers'}
        </span>
      </div>
    </div>
  )
}

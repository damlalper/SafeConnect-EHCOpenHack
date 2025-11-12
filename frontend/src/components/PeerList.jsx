import React from 'react'

export default function PeerList({ peers = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'safe':
        return 'bg-green-500'
      case 'help':
        return 'bg-red-500'
      case 'water':
        return 'bg-blue-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'safe':
        return 'Safe'
      case 'help':
        return 'Needs Help'
      case 'water':
        return 'Needs Resources'
      default:
        return 'Unknown'
    }
  }

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Just now'
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Connected Peers</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {peers.length} online
        </span>
      </div>

      {peers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">No peers discovered yet</p>
          <p className="text-xs mt-1">
            Make sure other devices are on the same network
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {peers.map((peer) => (
            <div
              key={peer.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Status indicator */}
              <div
                className={`w-10 h-10 rounded-full ${getStatusColor(
                  peer.status
                )} flex items-center justify-center text-white font-bold flex-shrink-0`}
              >
                {peer.displayName ? peer.displayName[0].toUpperCase() : '?'}
              </div>

              {/* Peer info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">
                  {peer.displayName || peer.id}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">
                    {getStatusText(peer.status)}
                  </span>
                  {peer.location && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">📍</span>
                    </>
                  )}
                </div>
              </div>

              {/* Last seen */}
              <div className="text-xs text-gray-400 flex-shrink-0">
                {formatLastSeen(peer.lastSeen)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

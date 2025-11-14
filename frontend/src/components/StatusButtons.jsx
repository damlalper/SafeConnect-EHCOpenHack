import React, { useState } from 'react'

export default function StatusButtons({ onStatusClick, disabled = false }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async (status) => {
    if (disabled || loading) return
    setLoading(true)
    try {
      await onStatusClick(status)
    } finally {
      setLoading(false)
    }
  }

  const buttons = [
    {
      status: 'safe',
      icon: '✓',
      label: 'Safe',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      activeColor: 'active:bg-green-700',
    },
    {
      status: 'help',
      icon: '⚠',
      label: 'Need Help',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      activeColor: 'active:bg-red-700',
    },
    {
      status: 'water',
      icon: '💧',
      label: 'Water/Shelter',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      activeColor: 'active:bg-blue-700',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">Quick Status</h3>
        {loading && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Sending...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.status}
            onClick={() => handleClick(btn.status)}
            disabled={disabled || loading}
            className={`
              ${btn.bgColor} ${btn.hoverColor} ${btn.activeColor}
              text-white font-semibold py-3 px-4 rounded-lg
              flex items-center justify-center gap-2
              transition-all duration-200 shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105 active:scale-95
            `}
          >
            <span className="text-xl">{btn.icon}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center mt-2">
        Status updates include your location
      </div>
    </div>
  )
}

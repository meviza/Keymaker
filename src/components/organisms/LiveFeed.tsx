"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Activity, Shield, Clock } from 'lucide-react'
import { type LiveFeedItem } from '@/lib/api/mockData'
import { apiService } from '@/lib/api/services'

export const LiveFeed: React.FC = () => {
  const [feedItems, setFeedItems] = useState<LiveFeedItem[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const loadInitialFeed = async () => {
      const data = await apiService.getLiveFeed()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFeedItems(data.map((item: any) => ({ ...item, source: item.source || 'system' })))
    }

    loadInitialFeed()

    // Subscribe to real-time updates
    const unsubscribe = apiService.subscribeToLiveFeed(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newItem: any) => {
        setFeedItems(prev => [{ ...newItem, source: newItem.source || 'system' }, ...prev].slice(0, 20)) // Keep last 20 items
      },
      (connected) => {
        setIsConnected(connected)
      }
    )

    return unsubscribe
  }, [])

  const getSeverityIcon = (severity: LiveFeedItem['severity']) => {
    switch (severity) {
      case 'critical': return <Shield className="w-4 h-4 text-red-400" />
      case 'warning': return <Activity className="w-4 h-4 text-amber-400" />
      default: return <Terminal className="w-4 h-4 text-cyan-400" />
    }
  }

  const getSeverityColor = (severity: LiveFeedItem['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/10'
      case 'warning': return 'border-amber-500/50 bg-amber-500/10'
      default: return 'border-cyan-500/50 bg-cyan-500/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Live Feed</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-xs font-mono text-gray-400">
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {feedItems.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border ${getSeverityColor(item.severity)} backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(item.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500">{item.timestamp}</span>
                    <span className="text-xs font-mono text-emerald-400">[{item.source}]</span>
                  </div>
                  <p className="text-sm text-gray-300 break-words">{item.event}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {feedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <Terminal className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Waiting for agent activity...</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Real-time stream</span>
          </div>
          <span>{feedItems.length} events</span>
        </div>
      </div>
    </motion.div>
  )
}

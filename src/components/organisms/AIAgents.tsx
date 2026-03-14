"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, Shield, Zap, Globe, CheckCircle } from 'lucide-react'
import { mockDataService, type Agent } from '@/lib/api/mockData'
import { useLocalStorageState } from '@/lib/state/useLocalStorageState'

export const AIAgents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useLocalStorageState<string | null>('keymaker.selectedAgent', null)

  useEffect(() => {
    const loadAgents = async () => {
      const data = await mockDataService.getAgents()
      setAgents(data)
    }
    
    loadAgents()

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastActivity: Math.random() > 0.7 ? 'Live' : agent.lastActivity,
        successRate: agent.successRate + (Math.random() - 0.5) * 2
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
      case 'busy': return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
      case 'idle': return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      case 'busy': return <div className="w-2 h-2 rounded-full bg-amber-400" />
      case 'idle': return <div className="w-2 h-2 rounded-full bg-gray-400" />
      default: return <div className="w-2 h-2 rounded-full bg-gray-400" />
    }
  }

  const getTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'recon': return <Globe className="w-5 h-5 text-cyan-400" />
      case 'exploit': return <Zap className="w-5 h-5 text-red-400" />
      case 'memory': return <Shield className="w-5 h-5 text-purple-400" />
      case 'ethics': return <CheckCircle className="w-5 h-5 text-emerald-400" />
      default: return <Users className="w-5 h-5 text-gray-400" />
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-emerald-400'
    if (rate >= 85) return 'text-cyan-400'
    if (rate >= 75) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">AI Agents Status</h2>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            className="cursor-pointer"
          >
            <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              selectedAgent === agent.id 
                ? 'border-emerald-400 shadow-lg shadow-emerald-400/25' 
                : 'border-transparent hover:border-gray-600'
            }`}>
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(agent.status)}`}>
                    {getTypeIcon(agent.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{agent.type} Agent</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(agent.status)}
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${getStatusColor(agent.status)}`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Success Rate</span>
                  <span className={`font-bold ${getSuccessRateColor(agent.successRate)}`}>
                    {agent.successRate.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Activity</span>
                  <span className="text-emerald-400 font-mono text-xs">
                    {agent.lastActivity}
                  </span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Performance</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-3 rounded-full ${
                          i < Math.floor(agent.successRate / 20)
                            ? 'bg-emerald-400'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-lg font-bold text-emerald-400">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-lg font-bold text-amber-400">
              {agents.filter(a => a.status === 'busy').length}
            </div>
            <div className="text-xs text-gray-400">Busy</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-lg font-bold text-gray-400">
              {agents.filter(a => a.status === 'idle').length}
            </div>
            <div className="text-xs text-gray-400">Idle</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-lg font-bold text-cyan-400">
              {(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">Avg Success</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

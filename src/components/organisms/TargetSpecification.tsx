"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Shield, Zap, Globe, Play, Clock } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { mockDataService, type TargetSpec } from '@/lib/api/mockData'
import { useLocalStorageState } from '@/lib/state/useLocalStorageState'
import { apiService } from '@/lib/api/services'

export const TargetSpecification: React.FC = () => {
  const [targets, setTargets, { hydrated }] = useLocalStorageState<TargetSpec[]>('keymaker.targets', [])
  const [newTarget, setNewTarget] = useState('')
  const [scanType, setScanType] = useLocalStorageState<'recon' | 'vuln' | 'exploit'>('keymaker.scanType', 'recon')
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    const taskTargets = targets.filter(t => t.id.startsWith('task-') && (t.status === 'pending' || t.status === 'running'))
    if (taskTargets.length === 0) return

    const interval = setInterval(async () => {
      const active = taskTargets.slice(0, 3)
      await Promise.all(
        active.map(async (t) => {
          const taskId = t.id.replace(/^task-/, '')
          try {
            const status = await apiService.getTaskStatus(taskId)
            const raw = typeof status === 'object' && status !== null && 'status' in status
              ? String((status as Record<string, unknown>).status ?? '')
              : ''
            const normalized = raw.toLowerCase()

            let nextStatus: TargetSpec['status'] = t.status
            let nextProgress = t.progress

            if (normalized === 'queued') {
              nextStatus = 'pending'
              nextProgress = Math.max(nextProgress, 5)
            } else if (normalized === 'running') {
              nextStatus = 'running'
              nextProgress = Math.max(nextProgress, 25)
            } else if (normalized === 'completed') {
              nextStatus = 'completed'
              nextProgress = 100
            } else if (normalized === 'failed' || normalized === 'cancelled') {
              nextStatus = 'failed'
              nextProgress = Math.min(nextProgress, 99)
            }

            if (nextStatus !== t.status || nextProgress !== t.progress) {
              setTargets(prev => prev.map(x => (x.id === t.id ? { ...x, status: nextStatus, progress: nextProgress } : x)))
            }
          } catch {
            // ignore
          }
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [targets, setTargets])

  React.useEffect(() => {
    const loadTargets = async () => {
      if (!hydrated) return
      if (targets.length > 0) return
      const data = await mockDataService.getTargets()
      setTargets(data)
    }
    loadTargets()
  }, [hydrated, setTargets, targets.length])

  const handleEngageTarget = async () => {
    if (!newTarget.trim()) return

    setLoading(true)
    try {
      let backendStarted = false
      let id = `target-${Date.now()}`

      try {
        const res = await apiService.startScan({ target: newTarget.trim(), scanType })
        if (res?.taskId) {
          id = `task-${res.taskId}`
          backendStarted = true
        } else {
          backendStarted = false
        }
      } catch {
        backendStarted = false
      }

      const newTargetSpec: TargetSpec = {
        id,
        target: newTarget.trim(),
        scanType,
        status: backendStarted ? 'running' : 'pending',
        progress: backendStarted ? 5 : 0,
        startTime: backendStarted ? new Date().toLocaleTimeString() : undefined
      }

      setTargets(prev => [newTargetSpec, ...prev])
      setNewTarget('')

      setTimeout(() => {
        setTargets(prev => prev.map(t =>
          t.id === newTargetSpec.id
            ? { ...t, status: 'running', progress: 25, startTime: t.startTime ?? new Date().toLocaleTimeString() }
            : t
        ))
      }, 1000)

      setTimeout(() => {
        setTargets(prev => prev.map(t =>
          t.id === newTargetSpec.id
            ? { ...t, status: 'running', progress: 75 }
            : t
        ))
      }, 3000)

      setTimeout(() => {
        setTargets(prev => prev.map(t =>
          t.id === newTargetSpec.id
            ? { ...t, status: 'completed', progress: 100 }
            : t
        ))
      }, 5000)
      
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: TargetSpec['status']) => {
    switch (status) {
      case 'completed': return <div className="w-2 h-2 rounded-full bg-emerald-400" />
      case 'running': return <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      case 'failed': return <div className="w-2 h-2 rounded-full bg-red-400" />
      default: return <div className="w-2 h-2 rounded-full bg-gray-400" />
    }
  }

  const getScanTypeIcon = (type: typeof scanType) => {
    switch (type) {
      case 'recon': return <Globe className="w-4 h-4" />
      case 'vuln': return <Shield className="w-4 h-4" />
      case 'exploit': return <Zap className="w-4 h-4" />
    }
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
        <Target className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">Target Specification</h2>
      </div>

      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target IP / Domain
          </label>
          <input
            type="text"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="192.168.1.100 or target.example.com"
            className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Scan Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['recon', 'vuln', 'exploit'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setScanType(type)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  scanType === type
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-500/10'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {getScanTypeIcon(type)}
                  <span className="text-sm font-medium capitalize">{type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleEngageTarget}
          loading={loading}
          disabled={!newTarget.trim()}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Engage Target
        </Button>
      </div>

      {/* Active Targets */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Active Targets</h3>
        <div className="space-y-2">
          {targets.map((target) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-black/30 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getScanTypeIcon(target.scanType)}
                  <div>
                    <div className="font-mono text-sm text-white">{target.target}</div>
                    <div className="text-xs text-gray-400 capitalize">{target.scanType} scan</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {target.startTime && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {target.startTime}
                    </div>
                  )}
                  {getStatusIcon(target.status)}
                </div>
              </div>

              {/* Progress Bar */}
              {target.status === 'running' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{target.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${target.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {targets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No targets engaged yet</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

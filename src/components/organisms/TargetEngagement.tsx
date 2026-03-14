"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Shield, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { apiService, type ScanRequest } from '@/lib/api/services'

interface TargetEngagementProps {
  onEngage?: (request: ScanRequest) => void
}

export const TargetEngagement: React.FC<TargetEngagementProps> = ({ onEngage }) => {
  const [target, setTarget] = useState('')
  const [scanType, setScanType] = useState<ScanRequest['scanType']>('recon')
  const [loading, setLoading] = useState(false)

  const scanTypes = [
    { value: 'recon', label: 'Reconnaissance', icon: Target, description: 'Passive information gathering' },
    { value: 'vuln', label: 'Vulnerability Scan', icon: Shield, description: 'Active vulnerability assessment' },
    { value: 'exploit', label: 'Exploitation', icon: Zap, description: 'Controlled payload execution' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target.trim()) return

    setLoading(true)
    try {
      const request: ScanRequest = {
        target: target.trim(),
        scanType,
        options: { aggressive: scanType === 'exploit' }
      }

      if (onEngage) {
        onEngage(request)
      } else {
        await apiService.startScan(request)
      }
    } catch (error) {
      console.error('Failed to start scan:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Target Engagement</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target IP / Domain
          </label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="192.168.1.100 or target.example.com"
            className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            required
          />
        </div>

        {/* Scan Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Scan Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scanTypes.map((type) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="button"
                    onClick={() => setScanType(type.value as ScanRequest['scanType'])}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scanType === type.value
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-500/10'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={!target.trim()}
          className="w-full py-3 text-lg font-semibold"
        >
          {loading ? 'Engaging Target...' : 'Engage Target'}
        </Button>
      </form>
    </motion.div>
  )
}

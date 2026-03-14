import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  className
}) => {
  const trendColor = change && change > 0 ? 'text-red-400' : change && change < 0 ? 'text-green-400' : 'text-gray-400'
  const trendIcon = change && change > 0 ? '↑' : change && change < 0 ? '↓' : '→'

  return (
    <div className={cn(
      "glass-panel p-6 hover:scale-105 transition-all duration-300 cursor-pointer",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-6 h-6 text-cyan-400" />
        {change !== undefined && (
          <div className={cn("flex items-center text-sm font-mono", trendColor)}>
            <span>{trendIcon}</span>
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-gray-400">{title}</div>
      </div>
    </div>
  )
}

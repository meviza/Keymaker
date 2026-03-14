"use client"

import React from 'react'

export function KpiCard({
  title,
  value,
  secondary,
  badge,
  tone = 'default',
  className
}: {
  title: string
  value: string
  secondary?: string
  badge?: string
  tone?: 'default' | 'good' | 'warning' | 'critical'
  className?: string
}) {
  const toneStyles: Record<NonNullable<typeof tone>, string> = {
    default: 'border-border/40',
    good: 'border-emerald-500/25',
    warning: 'border-amber-500/25',
    critical: 'border-red-500/25'
  }

  const badgeStyles: Record<NonNullable<typeof tone>, string> = {
    default: 'bg-muted/40 text-muted-foreground',
    good: 'bg-emerald-500/10 text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-300',
    critical: 'bg-red-500/10 text-red-300'
  }

  return (
    <div className={`glass-panel p-6 ${toneStyles[tone]} ${className ?? ''}`.trim()}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium tracking-wide text-muted-foreground">{title}</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">{value}</div>
          {secondary && <div className="mt-1 text-xs text-muted-foreground">{secondary}</div>}
        </div>
        {badge && (
          <div className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[tone]}`.trim()}>
            {badge}
          </div>
        )}
      </div>
    </div>
  )
}

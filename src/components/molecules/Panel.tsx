"use client"

import React from 'react'

export function Panel({
  title,
  subtitle,
  right,
  children,
  className
}: {
  title?: string
  subtitle?: string
  right?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`glass-panel p-6 ${className ?? ''}`.trim()}>
      {(title || subtitle || right) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-wide text-foreground/95">{title}</h2>}
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </header>
      )}
      {children}
    </section>
  )
}

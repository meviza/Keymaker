"use client"

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { ThemeContext } from '@/app/providers'

export function ThemeToggle() {
  const ctx = React.useContext(ThemeContext)

  if (!ctx) return null

  const isDark = ctx.theme === 'dark'

  return (
    <button
      type="button"
      onClick={ctx.toggleTheme}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border/50 bg-card/50 px-3 text-sm text-foreground/90 shadow-sm backdrop-blur-md transition hover:bg-card/70"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="h-4 w-4 text-emerald-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
      <span className="font-mono text-xs tracking-wide">{isDark ? 'DARK' : 'LIGHT'}</span>
    </button>
  )
}

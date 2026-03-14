"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  Crosshair,
  FileText,
  Gavel,
  LayoutGrid,
  Shield,
  Sparkles,
  Users
} from 'lucide-react'
import { ThemeToggle } from '@/components/atoms/ThemeToggle'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
}

const nav: NavItem[] = [
  { href: '/', label: 'War Room', icon: <LayoutGrid className="h-4 w-4" /> },
  { href: '/threats', label: 'Threat Intel', icon: <Shield className="h-4 w-4" /> },
  { href: '/arsenal', label: 'Arsenal', icon: <Crosshair className="h-4 w-4" /> },
  { href: '/reports', label: 'Reports', icon: <FileText className="h-4 w-4" /> },
  { href: '/agents', label: 'Agents', icon: <Users className="h-4 w-4" /> },
  { href: '/ethics', label: 'Ethics', icon: <Gavel className="h-4 w-4" /> }
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-app">
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.06]" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[280px] flex-col border-r border-border/40 bg-sidebar/40 px-4 py-5 backdrop-blur-xl md:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/50 bg-card/40 shadow-sm">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-foreground">KEYMAKER</div>
              <div className="text-xs font-mono text-muted-foreground">Command Center</div>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-foreground shadow-[0_0_0_1px_rgba(16,185,129,0.15)]'
                      : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-md border transition ${
                      active
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-border/40 bg-card/30 text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto rounded-xl border border-border/40 bg-card/35 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Operational</div>
                <div className="text-xs text-muted-foreground">All systems nominal</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border/40 bg-topbar/45 px-5 py-4 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="md:hidden">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-border/40 bg-card/30">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-foreground">{nav.find(n => n.href === pathname)?.label ?? 'War Room'}</div>
                  <div className="truncate text-xs text-muted-foreground">Enterprise Security Operations</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-md border border-border/40 bg-card/30 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md lg:flex">
                  <span className="font-mono text-xs">Search</span>
                  <span className="text-xs opacity-60">⌘K</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1600px] flex-1 px-5 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

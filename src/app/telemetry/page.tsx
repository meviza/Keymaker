"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Activity, AlertTriangle, Filter, Radio, RefreshCw, Shield, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/^http/, "ws") : "ws://localhost:8000")

interface TelemetryEvent { agent_id?: string; event_type?: string; severity?: string; timestamp?: string; data?: Record<string, unknown>; _is_alert?: boolean }

const SEV_STYLE: Record<string, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  info: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
}

export default function TelemetryPage() {
  const [events, setEvents] = useState<TelemetryEvent[]>([])
  const [connected, setConnected] = useState(false)
  const [sevFilter, setSevFilter] = useState("")
  const [alertCount, setAlertCount] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_BASE}/api/v1/telemetry-ws/ws`)
      ws.onopen = () => setConnected(true)
      ws.onclose = () => { setConnected(false); setTimeout(connect, 5000) }
      ws.onerror = () => { setConnected(false); try { ws.close() } catch {} }
      ws.onmessage = (e) => {
        try {
          const evt = JSON.parse(e.data) as TelemetryEvent
          setEvents(prev => [evt, ...prev].slice(0, 500))
          if (evt._is_alert || evt.severity === "critical") setAlertCount(c => c + 1)
        } catch {}
      }
      wsRef.current = ws
    } catch { setTimeout(connect, 5000) }
  }, [])

  useEffect(() => { connect(); return () => { try { wsRef.current?.close() } catch {} } }, [connect])

  const filtered = sevFilter ? events.filter(e => e.severity === sevFilter) : events

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-cyber-green/20 rounded-lg border border-cyber-green/30">
              <Radio className="w-8 h-8 text-cyber-green" />
            </div>
            Live Telemetry
          </h1>
          <p className="text-zinc-400 mt-1">Real-time agent telemetry stream & anomaly alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {connected ? <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><Wifi className="w-3 h-3 mr-1" /> Connected</Badge> : <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><WifiOff className="w-3 h-3 mr-1" /> Disconnected</Badge>}
          <Badge variant="outline" className="border-white/10 text-zinc-400">{events.length} events</Badge>
          {alertCount > 0 && <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><AlertTriangle className="w-3 h-3 mr-1" /> {alertCount} alerts</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: events.length, color: "cyber-green" },
          { label: "Critical", value: events.filter(e => e.severity === "critical").length, color: "red-400" },
          { label: "Warnings", value: events.filter(e => e.severity === "warning").length, color: "amber-400" },
          { label: "Alerts", value: alertCount, color: "red-400" },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 border border-white/10 rounded-xl">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-bold text-${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {["", "critical", "high", "warning", "info"].map(s => (
          <Button key={s || "all"} size="sm" variant={sevFilter === s ? "default" : "outline"} onClick={() => setSevFilter(s)}
            className={sevFilter === s ? "bg-cyber-green/20 text-cyber-green border-cyber-green/30" : "border-white/10 text-zinc-400"}>
            {s || "All"}
          </Button>
        ))}
      </div>

      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-black/40 px-4 py-2 flex items-center gap-2 border-b border-white/10">
          <Activity className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Event Stream</span>
          {connected && <span className="ml-auto text-[10px] text-cyber-green animate-pulse">● LIVE</span>}
        </div>
        <div ref={scrollRef} className="h-[500px] overflow-y-auto p-4 font-mono text-sm space-y-1">
          {filtered.length === 0 && <p className="text-zinc-600 text-center mt-20">Waiting for telemetry events...</p>}
          {filtered.map((evt, i) => (
            <div key={i} className={`flex gap-3 py-1 px-2 rounded ${evt.severity === "critical" ? "bg-red-500/5" : ""}`}>
              <span className="text-zinc-600 shrink-0 w-20 text-[11px]">{evt.timestamp?.split("T")[1]?.split(".")[0] || "--:--:--"}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 w-16 text-center ${SEV_STYLE[evt.severity || "info"] || SEV_STYLE.info}`}>{evt.severity || "info"}</span>
              <span className="text-zinc-500 shrink-0 w-24 truncate text-[11px]">{evt.agent_id?.slice(0, 8) || "system"}</span>
              <span className="text-zinc-300 truncate">{evt.event_type}: {JSON.stringify(evt.data || {}).slice(0, 120)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

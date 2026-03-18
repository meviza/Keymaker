"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity, AlertTriangle, Cpu, Database, Globe2, HardDrive, Laptop,
  Monitor, Network, RefreshCw, Send, Shield, ShieldAlert, Smartphone,
  Terminal, Trash2, Wifi, WifiOff, Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { fetchClient } from "@/lib/api/fetchClient"

const API = "/api/v1/agents"

// ── Types ────────────────────────────────────────────────────────────────────

interface AgentDevice {
  id: string
  hostname: string
  os: string
  os_version: string
  status: string
  ip_address: string
  risk_score: number
  threat_count: number
  last_heartbeat: string | null
  agent_version: string
  tags: string[]
}

interface FleetStatus {
  total_agents: number
  by_os: Record<string, number>
  by_status: Record<string, number>
  avg_risk_score: number
  high_risk_agents: Array<{ id: string; hostname: string; os: string; risk_score: number }>
  pending_commands: number
  telemetry_buffer: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const OS_ICONS: Record<string, typeof Monitor> = {
  windows: Monitor,
  linux: Terminal,
  macos: Laptop,
  android: Smartphone,
  ios: Smartphone,
  kubernetes: Globe2,
}

const STATUS_STYLES: Record<string, string> = {
  online: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  offline: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  degraded: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  quarantined: "bg-red-500/20 text-red-400 border-red-500/30",
  updating: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pending: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

function riskColor(score: number): string {
  if (score >= 70) return "text-red-400"
  if (score >= 40) return "text-amber-400"
  if (score >= 10) return "text-yellow-400"
  return "text-emerald-400"
}

function riskBg(score: number): string {
  if (score >= 70) return "bg-red-500"
  if (score >= 40) return "bg-amber-500"
  if (score >= 10) return "bg-yellow-500"
  return "bg-emerald-500"
}

function timeAgo(iso: string | null): string {
  if (!iso) return "never"
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return `${Math.floor(sec / 3600)}h ago`
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentDevice[]>([])
  const [fleet, setFleet] = useState<FleetStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [osFilter, setOsFilter] = useState<string>("")
  const [commandAgent, setCommandAgent] = useState<string | null>(null)
  const [commandType, setCommandType] = useState("scan")
  const [sending, setSending] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [agentRes, fleetRes] = await Promise.all([
        fetchClient.getJson<{ agents: AgentDevice[]; total: number }>(API + "/"),
        fetchClient.getJson<FleetStatus>(API + "/status/summary"),
      ])
      setAgents(agentRes.agents)
      setFleet(fleetRes)
    } catch {
      // Backend may not be running — show empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 10000)
    return () => clearInterval(id)
  }, [loadData])

  const filteredAgents = useMemo(
    () => osFilter ? agents.filter(a => a.os === osFilter) : agents,
    [agents, osFilter]
  )

  const sendCommand = async (agentId: string) => {
    setSending(true)
    try {
      await fetchClient.postJson(`${API}/${agentId}/commands`, {
        command_type: commandType,
        payload: {},
      })
      setCommandAgent(null)
    } catch (err) {
      console.error("Command failed:", err)
    } finally {
      setSending(false)
    }
  }

  // ── Fleet Summary Cards ──

  const summaryCards = fleet ? [
    { label: "Total Agents", value: fleet.total_agents, icon: Shield, color: "cyber-green" },
    { label: "Avg Risk", value: `${fleet.avg_risk_score}%`, icon: AlertTriangle, color: fleet.avg_risk_score > 50 ? "red-400" : "cyber-green" },
    { label: "Pending Cmds", value: fleet.pending_commands, icon: Send, color: "cyber-blue" },
    { label: "Telemetry Queue", value: fleet.telemetry_buffer, icon: Activity, color: "purple-400" },
  ] : []

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-cyber-green/20 rounded-lg border border-cyber-green/30">
              <Shield className="w-8 h-8 text-cyber-green" />
            </div>
            Agent Fleet Command
          </h1>
          <p className="text-zinc-400 mt-1">
            <span className="text-cyber-green font-mono font-semibold">Keymaker</span> Endpoint Agent Fleet — Gerçek Zamanlı İzleme
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          className="border-white/10 text-zinc-300 hover:text-white hover:border-cyber-green/50"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Fleet Summary */}
      {fleet && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="glass-panel p-4 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">{card.label}</span>
                </div>
                <div className={`text-2xl font-bold text-${card.color}`}>{card.value}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* OS Distribution */}
      {fleet && Object.keys(fleet.by_os).length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={osFilter === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setOsFilter("")}
            className={osFilter === "" ? "bg-cyber-green/20 text-cyber-green border-cyber-green/30" : "border-white/10 text-zinc-400"}
          >
            All ({fleet.total_agents})
          </Button>
          {Object.entries(fleet.by_os).map(([os, count]) => {
            const Icon = OS_ICONS[os] || HardDrive
            return (
              <Button
                key={os}
                variant={osFilter === os ? "default" : "outline"}
                size="sm"
                onClick={() => setOsFilter(os)}
                className={osFilter === os ? "bg-cyber-green/20 text-cyber-green border-cyber-green/30" : "border-white/10 text-zinc-400"}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {os} ({count})
              </Button>
            )
          })}
        </div>
      )}

      {/* Agent Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-zinc-600">
          <Activity className="w-8 h-8 animate-pulse mr-3" /> Loading fleet data...
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-600 space-y-3">
          <Shield className="w-16 h-16 opacity-20" />
          <p className="text-lg">No agents registered yet</p>
          <p className="text-sm text-zinc-700">Deploy Keymaker agents on your endpoints to see them here.</p>
          <code className="text-xs text-zinc-500 bg-black/40 px-3 py-1 rounded font-mono">
            POST /api/v1/agents/register
          </code>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredAgents.map((agent, i) => {
              const OsIcon = OS_ICONS[agent.os] || HardDrive
              const isOnline = agent.status === "online"
              const isHighRisk = agent.risk_score >= 50

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-panel border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
                    {/* Top accent */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${isHighRisk ? "bg-red-500" : isOnline ? "bg-cyber-green" : "bg-zinc-700"}`} />

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isOnline ? "bg-cyber-green/10 text-cyber-green" : "bg-zinc-800 text-zinc-500"}`}>
                            <OsIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-base">{agent.hostname}</CardTitle>
                            <p className="text-xs text-zinc-500 font-mono">{agent.ip_address} · {agent.os} {agent.os_version}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isOnline ? <Wifi className="w-3.5 h-3.5 text-cyber-green" /> : <WifiOff className="w-3.5 h-3.5 text-zinc-600" />}
                          <Badge variant="outline" className={STATUS_STYLES[agent.status] || STATUS_STYLES.offline}>
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Risk + Threats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/30 rounded-md p-2 border border-white/5 text-center">
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Risk</p>
                          <p className={`text-lg font-bold ${riskColor(agent.risk_score)}`}>{agent.risk_score}</p>
                          <div className="w-full bg-zinc-800 h-1 mt-1 rounded-full overflow-hidden">
                            <div className={`h-full ${riskBg(agent.risk_score)}`} style={{ width: `${agent.risk_score}%` }} />
                          </div>
                        </div>
                        <div className="bg-black/30 rounded-md p-2 border border-white/5 text-center">
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Threats</p>
                          <p className={`text-lg font-bold ${agent.threat_count > 0 ? "text-red-400" : "text-emerald-400"}`}>{agent.threat_count}</p>
                        </div>
                        <div className="bg-black/30 rounded-md p-2 border border-white/5 text-center">
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Heartbeat</p>
                          <p className="text-xs font-mono text-zinc-300 mt-1">{timeAgo(agent.last_heartbeat)}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      {agent.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {agent.tags.map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-zinc-400 font-mono">{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <p className="text-[9px] text-zinc-600 font-mono flex-1">v{agent.agent_version} · {agent.id.slice(0, 8)}</p>
                        {commandAgent === agent.id ? (
                          <div className="flex items-center gap-1">
                            <select
                              value={commandType}
                              onChange={e => setCommandType(e.target.value)}
                              className="text-xs bg-black/50 border border-white/10 text-white rounded px-1 py-0.5"
                            >
                              <option value="scan">Scan</option>
                              <option value="patch">Patch</option>
                              <option value="isolate">Isolate</option>
                              <option value="collect">Collect</option>
                              <option value="update">Update</option>
                            </select>
                            <Button size="sm" variant="outline" disabled={sending} onClick={() => sendCommand(agent.id)}
                              className="h-6 px-2 text-xs border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10">
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setCommandAgent(agent.id)}
                            className="h-6 px-2 text-xs border-white/10 text-zinc-400 hover:text-white">
                            <Zap className="w-3 h-3 mr-1" /> Command
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* High Risk Agents Alert */}
      {fleet && fleet.high_risk_agents.length > 0 && fleet.high_risk_agents[0].risk_score > 0 && (
        <div className="glass-panel border border-red-500/30 rounded-xl p-5 bg-red-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">High Risk Agents</h3>
          </div>
          <div className="space-y-2">
            {fleet.high_risk_agents.filter(a => a.risk_score > 0).map(agent => (
              <div key={agent.id} className="flex items-center justify-between text-sm">
                <span className="text-zinc-300 font-mono">{agent.hostname} ({agent.os})</span>
                <span className={`font-bold ${riskColor(agent.risk_score)}`}>Risk: {agent.risk_score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

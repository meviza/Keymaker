"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Activity, Cpu, Database, Network, Play, Square, Pause, ShieldAlert, Zap } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiService, SystemStatus } from "@/lib/api/services"

// Simulated Agent Data Structure
interface Agent {
  id: string
  name: string
  type: string
  status: "idle" | "running" | "paused" | "error"
  cpu: number
  memory: string
  currentTask: string
  icon: any
}

const INITIAL_AGENTS: Agent[] = [
  { id: "agt-rcn-01", name: "Keymaker Recon-Alpha", type: "Reconnaissance", status: "running", cpu: 45, memory: "1.2 GB", currentTask: "Port Scanning 192.168.1.100", icon: Network },
  { id: "agt-exp-01", name: "Keymaker Exploit-Core", type: "Exploitation", status: "idle", cpu: 2, memory: "450 MB", currentTask: "Awaiting Target", icon: Zap },
  { id: "agt-mem-01", name: "Keymaker Memory-Node", type: "Memory Analysis", status: "running", cpu: 15, memory: "4.8 GB", currentTask: "Querying Threat Graph", icon: Database },
  { id: "agt-stl-01", name: "Keymaker Stealth-Ops", type: "Stealth Proxies", status: "paused", cpu: 0, memory: "120 MB", currentTask: "Connection Halted", icon: ShieldAlert },
]

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await apiService.getSystemStatus()
        setSystemStatus(status)
      } catch (err) {
        console.error("Failed to fetch system status", err)
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = (id: string, action: "start" | "stop" | "pause") => {
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        let newStatus = agent.status
        if (action === "start") newStatus = "running"
        if (action === "stop") newStatus = "idle"
        if (action === "pause") newStatus = "paused"
        return { ...agent, status: newStatus }
      }
      return agent
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "idle": return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "error": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-zinc-500/20 text-zinc-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
            Keymaker Agents Command
          </h1>
          <p className="text-zinc-400 mt-1">Manage and orchestrate autonomous execution modules.</p>
        </div>
        <div className="flex items-center gap-4 glass-panel px-4 py-2 rounded-full">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-zinc-300">Swarm Load: {systemStatus?.agents.active || 2} / {systemStatus?.agents.total || 4} Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent, index) => {
          const Icon = agent.icon
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-panel border-cyan-900/30 relative overflow-hidden group">
                {/* Neon Accent Line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${agent.status === 'running' ? 'bg-cyan-500 shadow-[0_0_10px_#00d4ff]' : 'bg-zinc-700'}`} />

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${agent.status === 'running' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                        <CardDescription className="text-cyan-600 font-medium">{agent.type}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {agent.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-md p-3 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                          <Cpu className="w-3 h-3" /> CPU Usage
                        </div>
                        <div className="text-lg font-semibold text-white">{agent.cpu}%</div>
                        {/* Progress bar */}
                        <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${agent.cpu}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-md p-3 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                          <Database className="w-3 h-3" /> RAM
                        </div>
                        <div className="text-lg font-semibold text-white">{agent.memory}</div>
                      </div>
                    </div>

                    <div className="bg-cyan-950/20 border border-cyan-900/30 rounded-md p-3">
                      <div className="text-xs text-cyan-500 mb-1">Current Task</div>
                      <div className="text-sm text-zinc-300 font-mono truncate">
                        {agent.currentTask}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-700 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                        onClick={() => handleAction(agent.id, "start")}
                        disabled={agent.status === "running"}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-700 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                        onClick={() => handleAction(agent.id, "pause")}
                        disabled={agent.status === "paused" || agent.status === "idle"}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-colors"
                        onClick={() => handleAction(agent.id, "stop")}
                        disabled={agent.status === "idle"}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

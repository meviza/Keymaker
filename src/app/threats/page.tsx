"use client"

import { useState } from "react"
import { Shield, Activity, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const THREAT_LOGS = [
  { id: "T-0102", time: "14:23:05", protocol: "TCP/443", source: "192.168.1.15", target: "10.0.0.5", type: "Command Injection", severity: "CRITICAL", mitre: "T1059" },
  { id: "T-0103", time: "14:23:41", protocol: "TCP/80", source: "External", target: "8.8.8.8", type: "Port Scan", severity: "LOW", mitre: "T1046" },
  { id: "T-0104", time: "14:24:12", protocol: "UDP/53", source: "192.168.1.50", target: "1.1.1.1", type: "DNS Tunneling", severity: "HIGH", mitre: "T1071.004" },
  { id: "T-0105", time: "14:25:01", protocol: "TCP/22", source: "10.0.0.10", target: "10.0.0.2", type: "SSH Brute Force", severity: "HIGH", mitre: "T1110.001" },
  { id: "T-0106", time: "14:27:18", protocol: "TCP/8080", source: "192.168.1.100", target: "External", type: "Data Exfiltration", severity: "CRITICAL", mitre: "T1041" },
  { id: "T-0107", time: "14:30:22", protocol: "TCP/445", source: "10.0.0.5", target: "10.0.0.6", type: "SMB Lateral Movement", severity: "HIGH", mitre: "T1021.002" },
]

export default function ThreatsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
            Keymaker Threat Matrix
          </h1>
          <p className="text-zinc-400 mt-1">Real-time Kafka telemetry stream mapped to MITRE ATT&CK framework.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/5 text-zinc-300 rounded-md transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          Sync Telemetry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-red-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" /> Critical Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500" style={{ textShadow: "0 0 10px rgba(239,68,68,0.3)" }}>24</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-orange-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" /> High Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">142</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-emerald-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Blocked Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">8,459</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-cyan-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" /> Events / Sec
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400" style={{ textShadow: "0 0 10px rgba(0,212,255,0.3)" }}>342</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-black/40 pb-4">
          <CardTitle className="text-lg text-white font-medium">Live Intercept Stream (Elasticsearch)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-cyan-500">Time</TableHead>
                <TableHead className="text-cyan-500">Protocol</TableHead>
                <TableHead className="text-cyan-500">Source</TableHead>
                <TableHead className="text-cyan-500">Target</TableHead>
                <TableHead className="text-cyan-500">Threat Type</TableHead>
                <TableHead className="text-cyan-500">MITRE ID</TableHead>
                <TableHead className="text-cyan-500 text-right">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {THREAT_LOGS.map((log) => (
                <TableRow key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono text-zinc-400">{log.time}</TableCell>
                  <TableCell className="font-mono text-zinc-500">{log.protocol}</TableCell>
                  <TableCell className="text-zinc-300">{log.source}</TableCell>
                  <TableCell className="text-zinc-300">{log.target}</TableCell>
                  <TableCell className="text-zinc-200 font-medium">{log.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-cyan-400 font-mono">
                      {log.mitre}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      log.severity === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/30" :
                        log.severity === "HIGH" ? "bg-orange-500/10 text-orange-400 border-orange-500/30" :
                          "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                    }>
                      {log.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Scale, ShieldAlert, CheckCircle, XCircle, AlertTriangle, Key } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const POLICIES = [
  { id: "pol-01", name: "Strict Scope Adherence", description: "Reject any payloads targeting IP addresses outside the defined project CIDR block.", active: true },
  { id: "pol-02", name: "No Destructive Payloads", description: "Block execution of modules that delete, encrypt, or corrupt data (e.g., Ransomware sims).", active: true },
  { id: "pol-03", name: "Data Privacy Masking", description: "Automatically redact PII, credit cards, or health data found during exfiltration tests.", active: true },
  { id: "pol-04", name: "Halt on High Risk", description: "Suspend autonomous operations if the aggregate system risk score exceeds 85/100.", active: true },
  { id: "pol-05", name: "Authorized Windows Only", description: "Only permit active exploitation during pre-approved scheduled maintenance windows.", active: false },
]

const EVENT_LOG = [
  { id: "evt-912", time: "15:23:41", action: "Deploy cve_2024_6387.py", target: "10.0.0.5", decision: "ALLOWED", reason: "Target in scope, payload non-destructive." },
  { id: "evt-913", time: "15:24:12", action: "Nmap Subnet Scan", target: "192.168.1.0/24", decision: "ALLOWED", reason: "Standard authorized reconnaissance." },
  { id: "evt-914", time: "15:26:05", action: "Deploy ransomware_sim.py", target: "10.0.0.12", decision: "BLOCKED", reason: "Policy Violation: No Destructive Payloads." },
  { id: "evt-915", time: "15:26:50", action: "Exfiltrate /etc/shadow", target: "10.0.0.5", decision: "ALLOWED", reason: "Approved for penetration testing scope." },
  { id: "evt-916", time: "15:28:11", action: "SQLi Database Dump", target: "8.8.8.8", decision: "BLOCKED", reason: "Policy Violation: Out of Scope Target." },
]

export default function EthicsPage() {
  const [policies, setPolicies] = useState(POLICIES)

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(p =>
      p.id === id ? { ...p, active: !p.active } : p
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3" style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
            <Key className="w-8 h-8 text-cyan-400" />
            Keymaker Ethics Sentinel
          </h1>
          <p className="text-zinc-400 mt-1">Anahtarcı AI Governance: Enforcing rules of engagement and ethical constraints.</p>
        </div>
        <div className="flex items-center gap-4 glass-panel px-4 py-2 rounded-full">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-zinc-300 font-mono">Governance: STRICT</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-cyan-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-500" /> Active Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400" style={{ textShadow: "0 0 10px rgba(0,212,255,0.3)" }}>
              {policies.filter(p => p.active).length}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-emerald-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Actions Allowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">1,204</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-red-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" /> Actions Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500" style={{ textShadow: "0 0 10px rgba(239,68,68,0.3)" }}>42</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-orange-500/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> AI Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">14/100</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Policy Configuration */}
        <div className="space-y-4 lg:col-span-1">
          <h2 className="text-xl font-semibold text-white mb-4">Engagement Rules</h2>
          {policies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-panel border transition-colors ${policy.active ? 'border-cyan-500/30 bg-cyan-950/10' : 'border-white/5 bg-black/20'}`}>
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`font-semibold mb-1 ${policy.active ? 'text-white' : 'text-zinc-500'}`}>
                      {policy.name}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                  <Switch
                    checked={policy.active}
                    onCheckedChange={() => togglePolicy(policy.id)}
                    className="data-[state=checked]:bg-cyan-600"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sentinel Decision Log */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Anahtarcı AI Decision Log</h2>
          <Card className="glass-panel border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-black/40 pb-4">
              <CardTitle className="text-lg text-white font-medium">Recent Governance Intercepts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-cyan-500">Time</TableHead>
                    <TableHead className="text-cyan-500">Action</TableHead>
                    <TableHead className="text-cyan-500">Target</TableHead>
                    <TableHead className="text-cyan-500">Decision</TableHead>
                    <TableHead className="text-cyan-500">Reasoning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EVENT_LOG.map((log) => (
                    <TableRow key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-zinc-400">{log.time}</TableCell>
                      <TableCell className="text-zinc-200 font-medium">{log.action}</TableCell>
                      <TableCell className="font-mono text-zinc-500">{log.target}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          log.decision === "BLOCKED" ? "bg-red-500/10 text-red-500 border-red-500/30" :
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }>
                          {log.decision}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">{log.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

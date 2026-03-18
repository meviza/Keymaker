"use client"

import { useState } from "react"
import { Terminal, Shield, Zap, Search, Target, Crosshair, AlertTriangle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PROFILES = [
  { id: "recon", name: "Reconnaissance", icon: Search, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", description: "Passive and active information gathering, port scanning, OSINT." },
  { id: "vuln", name: "Vulnerability Scan", icon: Target, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", description: "Identify misconfigurations, outdated software, and CVEs." },
  { id: "exploit", name: "Active Exploit", icon: Zap, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", description: "Weaponized payload delivery to gain initial access." },
  { id: "stealth", name: "Stealth Ops", icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30", description: "Low-noise, slow-paced enumeration avoiding IDS/IPS detection." },
  { id: "dos", name: "Denial of Service", icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", description: "Stress test infrastructure to evaluate connection limits." },
  { id: "full", name: "Full Audit", icon: Crosshair, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", description: "Comprehensive end-to-end security audit and penetration test." },
]

const SCRIPTS = [
  { id: "scr-01", name: "nmap_stealth.py", category: "Recon", target: "Network", status: "Available" },
  { id: "scr-02", name: "shodan_lookup.py", category: "OSINT", target: "Global", status: "Available" },
  { id: "scr-03", name: "cve_2024_6387.py", category: "Exploit", target: "SSH", status: "Requires Auth" },
  { id: "scr-04", name: "dirb_brute.py", category: "Recon", target: "Web", status: "Available" },
  { id: "scr-05", name: "slowloris_layer7.py", category: "DoS", target: "Web", status: "Restricted" },
  { id: "scr-06", name: "k8s_container_escape.py", category: "Exploit", target: "Cloud", status: "Requires Auth" },
]

export default function ArsenalPage() {
  const [selectedProfile, setSelectedProfile] = useState<string>("recon")
  const [target, setTarget] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight" style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
          Keymaker Arsenal
        </h1>
        <p className="text-zinc-400 mt-1">Configure and deploy highly specialized cyber operation profiles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profiles Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Operation Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROFILES.map((profile) => {
              const Icon = profile.icon
              const isSelected = selectedProfile === profile.id
              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`glass-panel rounded-xl p-4 cursor-pointer transition-all duration-300 border ${isSelected ? profile.bg + ' shadow-[0_0_15px_rgba(0,0,0,0.5)] scale-[1.02]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-black/40 ${profile.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-medium text-white">{profile.name}</h3>
                  </div>
                  <p className="text-sm text-zinc-400">{profile.description}</p>
                </div>
              )
            })}
          </div>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Available Scripts Repository</h2>
          <Card className="glass-panel border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-black/40 border-b border-white/5">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-cyan-500">Script Name</TableHead>
                    <TableHead className="text-cyan-500">Category</TableHead>
                    <TableHead className="text-cyan-500">Target Layer</TableHead>
                    <TableHead className="text-cyan-500 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SCRIPTS.map((script) => (
                    <TableRow key={script.id} className="border-b border-white/5 hover:bg-white/5">
                      <TableCell className="font-mono text-zinc-300 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-zinc-500" />
                        {script.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300">
                          {script.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">{script.target}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={
                          script.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }>
                          {script.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Launch Configuration Column */}
        <div className="space-y-6">
          <Card className="glass-panel border-cyan-900/30 sticky top-4">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Launch Configuration
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Configure the payload parameters for the selected profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target" className="text-zinc-300">Target IP / Domain</Label>
                <Input
                  id="target"
                  placeholder="e.g. 192.168.1.100 or dvwa.local"
                  className="bg-black/50 border-zinc-800 text-white font-mono placeholder:text-zinc-600 focus-visible:ring-cyan-500"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Selected Profile</Label>
                <div className="p-3 bg-black/50 border border-zinc-800 rounded-md font-mono text-cyan-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {PROFILES.find(p => p.id === selectedProfile)?.name.toUpperCase()}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!target.trim()}
                >
                  DEPLOY PAYLOAD
                </Button>
                <p className="text-xs text-center text-zinc-500 mt-3 font-mono">
                  All deployments are logged to the Central Analytics Node.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div >
    </div >
  )
}

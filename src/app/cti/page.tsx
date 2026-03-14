"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe2, FileSearch, Fingerprint, ShieldAlert, Search,
  Loader2, RefreshCw, Wifi, WifiOff, Database, Zap, Activity
} from "lucide-react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"

interface IoC {
  ioc_value: string
  ioc_type: string
  source: string
  severity: Severity
  title: string
  description: string
  tags: string[]
  first_seen: string
  reference_url?: string
  _score?: number
}

interface Source {
  source: string
  status: string
  api_key_configured?: boolean
  cache_size?: number
  last_fetch?: string
  rate_limit?: string
  error?: string
}

interface PipelineStats {
  vector_store: { backend: string; count: number; status: string }
  pipeline: { total_iocs_ingested: number; last_sync: string | null }
  sources: { name: string }[]
}

const SEV_CONFIG: Record<Severity, { label: string; bg: string; text: string; border: string; dot: string }> = {
  CRITICAL: { label: "CRITICAL", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-400" },
  HIGH: { label: "HIGH", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" },
  MEDIUM: { label: "MEDIUM", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" },
  LOW: { label: "LOW", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", dot: "bg-blue-400" },
  INFO: { label: "INFO", bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30", dot: "bg-zinc-400" },
}

function SeverityBadge({ sev }: { sev: Severity }) {
  const cfg = SEV_CONFIG[sev] ?? SEV_CONFIG.INFO
  return (
    <Badge variant="outline" className={`${cfg.bg} ${cfg.text} ${cfg.border} font-mono text-xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5 inline-block`} />
      {cfg.label}
    </Badge>
  )
}

function SourceCard({ source }: { source: Source }) {
  const online = source.status === "online" || source.status === "no_auth_mode"
  const noAuth = source.status === "no_auth_mode"
  return (
    <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{source.source}</span>
        {online
          ? <span className="flex items-center gap-1 text-xs text-emerald-400"><Wifi className="w-3 h-3" />{noAuth ? "no-auth" : "online"}</span>
          : <span className="flex items-center gap-1 text-xs text-red-400"><WifiOff className="w-3 h-3" />offline</span>
        }
      </div>
      {source.api_key_configured !== undefined && (
        <div className="text-xs text-zinc-500">
          Key: {source.api_key_configured ? <span className="text-emerald-400">configured</span> : <span className="text-zinc-600">not set (free tier)</span>}
        </div>
      )}
      {source.rate_limit && <div className="text-xs text-zinc-600">Rate: {source.rate_limit}</div>}
      {source.cache_size !== undefined && <div className="text-xs text-zinc-600">Cached: {source.cache_size.toLocaleString()}</div>}
      {source.last_fetch && <div className="text-xs text-zinc-600">Last: {new Date(source.last_fetch).toLocaleTimeString()}</div>}
    </div>
  )
}

function IoCItem({ ioc, index }: { ioc: IoC; index: number }) {
  const sev = (ioc.severity as Severity) ?? "INFO"
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <SeverityBadge sev={sev} />
        <span className="text-xs text-zinc-500">{ioc.source}</span>
      </div>
      <div className="font-mono text-cyan-400 text-xs font-semibold mb-0.5 truncate">{ioc.ioc_value}</div>
      <div className="text-zinc-300 text-xs mb-2 line-clamp-2">{ioc.title || ioc.description}</div>
      <div className="flex flex-wrap gap-1">
        {(Array.isArray(ioc.tags) ? ioc.tags : []).slice(0, 4).map((t) => (
          <span key={t} className="text-[10px] bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded font-mono">{t}</span>
        ))}
      </div>
      {ioc._score !== undefined && (
        <div className="mt-1.5 text-[10px] text-zinc-600 font-mono">similarity: {(ioc._score * 100).toFixed(1)}%</div>
      )}
    </motion.div>
  )
}

export default function CTIPage() {
  const [iocs, setIocs] = useState<IoC[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [stats, setStats] = useState<PipelineStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<IoC[] | null>(null)
  const [loadingIocs, setLoadingIocs] = useState(false)
  const [loadingSources, setLoadingSources] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [ingesting, setIngesting] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchIocs = useCallback(async () => {
    setLoadingIocs(true)
    try {
      const res = await fetch(`${API_BASE}/cti/osint/iocs?limit=20`)
      const data = await res.json()
      setIocs(data.iocs ?? [])
      setLastRefresh(new Date())
    } catch {
      // fallback — keep existing iocs
    } finally {
      setLoadingIocs(false)
    }
  }, [])

  const fetchSources = useCallback(async () => {
    setLoadingSources(true)
    try {
      const res = await fetch(`${API_BASE}/cti/osint/sources`)
      const data = await res.json()
      setSources(data.sources ?? [])
    } catch {/* ignore */ } finally {
      setLoadingSources(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/cti/osint/stats`)
      const data = await res.json()
      setStats(data)
    } catch {/* ignore */ }
  }, [])

  const triggerIngest = async () => {
    setIngesting(true)
    try {
      await fetch(`${API_BASE}/cti/osint/ingest`, { method: "POST" })
      await Promise.all([fetchIocs(), fetchStats()])
    } finally {
      setIngesting(false)
    }
  }

  const doSemanticSearch = async () => {
    if (!searchQuery.trim()) { setSearchResults(null); return }
    setLoadingSearch(true)
    try {
      const res = await fetch(`${API_BASE}/cti/osint/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, top_k: 15 }),
      })
      const data = await res.json()
      setSearchResults(data.results ?? [])
    } catch {
      setSearchResults([])
    } finally {
      setLoadingSearch(false)
    }
  }

  // Initial load + 30s polling for iocs
  useEffect(() => {
    fetchIocs()
    fetchSources()
    fetchStats()
    const interval = setInterval(fetchIocs, 30_000)
    return () => clearInterval(interval)
  }, [fetchIocs, fetchSources, fetchStats])

  const displayedIocs = searchResults ?? iocs

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
            Cyber Threat Intelligence
          </h1>
          <p className="text-zinc-400 mt-1">
            Real-time OSINT feeds · Qdrant semantic search · AlienVault OTX · NIST NVD · CISA KEV
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs">
            <Globe2 className="w-3 h-3 mr-1" /> OSINT LIVE
          </Badge>
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono text-xs">
            <Database className="w-3 h-3 mr-1" /> QDRANT: {stats?.vector_store?.backend === "qdrant" ? "ONLINE" : "FALLBACK"}
          </Badge>
          {lastRefresh && (
            <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/30 font-mono text-xs">
              <Activity className="w-3 h-3 mr-1" /> {lastRefresh.toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Pipeline Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Vector Entries", value: stats?.vector_store?.count?.toLocaleString() ?? "—", color: "text-cyan-400" },
          { label: "Total IoCs Ingested", value: stats?.pipeline?.total_iocs_ingested?.toLocaleString() ?? "—", color: "text-emerald-400" },
          { label: "Active Sources", value: stats?.sources?.length?.toString() ?? "3", color: "text-amber-400" },
          { label: "Last Sync", value: stats?.pipeline?.last_sync ? new Date(stats.pipeline.last_sync).toLocaleTimeString() : "—", color: "text-zinc-300" },
        ].map((m) => (
          <div key={m.label} className="bg-black/40 border border-white/5 rounded-xl p-4 backdrop-blur-md">
            <div className="text-zinc-500 text-xs mb-1">{m.label}</div>
            <div className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Threat Map + Semantic Search */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          {/* Radar Map */}
          <Card className="glass-panel border-cyan-900/30 min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/20 rounded-full flex items-center justify-center">
              <div className="w-36 h-36 border border-cyan-500/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#00d4ff] absolute top-0" />
              </div>
              <div className="w-24 h-24 border border-cyan-500/40 rounded-full" />
              <Globe2 className="absolute text-cyan-500/50 w-12 h-12" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                Global Threat Telemetry
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Live IoC telemetry across all registered OSINT pipelines
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Semantic Search */}
          <Card className="glass-panel border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                Semantic Intelligence Search
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                Powered by Qdrant vector similarity · try "OpenSSH RCE Linux" or "ransomware C2 domain"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSemanticSearch()}
                  placeholder="Search threat intelligence..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 font-mono text-sm"
                />
                <Button
                  onClick={doSemanticSearch}
                  disabled={loadingSearch}
                  className="bg-purple-600/80 hover:bg-purple-500 text-white border-0 shrink-0"
                >
                  {loadingSearch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
                {searchResults !== null && (
                  <Button
                    variant="outline"
                    onClick={() => { setSearchResults(null); setSearchQuery("") }}
                    className="border-white/10 text-zinc-400 hover:text-white shrink-0"
                  >
                    Clear
                  </Button>
                )}
              </div>
              {searchResults !== null && (
                <div className="text-xs text-zinc-500">
                  {searchResults.length} semantic matches for <span className="text-purple-400 font-mono">"{searchQuery}"</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card className="glass-panel border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Intelligence Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSources
                ? <div className="flex items-center gap-2 text-zinc-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Probing sources...</div>
                : <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sources.map((s, i) => <SourceCard key={i} source={s} />)}
                </div>
              }
            </CardContent>
          </Card>
        </div>

        {/* Right: Live IoC Feed */}
        <div className="col-span-1">
          <Card className="glass-panel border-white/10 h-full flex flex-col">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white font-medium flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-amber-400" />
                  {searchResults !== null ? "Search Results" : "Live Intel Feed"}
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-zinc-500 hover:text-white"
                    onClick={fetchIocs}
                    disabled={loadingIocs}
                    title="Refresh"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingIocs ? "animate-spin" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-zinc-500 hover:text-emerald-400"
                    onClick={triggerIngest}
                    disabled={ingesting}
                    title="Trigger OSINT ingest"
                  >
                    {ingesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full max-h-[700px] p-4">
                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {loadingIocs && displayedIocs.length === 0
                      ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-3 py-12 text-zinc-600">
                          <Loader2 className="w-8 h-8 animate-spin text-cyan-500/50" />
                          <span className="text-sm">Fetching intelligence...</span>
                        </motion.div>
                      )
                      : displayedIocs.length === 0
                        ? (
                          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3 py-12 text-zinc-600">
                            <ShieldAlert className="w-10 h-10 text-zinc-700" />
                            <span className="text-sm text-center">No indicators yet.<br />Click ⚡ to trigger an ingest cycle.</span>
                          </motion.div>
                        )
                        : displayedIocs.map((ioc, i) => <IoCItem key={`${ioc.ioc_value}-${i}`} ioc={ioc} index={i} />)
                    }
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
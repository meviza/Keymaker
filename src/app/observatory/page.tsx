"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
    Activity, Database, Cpu, Server, Zap, ShieldCheck, CheckCircle2,
    Clock, AlertTriangle, TrendingUp, Brain, Globe, Wrench, Key, RefreshCw
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    apiService,
    type InfraHealth, type AIState, type RAGHealth,
    type MaintenanceJob, type ROIMetrics, type AIMode
} from "@/lib/api/services"

// ─── AI Mode Config ──────────────────────────────────────────────────────────
const AI_MODE_CONFIG: Record<AIMode, { label: string; color: string; glow: string; description: string; icon: React.ElementType }> = {
    HUNTER: { label: "HUNTER", color: "text-red-400", glow: "0 0 20px rgba(239,68,68,0.4)", description: "Actively scanning and exploiting targets in the defined scope", icon: Globe },
    LEARNING: { label: "LEARNING", color: "text-cyan-400", glow: "0 0 20px rgba(0,212,255,0.4)", description: "Crawling threat databases, indexing new CVEs, and updating vector memory", icon: Brain },
    AWAITING_APPROVAL: { label: "AWAITING APPROVAL", color: "text-amber-400", glow: "0 0 20px rgba(251,191,36,0.4)", description: "High-risk action queued — waiting for operator confirmation before proceeding", icon: AlertTriangle },
    MAINTENANCE: { label: "MAINTENANCE", color: "text-purple-400", glow: "0 0 20px rgba(192,132,252,0.4)", description: "Running automated hygiene jobs: TTL purge, stale vector cleanup, index compaction", icon: Wrench },
    IDLE: { label: "IDLE", color: "text-zinc-400", glow: "none", description: "No active tasks — standing by for operator commands", icon: Cpu },
}

const STATUS_COLOR: Record<string, string> = {
    connected: "bg-emerald-500",
    healthy: "bg-emerald-500",
    degraded: "bg-amber-400",
    stale: "bg-amber-400",
    offline: "bg-red-500",
    completed: "bg-emerald-500",
    running: "bg-cyan-500 animate-pulse",
    pending: "bg-zinc-500",
    failed: "bg-red-500",
}

function FillBar({ percent, color = "bg-cyan-500" }: { percent: number; color?: string }) {
    const risk = percent > 85 ? "bg-red-500" : percent > 60 ? "bg-amber-400" : color
    return (
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <motion.div
                className={`h-full ${risk} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
        </div>
    )
}

export default function ObservatoryPage() {
    const [infra, setInfra] = useState<InfraHealth | null>(null)
    const [aiState, setAiState] = useState<AIState | null>(null)
    const [rag, setRag] = useState<RAGHealth | null>(null)
    const [jobs, setJobs] = useState<MaintenanceJob[]>([])
    const [roi, setRoi] = useState<ROIMetrics | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        const [i, a, r, j, m] = await Promise.all([
            apiService.getInfraHealth(),
            apiService.getAIState(),
            apiService.getRAGHealth(),
            apiService.getMaintenanceJobs(),
            apiService.getROIMetrics(),
        ])
        setInfra(i); setAiState(a); setRag(r); setJobs(j); setRoi(m)
        setLastRefresh(new Date())
        setLoading(false)
    }, [])

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            const [i, a, r, j, m] = await Promise.all([
                apiService.getInfraHealth(),
                apiService.getAIState(),
                apiService.getRAGHealth(),
                apiService.getMaintenanceJobs(),
                apiService.getROIMetrics(),
            ])
            if (cancelled) return
            setInfra(i)
            setAiState(a)
            setRag(r)
            setJobs(j)
            setRoi(m)
            setLastRefresh(new Date())
            setLoading(false)
        }

        void load()
        return () => {
            cancelled = true
        }
    }, [])

    const modeConfig = aiState ? AI_MODE_CONFIG[aiState.mode] : null
    const ModeIcon = modeConfig?.icon ?? Cpu

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3" style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
                        <Key className="w-8 h-8 text-cyan-400" />
                        System Observatory
                    </h1>
                    <p className="text-zinc-400 mt-1">Anahtarcı infrastructure health, data flow, and AI operational state.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchAll} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    {lastRefresh ? `Refreshed ${lastRefresh.toLocaleTimeString("tr-TR")}` : "Connecting..."}
                </Button>
            </div>

            {/* AI State Panel */}
            {aiState && modeConfig && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-panel border-white/10 overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${modeConfig.glow.replace("0 0 20px", "").trim().replace("rgba", "rgba").replace("0.4", "0.05")}, transparent 70%)` }} />
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-black/40 border border-white/10" style={{ boxShadow: modeConfig.glow }}>
                                    <ModeIcon className={`w-8 h-8 ${modeConfig.color}`} />
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${STATUS_COLOR.running ?? "bg-cyan-500"} border-2 border-black`} />
                                </div>
                                <div>
                                    <div className="text-xs text-zinc-500 font-mono tracking-widest">ANAHTARCI AI — CURRENT MODE</div>
                                    <div className={`text-2xl font-bold tracking-tight ${modeConfig.color}`}>{modeConfig.label}</div>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 glass-panel rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-zinc-400 mb-1">{modeConfig.description}</p>
                                    <p className="text-white font-medium">{aiState.currentTask}</p>
                                    <p className="text-xs text-zinc-500 mt-1">{aiState.taskDetail}</p>
                                </div>
                                <div className="glass-panel rounded-lg p-4 border border-white/5 space-y-2">
                                    <div className="flex justify-between text-xs text-zinc-400"><span>Confidence</span><span className="text-cyan-400 font-mono">{aiState.confidencePercent}%</span></div>
                                    <FillBar percent={aiState.confidencePercent} color="bg-cyan-500" />
                                    <div className="text-xs text-zinc-500 mt-1">⏱ {aiState.eta}</div>
                                    <div className="text-xs text-zinc-500 border-t border-white/5 pt-2 mt-2">
                                        Last decision: <span className="text-zinc-300">{aiState.lastDecision}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Data Sources + Infra Fill */}
            {infra && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Data Sources */}
                    <Card className="glass-panel border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white flex items-center gap-2 text-base"><Activity className="w-5 h-5 text-cyan-500" /> Live Data Sources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {infra.sources.map((src, i) => (
                                <motion.div key={src.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                    className="flex items-center justify-between p-2 rounded-md bg-black/20 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[src.status]}`} />
                                        <div>
                                            <p className="text-sm text-white font-medium">{src.name}</p>
                                            <p className="text-xs text-zinc-500">{src.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono text-cyan-400">{src.eventsPerSec.toLocaleString()}<span className="text-xs text-zinc-500"> ev/s</span></p>
                                        <Badge variant="outline" className={`text-xs capitalize ${src.status === 'connected' ? 'border-emerald-500/30 text-emerald-400' : src.status === 'degraded' ? 'border-amber-500/30 text-amber-400' : 'border-red-500/30 text-red-400'}`}>{src.status}</Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Infrastructure Fill */}
                    <Card className="glass-panel border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white flex items-center gap-2 text-base"><Server className="w-5 h-5 text-cyan-500" /> Infrastructure Utilization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "Kafka", detail: `${infra.kafka.topicsActive} topics · ${infra.kafka.messagesPerSec.toLocaleString()} msg/s · ${infra.kafka.lag} lag`, fill: infra.kafka.fillPercent, icon: Zap, iconClassName: "text-yellow-400" },
                                { label: "Redis", detail: `${infra.redis.memoryUsedMb} / ${infra.redis.memoryMaxMb} MB · Queue: ${infra.redis.queueDepth}`, fill: infra.redis.fillPercent, icon: Activity, iconClassName: "text-red-400" },
                                { label: "Qdrant Vectors", detail: `${(infra.qdrant.vectorCount / 1_000_000).toFixed(2)}M / ${(infra.qdrant.vectorMax / 1_000_000).toFixed(1)}M · ${infra.qdrant.collectionCount} collections`, fill: infra.qdrant.fillPercent, icon: Brain, iconClassName: "text-purple-400" },
                                { label: "Elasticsearch", detail: `${infra.elasticsearch.indexSizeGb} GB · ${(infra.elasticsearch.docsIndexed / 1_000_000).toFixed(1)}M docs · ${infra.elasticsearch.shardsActive} shards`, fill: infra.elasticsearch.fillPercent, icon: Database, iconClassName: "text-cyan-400" },
                                { label: "ClickHouse", detail: `${(infra.clickhouse.totalRecords / 1_000_000).toFixed(1)}M records · ${infra.clickhouse.storageUsedTb} TB · synced ${infra.clickhouse.lastSyncMins}m ago`, fill: Math.round(infra.clickhouse.storageUsedTb / 2 * 100), icon: Database, iconClassName: "text-blue-400" },
                            ].map(({ label, detail, fill, icon, iconClassName }) => {
                                const Icon = icon as LucideIcon
                                return (
                                <div key={label} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-zinc-300"><Icon className={`w-4 h-4 ${iconClassName}`} />{label}</div>
                                        <span className={`text-sm font-mono font-bold ${fill > 85 ? "text-red-400" : fill > 60 ? "text-amber-400" : "text-emerald-400"}`}>{fill}%</span>
                                    </div>
                                    <FillBar percent={fill} />
                                    <p className="text-xs text-zinc-500">{detail}</p>
                                </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* RAG + Maintenance + ROI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* RAG Health */}
                {rag && (
                    <Card className="glass-panel border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white flex items-center gap-2 text-base"><Brain className="w-5 h-5 text-purple-400" /> RAG Pipeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { label: "Embedding Model", value: rag.embeddingModel },
                                { label: "Vector Store", value: rag.vectorStore },
                                { label: "Documents Indexed", value: rag.documentCount.toLocaleString() },
                                { label: "Last Crawl", value: rag.lastCrawl },
                                { label: "Freshness", value: `${rag.freshnessMins} min ago` },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                                    <span className="text-zinc-400">{label}</span>
                                    <span className="text-zinc-100 font-mono text-xs">{value}</span>
                                </div>
                            ))}
                            <div className="flex gap-3 mt-2">
                                {[{ label: "ChromaDB", status: rag.chromaStatus }, { label: "Qdrant", status: rag.qdrantStatus }].map(({ label, status }) => (
                                    <div key={label} className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[status]}`} />
                                        <span className="text-xs text-zinc-400">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Maintenance Jobs */}
                <Card className="glass-panel border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center gap-2 text-base"><Wrench className="w-5 h-5 text-amber-400" /> Maintenance Jobs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex items-start justify-between gap-2 p-2 rounded bg-black/20 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${STATUS_COLOR[job.status]}`} />
                                    <div>
                                        <p className="text-xs text-white font-medium leading-tight">{job.name}</p>
                                        <p className="text-xs text-zinc-500">{job.lastRun} · {job.duration}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={`text-xs capitalize flex-shrink-0 ${job.status === 'completed' ? 'border-emerald-500/30 text-emerald-400' : job.status === 'running' ? 'border-cyan-500/30 text-cyan-400' : job.status === 'failed' ? 'border-red-500/30 text-red-400' : 'border-zinc-600/30 text-zinc-400'}`}>{job.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* ROI metrics */}
                {roi && (
                    <Card className="glass-panel border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white flex items-center gap-2 text-base"><TrendingUp className="w-5 h-5 text-emerald-400" /> Value Delivered</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Blocked Today", value: roi.threatsBlockedToday, color: "text-red-400", icon: ShieldCheck },
                                { label: "Blocked / Week", value: roi.threatsBlockedWeek, color: "text-orange-400", icon: ShieldCheck },
                                { label: "Blocked / Month", value: roi.threatsBlockedMonth.toLocaleString(), color: "text-amber-400", icon: ShieldCheck },
                                { label: "CVEs Found", value: roi.cvesDiscovered, color: "text-purple-400", icon: AlertTriangle },
                                { label: "Sentinel Stops", value: roi.sentinelInterceptions, color: "text-cyan-400", icon: CheckCircle2 },
                                { label: "Auto-Stopped Payloads", value: roi.payloadsAutoStopped, color: "text-emerald-400", icon: CheckCircle2 },
                                { label: "Scans Run", value: roi.scansConducted, color: "text-blue-400", icon: Activity },
                                { label: "Reports Gen.", value: roi.reportGenerated, color: "text-zinc-300", icon: Clock },
                            ].map(({ label, value, color, icon }) => {
                                const Icon = icon as LucideIcon
                                return (
                                <div key={label} className="glass-panel rounded-md p-3 border border-white/5">
                                    <div className={`flex items-center gap-1 text-xs mb-1 ${color}`}><Icon className="w-4 h-4" /><span>{label}</span></div>
                                    <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
                                </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

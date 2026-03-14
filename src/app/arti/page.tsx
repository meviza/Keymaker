"use client";

import { useState, useEffect, useRef } from "react";
import {
    Zap, Terminal, Activity, Play, Square, Loader2, ShieldCheck,
    Target, Brain, PackageCheck, ChevronRight, X, GitBranch,
    Search, Eye, Crosshair, Bug, Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LogEntry {
    timestamp: string;
    type: "Thought" | "Action" | "Observation" | "Feedback" | "System";
    message: string;
}

interface Finding {
    type?: string;
    exploit_type?: string;
    status?: string;
    os?: string;
    evidence?: string;
    vulnerabilities?: Array<{ id: string; description?: string; cvss?: number }>;
    ports?: Array<{ portid: string | number; protocol?: string; service?: string }>;
    hostname?: string;
    ip?: string;
    [key: string]: unknown;
}

interface ARTiStatus {
    session_id: string;
    status: string;
    logs: LogEntry[];
    findings: Finding[];
}

// ─── Kill Chain Steps ─────────────────────────────────────────────────────────
const KILL_CHAIN = [
    { id: "recon", label: "Recon", icon: Search },
    { id: "scan", label: "Scan", icon: Eye },
    { id: "exploit", label: "Exploit", icon: Crosshair },
    { id: "post", label: "Post", icon: Bug },
    { id: "persist", label: "Persist", icon: Database },
] as const;

function inferKillChainStage(logs: LogEntry[]): number {
    const combined = logs.map(l => l.message).join(" ").toLowerCase();
    if (combined.includes("persist") || combined.includes("lateral")) return 4;
    if (combined.includes("exploit") || combined.includes("payload")) return 3;
    if (combined.includes("scan") || combined.includes("port")) return 2;
    if (combined.includes("recon") || combined.includes("footprint")) return 1;
    return 0;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTypeColor(type: string) {
    switch (type) {
        case "Thought": return "text-blue-400";
        case "Action": return "text-amber-400";
        case "Observation": return "text-cyber-green";
        case "Feedback": return "text-purple-400";
        case "System": return "text-zinc-500";
        default: return "text-white";
    }
}

// ─── Finding Drill-Down Panel ─────────────────────────────────────────────────
function FindingDetail({ finding, onClose }: { finding: Finding; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="absolute inset-0 z-20 bg-cyber-dark/95 backdrop-blur-sm rounded-xl border border-white/10 p-5 overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-cyber-green uppercase tracking-widest">
                    Intelligence Detail
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <div className="space-y-4 text-sm">
                {/* Type badge */}
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Type</p>
                    <span className="px-2 py-0.5 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs rounded font-mono">
                        {finding.type || finding.exploit_type || "Discovery"}
                    </span>
                </div>

                {/* Host info */}
                {(finding.hostname || finding.ip) && (
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Host</p>
                        <p className="text-white font-mono">{finding.hostname || finding.ip}</p>
                    </div>
                )}

                {/* OS */}
                {finding.os && (
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">OS Detected</p>
                        <p className="text-amber-300 font-mono">{finding.os}</p>
                    </div>
                )}

                {/* Open ports */}
                {finding.ports && finding.ports.length > 0 && (
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Open Ports</p>
                        <div className="flex flex-wrap gap-1.5">
                            {finding.ports.map((p, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[10px] rounded font-mono">
                                    {p.portid}/{p.protocol || "tcp"} {p.service ? `(${p.service})` : ""}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* CVEs */}
                {finding.vulnerabilities && finding.vulnerabilities.length > 0 && (
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                            CVEs ({finding.vulnerabilities.length})
                        </p>
                        <div className="space-y-2">
                            {finding.vulnerabilities.map((v, i) => (
                                <div key={i} className="p-2 bg-red-500/5 border border-red-500/20 rounded">
                                    <div className="flex justify-between items-center">
                                        <span className="text-red-300 font-mono text-xs font-bold">{v.id}</span>
                                        {v.cvss !== undefined && (
                                            <span className={`text-[10px] font-bold ${v.cvss >= 9 ? "text-red-400" : v.cvss >= 7 ? "text-orange-400" : "text-yellow-400"}`}>
                                                CVSS {v.cvss}
                                            </span>
                                        )}
                                    </div>
                                    {v.description && (
                                        <p className="text-zinc-400 text-[10px] mt-1">{v.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Evidence */}
                {finding.evidence && (
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Evidence</p>
                        <pre className="text-zinc-300 text-[10px] font-mono bg-black/40 p-2 rounded whitespace-pre-wrap">
                            {finding.evidence}
                        </pre>
                    </div>
                )}

                {/* Status */}
                {finding.status && (
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-white">{finding.status}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── Status Card ──────────────────────────────────────────────────────────────
function StatusCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
    return (
        <div className="glass-panel p-4 border border-white/10 flex flex-col justify-center gap-1 hover:border-white/20 transition-all">
            <div className="flex items-center gap-2 text-zinc-500">
                {icon}
                <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
            </div>
            <div className={`text-xl font-bold truncate text-${color}`}>{value}</div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ARTiPage() {
    const [target, setTarget] = useState("system");
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState<ARTiStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Poll status
    useEffect(() => {
        if (!isActive) return;
        const id = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/arti/status/${target}`);
                if (!res.ok) return;
                const data: ARTiStatus = await res.json();
                setStatus(data);
                if (data.status === "completed" || data.status === "stopped") setIsActive(false);
            } catch { /* silent */ }
        }, 2000);
        return () => clearInterval(id);
    }, [isActive, target]);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [status?.logs]);

    const startARTi = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/v1/arti/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target }),
            });
            if (res.ok) setIsActive(true);
        } finally { setLoading(false); }
    };

    const stopARTi = async () => {
        await fetch(`http://localhost:8000/api/v1/arti/stop/${target}`, { method: "POST" });
        setIsActive(false);
    };

    const stage = inferKillChainStage(status?.logs ?? []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* HEADER */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-cyber-green/20 rounded-lg border border-cyber-green/30">
                            <Zap className="w-8 h-8 text-cyber-green animate-neon-pulse" />
                        </div>
                        ARTi Command Center
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        <span className="text-cyber-green font-mono font-semibold">Anahtarcı</span>
                        {" "}Autonomous Red Team Engine — ReAct Loop
                    </p>
                </div>

                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        disabled={isActive}
                        className="glass-panel px-4 py-2 border border-white/10 rounded-lg bg-black/40 text-white focus:border-cyber-green/50 outline-none w-64 font-mono"
                        placeholder="Target IP / Domain…"
                    />
                    {!isActive ? (
                        <button
                            onClick={startARTi}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-cyber-green/80 hover:bg-cyber-green text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                            Initiate Loop
                        </button>
                    ) : (
                        <button
                            onClick={stopARTi}
                            className="flex items-center gap-2 px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            <Square className="w-5 h-5 fill-current" />
                            Terminate
                        </button>
                    )}
                </div>
            </div>

            {/* KILL CHAIN VISUALISER */}
            <div className="glass-panel p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-1 mb-2">
                    <GitBranch className="w-4 h-4 text-zinc-500" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Kill Chain Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    {KILL_CHAIN.map((step, i) => {
                        const Icon = step.icon;
                        const active = i <= stage;
                        const current = i === stage && isActive;
                        return (
                            <div key={step.id} className="flex items-center gap-2 flex-1 min-w-0">
                                <div className={`flex flex-col items-center gap-1 flex-1 min-w-0 transition-all duration-500 ${active ? "opacity-100" : "opacity-30"}`}>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${current ? "border-cyber-green bg-cyber-green/20 shadow-[0_0_12px_rgba(0,255,157,0.5)]" :
                                            active ? "border-cyber-green/60 bg-cyber-green/10" : "border-white/20"
                                        }`}>
                                        <Icon className={`w-4 h-4 ${active ? "text-cyber-green" : "text-zinc-600"}`} />
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? "text-cyber-green" : "text-zinc-600"}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {i < KILL_CHAIN.length - 1 && (
                                    <div className={`h-px flex-1 transition-all duration-700 ${i < stage ? "bg-cyber-green/60" : "bg-white/10"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatusCard icon={<Target className="text-zinc-400" />} label="Current Target" value={target} color="white" />
                <StatusCard
                    icon={<Activity className={isActive ? "text-cyber-green animate-pulse" : "text-zinc-400"} />}
                    label="ARTi Status"
                    value={status?.status || "Idle"}
                    color={isActive ? "cyber-green" : "zinc-400"}
                />
                <StatusCard
                    icon={<Brain className="text-blue-400" />}
                    label="AI Iterations"
                    value={status?.logs.filter(l => l.type === "Thought").length ?? 0}
                    color="blue-400"
                />
                <StatusCard
                    icon={<PackageCheck className="text-purple-400" />}
                    label="Findings"
                    value={status?.findings.length ?? 0}
                    color="purple-400"
                />
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-12 gap-6">
                {/* Thought Stream (left 8 cols) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col h-[520px]">
                    <div className="glass-panel overflow-hidden flex-1 flex flex-col border border-white/10 rounded-xl">
                        <div className="bg-black/40 px-4 py-2 flex items-center gap-2 border-b border-white/10">
                            <Terminal className="w-4 h-4 text-zinc-500" />
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Autonomous Logical Stream</span>
                            {isActive && <span className="ml-auto text-[10px] text-cyber-green animate-pulse">● LIVE</span>}
                        </div>
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2.5 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {status?.logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3 group"
                                    >
                                        <span className="text-zinc-600 shrink-0 tabular-nums">
                                            [{log.timestamp.includes("T") ? log.timestamp.split("T")[1]?.split(".")[0] : log.timestamp}]
                                        </span>
                                        <span className={`font-bold shrink-0 w-24 ${getTypeColor(log.type)}`}>
                                            {log.type.toUpperCase()}
                                        </span>
                                        <span className="text-zinc-300 leading-relaxed">{log.message}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {!status && (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-4">
                                    <Terminal className="w-16 h-16 opacity-10" />
                                    <p className="tracking-widest animate-pulse text-sm">AWAITING SYSTEM BOOT</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Intelligence Feed (right 4 cols) */}
                <div className="col-span-12 lg:col-span-4 h-[520px] relative">
                    <div className="glass-panel h-full overflow-hidden flex flex-col border border-white/10 rounded-xl">
                        <div className="bg-black/40 px-4 py-2 flex items-center gap-2 border-b border-white/10">
                            <ShieldCheck className="w-4 h-4 text-cyber-green" />
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Intelligence Feed</span>
                            {(status?.findings.length ?? 0) > 0 && (
                                <span className="ml-auto text-[10px] bg-cyber-green/10 text-cyber-green border border-cyber-green/30 px-1.5 py-0.5 rounded">
                                    {status?.findings.length} found
                                </span>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            <AnimatePresence>
                                {status?.findings.map((f, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => setSelectedFinding(f)}
                                        className="w-full text-left p-3 bg-white/5 rounded-lg border border-white/10 border-l-2 border-l-cyber-green space-y-1.5 hover:bg-white/10 hover:border-l-cyber-green transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">
                                                {f.type || f.exploit_type || "Discovery"}
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyber-green transition-colors" />
                                        </div>
                                        <div className="text-white text-xs font-semibold truncate">
                                            {f.hostname || f.ip || f.status || f.os || "Finding"}
                                        </div>
                                        {(f.vulnerabilities?.length ?? 0) > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {f.vulnerabilities!.slice(0, 3).map((v, j) => (
                                                    <span key={j} className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 rounded font-mono">
                                                        {v.id}
                                                    </span>
                                                ))}
                                                {(f.vulnerabilities?.length ?? 0) > 3 && (
                                                    <span className="text-[9px] text-zinc-500">+{f.vulnerabilities!.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </AnimatePresence>

                            {!(status?.findings.length) && (
                                <div className="h-full flex items-center justify-center text-zinc-700 italic text-sm">
                                    No vectors established yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Drill-down overlay */}
                    <AnimatePresence>
                        {selectedFinding && (
                            <FindingDetail finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

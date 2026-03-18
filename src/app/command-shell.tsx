"use client";

import {
  ChevronDown,
  Clock,
  Cpu,
  Crosshair,
  FileCheck2,
  Filter,
  Network,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiService, type LiveFeedItem, type SystemStatus } from "@/lib/api/services";
import { sanitizeTarget, isValidTarget } from "@/lib/sanitize";

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-2xl font-mono text-white tabular-nums">
      {time} <span className="text-sm text-gray-500">LOCAL</span>
    </p>
  );
}

const SOURCE_COLORS: Record<string, string> = {
  eBPF: "text-purple-400 border-purple-400/40 bg-purple-400/10",
  CTI: "text-blue-400 border-blue-400/40 bg-blue-400/10",
  ARTi: "text-cyber-green border-cyber-green/40 bg-cyber-green/10",
  Audit: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  "Kafka:keymaker.scans": "text-orange-400 border-orange-400/40 bg-orange-400/10",
};

const DEFAULT_SOURCE = "text-gray-400 border-white/20 bg-white/5";
const FEED_FILTERS = ["ALL", "eBPF", "CTI", "ARTi", "Audit", "Anahtarci Command"] as const;

type FeedFilter = (typeof FEED_FILTERS)[number];

function sourceBadge(source: string) {
  const key = Object.keys(SOURCE_COLORS).find((item) => source.includes(item));
  return key ? SOURCE_COLORS[key] : DEFAULT_SOURCE;
}

export default function CommandShell() {
  const [target, setTarget] = useState("");
  const [scanType, setScanType] = useState<"recon" | "vulnerability" | "exploit" | "stealth" | "dos" | "full_audit">("recon");
  const [isScanning, setIsScanning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [threatStats, setThreatStats] = useState<Array<{ label: string; value: number; change?: number }>>([]);
  const [liveFeed, setLiveFeed] = useState<LiveFeedItem[]>([]);
  const [targets, setTargets] = useState<Array<{ id: string; name: string; url: string; type: string }>>([]);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("ALL");
  const [lastUpdated, setLastUpdated] = useState<Record<string, Date>>({});
  const [prediction, setPrediction] = useState<{ cve: string; probability: number; level: string } | null>(null);
  const [targetHistory, setTargetHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [environmentReadiness, setEnvironmentReadiness] = useState<{ ready_count: number; total_count: number } | null>(null);
  const [executiveSnapshot, setExecutiveSnapshot] = useState<Record<string, unknown> | null>(null);
  // statsUpdatedAt removed — was write-only

  useEffect(() => {
    const load = async () => {
      try {
        const [status, threats, feed, targetList] = await Promise.all([
          apiService.getSystemStatus(),
          apiService.getThreatStats(),
          apiService.getLiveFeed(),
          apiService.getTargets(),
        ]);
        const [env, executive] = await Promise.all([
          apiService.getEnvironmentReadiness(),
          apiService.getExecutiveSnapshot("default-enterprise").catch(() => null),
        ]);
        setSystemStatus(status);
        setThreatStats(threats);
        setLiveFeed(feed.slice(0, 30));
        setTargets(targetList.map((t) => ({ id: t.id, name: t.name, url: t.url, type: t.type })));
        setEnvironmentReadiness(env);
        setExecutiveSnapshot(executive);
        setLastUpdated((prev) => ({ ...prev, stats: new Date() }));
      } catch {}
    };
    load();

    const unsub = apiService.subscribeToLiveFeed((item: LiveFeedItem) => {
      setLiveFeed((prev) => [{ ...item, source: item.source || "Backend" }, ...prev].slice(0, 60));
    });
    return () => unsub();
  }, []);

  const filteredFeed = useMemo(
    () => feedFilter === "ALL" ? liveFeed : liveFeed.filter((e) => (e.source || "").includes(feedFilter)),
    [liveFeed, feedFilter]
  );

  const handleEngage = async () => {
    const cleanTarget = sanitizeTarget(target);
    if (!cleanTarget || !isValidTarget(cleanTarget)) return;
    setTarget(cleanTarget);
    setIsScanning(true);
    setTargetHistory((prev) => [target, ...prev.filter((t) => t !== target)].slice(0, 5));
    setShowHistory(false);

    const injectFeed = (event: string, severity: LiveFeedItem["severity"], source: string) =>
      setLiveFeed((prev) => [
        { id: `local-${Date.now()}`, timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }), event, severity, source },
        ...prev,
      ].slice(0, 60));

    const profileLabels: Record<string, string> = {
      recon: "Reconnaissance",
      vulnerability: "Vulnerability Scan",
      exploit: "Exploit Chain",
      stealth: "Stealth Infiltration",
      dos: "Denial-of-Service Simulation",
      full_audit: "Full Audit",
    };

    injectFeed(`Swarm initialised for '${target}' - profile: ${profileLabels[scanType] ?? scanType}`, "info", "Anahtarci Command");

    try {
      const result = await apiService.startScan({
        target: target.trim(),
        scanType: scanType as import("@/lib/api/services").ScanProfile,
      });

      injectFeed(`Engaged - task ${result.taskId ?? "dispatched"} queued [${result.status}]`, "info", "Anahtarci Command");

      if (scanType === "full_audit") {
        try {
          const pred = await apiService.predictCVE("CVE-2024-6387", 8.1);
          if (pred?.prediction) {
            setPrediction({ cve: pred.cve_id ?? "CVE-2024-6387", probability: pred.prediction.probability, level: pred.prediction.threat_level });
            injectFeed(
              `AI Prediction: CVE-2024-6387 exploitability ${(pred.prediction.probability * 100).toFixed(0)}% - ${pred.prediction.threat_level}`,
              "warning",
              "CVE Predictor",
            );
          }
        } catch (predErr: unknown) {
          console.warn("[Frontend] CVE Prediction failed: " + (predErr instanceof Error ? predErr.message : String(predErr)));
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      injectFeed(`Engage failed for '${target}': ${msg.slice(0, 120)}`, "critical", "Anahtarci Command");
    } finally {
      setIsScanning(false);
    }
  };

  const ago = (date: Date | undefined) => {
    if (!date) return "-";
    const sec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (sec < 60) return `${sec}s ago`;
    return `${Math.floor(sec / 60)}m ago`;
  };

  const currentStats = [
    {
      title: "Active Agents",
      value: systemStatus ? `${systemStatus.agents.active}/${systemStatus.agents.total}` : "0/0",
      sub: systemStatus?.status === "operational" ? "All systems nominal" : systemStatus?.message || "Initialising...",
      icon: Cpu,
      color: systemStatus?.status === "critical" ? "cyber-red" : systemStatus?.status === "warning" ? "cyber-yellow" : "cyber-green",
      updatedAt: lastUpdated.stats,
    },
    {
      title: "Predictive Risk",
      value: prediction ? `${(prediction.probability * 100).toFixed(1)}%` : "-",
      sub: prediction ? `${prediction.cve} - ${prediction.level}` : "Run full_audit to activate",
      icon: Zap,
      color: "cyber-yellow",
      updatedAt: prediction ? new Date() : undefined,
    },
    {
      title: "Env Secrets",
      value: environmentReadiness ? `${environmentReadiness.ready_count}/${environmentReadiness.total_count}` : "-",
      sub: "Integration secret coverage",
      icon: ShieldCheck,
      color: environmentReadiness && environmentReadiness.ready_count === environmentReadiness.total_count ? "cyber-green" : "cyber-yellow",
      updatedAt: undefined,
    },
    {
      title: "Evidence State",
      value: Array.isArray(executiveSnapshot?.metrics) ? String((executiveSnapshot?.metrics as Array<Record<string, unknown>>).length) : "0",
      sub: "Executive snapshot metrics",
      icon: FileCheck2,
      color: "cyber-blue",
      updatedAt: lastUpdated.stats,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase text-glow-green">Anahtarci</h1>
          <p className="text-gray-400 mt-1">
            <span className="text-cyber-green font-mono font-semibold">Keymaker</span> Autonomous Command Center // Status:{" "}
            <span className="text-cyber-green font-bold animate-pulse">ENGAGED</span>
          </p>
        </div>
        <div className="text-right hidden md:block">
          <LiveClock />
          <p className="text-xs text-cyber-green uppercase tracking-widest">System Secure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            "cyber-green": "text-cyber-green",
            "cyber-red": "text-cyber-red",
            "cyber-blue": "text-cyber-blue",
            "cyber-yellow": "text-cyber-yellow",
          };
          const colorClass = colorMap[stat.color] ?? "text-gray-400";

          return (
            <div key={index} className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:bg-white/5 transition-all">
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}/10 rounded-full blur-3xl group-hover:bg-${stat.color}/20 transition-all`} />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className={`text-3xl font-bold mt-2 ${colorClass}`}>{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}/20 border border-${stat.color}/50 ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className={`text-xs mt-3 font-medium ${colorClass}`}>{stat.sub}</p>
              {stat.updatedAt && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Updated {ago(stat.updatedAt)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[640px]">
        <div className="glass-panel p-8 rounded-xl neon-border-green relative flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-green/50 to-transparent" />
          <h2 className="text-xl font-bold text-white mb-6 flex items-center uppercase tracking-wider">
            <Crosshair className="w-5 h-5 mr-2 text-cyber-green animate-neon-pulse" />
            Target Acquisition
          </h2>

          <div className="space-y-5 flex-1 overflow-y-auto pr-1 pb-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block uppercase tracking-wide">Target IP / Domain / CIDR</label>
              <div className="relative">
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g., 192.168.1.0/24 or target.corp"
                  className="w-full bg-black/50 border border-white/10 rounded-md py-4 px-4 pl-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-green/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all font-mono"
                />
                <Network className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>

              {targetHistory.length > 0 && (
                <div className="mt-2 relative">
                  <button onClick={() => setShowHistory((h) => !h)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    <Clock className="w-3 h-3" /> Recent targets <ChevronDown className="w-3 h-3" />
                  </button>
                  {showHistory && (
                    <div className="absolute z-20 mt-1 w-full bg-cyber-dark border border-white/10 rounded-md shadow-xl">
                      {targetHistory.map((t, i) => (
                        <button key={i} onClick={() => { setTarget(t); setShowHistory(false); }} className="w-full text-left px-4 py-2 text-sm font-mono text-gray-300 hover:bg-white/5 hover:text-cyber-green transition-all">
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {targets.length > 0 && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Or Select Test Target</label>
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md py-2 px-3 text-white focus:border-cyber-green/50 focus:outline-none font-mono text-sm">
                  <option value="">Choose a sandbox target...</option>
                  {targets.map((t) => (
                    <option key={t.id} value={t.url}>
                      {t.name} ({t.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block uppercase tracking-wide">Operation Profile</label>
              <div className="grid grid-cols-2 gap-3">
                {(["recon", "vulnerability", "exploit", "stealth", "dos", "full_audit"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setScanType(type)}
                    className={`py-3 rounded-md border text-xs font-bold uppercase tracking-wider transition-all ${scanType === type ? "bg-cyber-green/20 border-cyber-green text-cyber-green shadow-[0_0_10px_rgba(0,255,157,0.2)]" : "bg-black/30 border-white/10 text-gray-400 hover:bg-white/5"}`}
                  >
                    {type.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleEngage}
            disabled={!target || isScanning}
            className={`w-full mt-auto btn-cyber-primary py-5 text-lg flex items-center justify-center relative overflow-hidden group ${isScanning || !target ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isScanning ? (
              <span className="flex items-center"><Zap className="w-5 h-5 mr-2 animate-spin" /> ENGAGING...</span>
            ) : (
              <span className="flex items-center"><Zap className="w-5 h-5 mr-2 group-hover:animate-neon-pulse" /> ENGAGE TARGET</span>
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyber-green/10 to-transparent opacity-0 group-hover:opacity-100 animate-scanline pointer-events-none" />
          </button>
        </div>

        <div className="glass-panel rounded-xl border border-white/10 p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-white">
            <Network className="h-5 w-5 text-cyber-blue" />
            Enterprise Posture
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Environment</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {environmentReadiness ? `${environmentReadiness.ready_count}/${environmentReadiness.total_count}` : "--"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">Configured secret references</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Executive Snapshot</p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-zinc-300">
                {JSON.stringify(executiveSnapshot ?? { status: "pending" }, null, 2)}
              </pre>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Threat Index</p>
              <div className="mt-3 space-y-2">
                {threatStats.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm text-zinc-300">
                    <span>{item.label}</span>
                    <span className="font-mono text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-8 rounded-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue/50 to-transparent" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-white flex items-center uppercase tracking-wider flex-shrink-0">
              <Terminal className="w-5 h-5 mr-2 text-cyber-blue" />
              Live Intel Feed
            </h2>

            <div className="flex flex-wrap gap-1.5 sm:ml-auto">
              <Filter className="w-4 h-4 text-gray-600 self-center mr-1 flex-shrink-0" />
              {FEED_FILTERS.map((f) => (
                <button key={f} onClick={() => setFeedFilter(f)} className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${feedFilter === f ? "bg-cyber-blue/20 border-cyber-blue/60 text-cyber-blue" : "border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20"}`}>
                  {f === "ALL" ? `All (${liveFeed.length})` : f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                {liveFeed.length > 0 && <span className="animate-ping absolute h-full w-full rounded-full bg-cyber-blue opacity-75" />}
                <span className="relative rounded-full h-2 w-2 bg-cyber-blue" />
              </span>
              <span className="text-[10px] text-cyber-blue font-medium uppercase tracking-widest">Real-time</span>
            </div>
          </div>

          <div className="flex-1 bg-black/50 rounded-lg border border-white/10 p-4 overflow-y-auto font-mono text-sm relative custom-scrollbar">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
            <div className="space-y-2 relative z-10">
              {filteredFeed.length === 0 && <p className="text-gray-600 italic text-center mt-8">No events match filter &quot;{feedFilter}&quot;</p>}
              {filteredFeed.map((log) => (
                <div key={log.id} className={`terminal-line ${log.severity === "info" ? "terminal-success" : log.severity === "critical" ? "terminal-error" : "terminal-warning"}`}>
                  <span className="opacity-50 mr-3">[{log.timestamp}]</span>
                  {log.source && <span className={`text-[10px] font-bold border rounded px-1 mr-2 ${sourceBadge(log.source)}`}>{log.source}</span>}
                  <span>{log.event}</span>
                </div>
              ))}
              <div className="terminal-line border-transparent text-gray-600 animate-pulse mt-4">
                <span className="opacity-50 mr-3">[STANDBY]</span>Awaiting agent signals..._
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import { useState, useEffect, useCallback } from "react"
import {
  FileText, Download, Loader2, RefreshCw, Shield, AlertTriangle,
  CheckCircle2, ChevronDown, ChevronUp, Zap, Users, Code2
} from "lucide-react"
import { apiService } from "@/lib/api/services"
import { getToken } from "@/lib/auth/session"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Report {
  id: string
  filename: string
  template: "executive" | "technical"
  target: string
  generated_at: string
  size_kb: number
}

interface GenerationJob {
  report_id: string
  status: "queued" | "generating" | "ready" | "error"
  filename?: string
  error?: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const API = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1`

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  } catch { return iso }
}

function TemplateBadge({ template }: { template: string }) {
  const exec = template === "executive"
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase
      ${exec ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
        : "bg-purple-500/15 text-purple-300 border border-purple-500/30"}`}>
      {exec ? <Users className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
      {exec ? "Executive" : "Technical"}
    </span>
  )
}

// ─── Generate Modal ──────────────────────────────────────────────────────────

function GenerateModal({ onClose, onJobStarted }: {
  onClose: () => void
  onJobStarted: (job: GenerationJob) => void
}) {
  const [template, setTemplate] = useState<"executive" | "technical">("executive")
  const [target, setTarget] = useState("system")
  const [client, setClient] = useState("Keymaker Enterprise Client")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleGenerate() {
    setLoading(true); setError("")
    try {
      const data = await apiService.generateReport({ target_id: target, template })
      if (!data.report_id) throw new Error(data.message ?? "Report job id missing")
      onJobStarted({ report_id: data.report_id, status: "queued" })
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-[#0D1117]/95 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Generate New Report
        </h2>

        {/* Template selector */}
        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Report Type</label>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {(["executive", "technical"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all
                ${template === t
                  ? t === "executive"
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-purple-500 bg-purple-500/10 text-purple-300"
                  : "border-white/10 text-zinc-400 hover:border-white/20"}`}
            >
              {t === "executive" ? <Users className="w-6 h-6" /> : <Code2 className="w-6 h-6" />}
              <div className="text-sm font-semibold capitalize">{t}</div>
              <div className="text-[10px] text-center leading-tight opacity-70">
                {t === "executive"
                  ? "Boardroom KPIs · AI Summary · Risk Score"
                  : "CVE Tables · Audit Logs · Exploit Chains"}
              </div>
            </button>
          ))}
        </div>

        <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Target System</label>
        <input
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="e.g. dvwa_target, 10.0.0.1"
          className="w-full mb-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600
            focus:outline-none focus:border-cyan-500/60 transition"
        />

        <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Client Name</label>
        <input
          value={client}
          onChange={e => setClient(e.target.value)}
          placeholder="Client / Organisation Name"
          className="w-full mb-5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600
            focus:outline-none focus:border-cyan-500/60 transition"
        />

        {error && (
          <p className="text-red-400 text-xs mb-4 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white flex items-center justify-center gap-2 transition"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
              : <><FileText className="w-4 h-4" />Generate PDF</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Report Row ───────────────────────────────────────────────────────────────

function ReportRow({ report }: { report: Report }) {
  const [expanded, setExpanded] = useState(false)

  function handleDownload() {
    window.open(`${API}/reports/download/${report.filename}`, "_blank")
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition-all overflow-hidden">
      <div className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div className={`mt-0.5 p-2.5 rounded-lg border flex-shrink-0
            ${report.template === "executive"
              ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
              : "bg-purple-500/10 border-purple-500/30 text-purple-400"}`}>
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-sm truncate">{report.id}</h3>
              <TemplateBadge template={report.template} />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 font-mono">
              <span>TARGET: <span className="text-zinc-300">{report.target}</span></span>
              <span>•</span>
              <span>{fmtDate(report.generated_at)}</span>
              <span>•</span>
              <span>{report.size_kb} KB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          <button
            onClick={() => setExpanded(p => !p)}
            className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 transition"
            title="Details"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10
              text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/5 px-5 py-4 bg-white/[0.02]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Report ID", value: report.id },
              { label: "Template", value: report.template },
              { label: "Size", value: `${report.size_kb} KB` },
              { label: "Generated", value: fmtDate(report.generated_at) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-xs text-zinc-200 font-mono">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Active Job Banner ────────────────────────────────────────────────────────

function JobBanner({ job, onDone }: { job: GenerationJob; onDone: () => void }) {
  const [status, setStatus] = useState(job.status)
  const [filename, setFilename] = useState(job.filename)

  useEffect(() => {
    if (status === "ready" || status === "error") return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/reports/status/${job.report_id}`, { headers: authHeaders() })
        const data = await res.json()
        setStatus(data.status)
        if (data.filename) setFilename(data.filename)
        if (data.status === "ready" || data.status === "error") {
          clearInterval(interval)
          if (data.status === "ready") onDone()
        }
      } catch { /* ignore */ }
    }, 2000)
    return () => clearInterval(interval)
  }, [job.report_id, onDone, status])

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm
      ${status === "error"
        ? "border-red-500/30 bg-red-500/10 text-red-300"
        : status === "ready"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
      {status === "ready"
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        : status === "error"
          ? <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          : <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <span className="font-semibold">{job.report_id}</span>
        {" — "}
        {status === "queued" && "Queued for generation…"}
        {status === "generating" && "Generating PDF report…"}
        {status === "ready" && "Report ready for download!"}
        {status === "error" && "Generation failed"}
      </div>
      {status === "ready" && filename && (
        <a
          href={`${API}/reports/download/${filename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border
            border-emerald-500/30 text-emerald-300 text-xs font-semibold transition flex-shrink-0"
        >
          <Download className="w-3 h-3" />Download
        </a>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [jobs, setJobs] = useState<GenerationJob[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<"all" | "executive" | "technical">("all")

  const fetchReports = useCallback(async () => {
    try {
      const data = await apiService.listReports()
      setReports(
        (data ?? []).map((item) => ({
          id: item.id,
          filename: item.file_path.split("/").pop() ?? `${item.id}.pdf`,
          template: item.template === "technical" ? "technical" : "executive",
          target: item.target_id,
          generated_at: item.generated_at,
          size_kb: item.size_kb,
        }))
      )
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  const filtered = filter === "all" ? reports : reports.filter(r => r.template === filter)
  const execCount = reports.filter(r => r.template === "executive").length
  const techCount = reports.filter(r => r.template === "technical").length

  return (
    <>
      {showModal && (
        <GenerateModal
          onClose={() => setShowModal(false)}
          onJobStarted={(job) => {
            setJobs(p => [job, ...p])
          }}
        />
      )}

      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1
              className="text-3xl font-bold text-white tracking-tight"
              style={{ textShadow: "0 0 24px rgba(0,212,255,0.3)" }}
            >
              Enterprise Reports
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">
              AI-powered · Palo Alto & CrowdStrike caliber PDF intelligence reports
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={fetchReports}
              className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500
                text-white text-sm font-semibold transition shadow-lg shadow-cyan-500/20"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: reports.length, icon: FileText, color: "text-cyan-400" },
            { label: "Executive", value: execCount, icon: Users, color: "text-blue-400" },
            { label: "Technical", value: techCount, icon: Code2, color: "text-purple-400" },
            {
              label: "Active Jobs", value: jobs.filter(j => j.status !== "ready" && j.status !== "error").length,
              icon: Zap, color: "text-amber-400"
            },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${color}`}>
                {(() => {
                  const Icon = icon
                  return <Icon className="w-4 h-4" />
                })()}
                {label}
              </div>
              <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Active jobs */}
        {jobs.length > 0 && (
          <div className="space-y-2">
            {jobs.map(job => (
              <JobBanner key={job.report_id} job={job} onDone={fetchReports} />
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "executive", "technical"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition
                ${filter === f
                  ? "bg-cyan-600 text-white"
                  : "border border-white/10 text-zinc-400 hover:bg-white/5"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Report list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading reports…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
            <Shield className="w-12 h-12 opacity-20" />
            <p className="text-sm">No reports yet. Generate your first AI-powered PDF report.</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30
                text-cyan-300 text-sm hover:bg-cyan-600/30 transition"
            >
              <FileText className="w-4 h-4" />Generate Report
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(report => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

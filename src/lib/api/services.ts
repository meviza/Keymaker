// API Services - Clean Architecture Layer
import { fetchClient } from './fetchClient'
import { mockDataService } from './mockData'

const API_BASE = '/api/v1'

const WS_BASE =
  process.env.NEXT_PUBLIC_WS_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/^http/, 'ws')
    : 'ws://localhost:8000')

export interface SystemStatus {
  status: 'operational' | 'warning' | 'critical'
  message: string
  uptime: string
  agents: { active: number; total: number }
}

export type ScanProfile =
  | 'recon'
  | 'vulnerability'
  | 'vuln'
  | 'exploit'
  | 'stealth'
  | 'dos'
  | 'full_audit'

export interface ScanRequest {
  target: string
  scanType: ScanProfile
  options?: Record<string, unknown>
}

export interface StartScanResult {
  status: string
  taskId?: string
}

export interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'critical'
  source: string
  message: string
}

export interface LiveFeedItem {
  id: string
  timestamp: string
  event: string
  severity: 'info' | 'warning' | 'critical'
  source?: string
}

type BackendDetailedLog = {
  id?: string
  timestamp?: string
  level?: string
  source?: string
  description?: string
  message?: string
}

function mapBackendLevel(level: unknown): LogEntry['level'] {
  const v = String(level ?? '').toUpperCase()
  if (v === 'CRITICAL') return 'critical'
  if (v === 'WARNING') return 'warning'
  return 'info'
}

function mapDetailedLogToLogEntry(row: BackendDetailedLog): LogEntry {
  return {
    id: String(row.id ?? `log-${Date.now()}`),
    timestamp: String(row.timestamp ?? new Date().toISOString()),
    level: mapBackendLevel(row.level),
    source: String(row.source ?? 'Backend'),
    message: String(row.description ?? row.message ?? '')
  }
}

function mapLogEntryToLiveFeedItem(entry: LogEntry): LiveFeedItem {
  return {
    id: entry.id,
    timestamp: entry.timestamp,
    event: entry.message,
    severity: entry.level,
    source: entry.source
  }
}

function mapLiveFeedItemToLogEntry(item: LiveFeedItem): LogEntry {
  return {
    id: item.id,
    timestamp: item.timestamp,
    level: item.severity,
    source: item.source ?? 'Unknown',
    message: item.event
  }
}

// API Service Functions
export const apiService = {
  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const raw = await fetchClient.getJson<unknown>('/health')

      if (raw && typeof raw === 'object') {
        const obj = raw as Record<string, unknown>
        const status = obj.status

        const agents = obj.agents
        const hasAgents =
          agents &&
          typeof agents === 'object' &&
          typeof (agents as Record<string, unknown>).active === 'number' &&
          typeof (agents as Record<string, unknown>).total === 'number'

        if (status === 'operational' || status === 'warning' || status === 'critical') {
          return {
            status,
            message: typeof obj.message === 'string' ? obj.message : '',
            uptime: typeof obj.uptime === 'string' ? obj.uptime : '',
            agents: hasAgents
              ? {
                active: (agents as Record<string, unknown>).active as number,
                total: (agents as Record<string, unknown>).total as number
              }
              : { active: 0, total: 0 }
          }
        }

        // Backend /health currently returns {status: 'ok', service, version}
        if (status === 'ok') {
          return {
            status: 'operational',
            message: typeof obj.service === 'string' ? `${obj.service} online` : 'Backend online',
            uptime: '',
            agents: { active: 0, total: 0 }
          }
        }
      }

      return mockDataService.getSystemStatus()
    } catch {
      return mockDataService.getSystemStatus()
    }
  },

  // Scan Operations
  async startScan(request: ScanRequest): Promise<StartScanResult> {
    const inferTargetType = (value: string): 'ip' | 'cidr' | 'domain' | 'url' => {
      if (/^\d{1,3}(?:\.\d{1,3}){3}\/\d{1,2}$/.test(value)) return 'cidr'
      if (/^\d{1,3}(?:\.\d{1,3}){3}(:\d+)?$/.test(value)) return 'ip'
      if (/^https?:\/\//.test(value)) return 'url'
      return 'domain'
    }

    // Map frontend profile names → backend scan_type values
    const mapScanType = (t: ScanProfile): string => {
      if (t === 'vuln') return 'vulnerability'
      if (t === 'dos') return 'recon'  // dos falls back to recon scan in backend
      return t
    }

    const targetType = inferTargetType(request.target)
    // Backend TargetType enum doesn't include 'url', use 'domain' for URLs
    const backendTargetType = targetType === 'url' ? 'domain' : targetType

    const payload = {
      target: {
        type: backendTargetType,
        value: request.target,
        protocol: request.target.startsWith('https') ? 'https' : 'http'
      },
      scan_type: mapScanType(request.scanType),
      options: { profile: request.scanType, ...(request.options ?? {}) }
    }

    try {
      const res = await fetchClient.postJson<{
        success: boolean
        task_id: string
        status: string
        message?: string
      }>(`${API_BASE}/tasks/trigger`, payload)

      return {
        status: res.status ?? (res.success ? 'queued' : 'error'),
        taskId: res.task_id
      }
    } catch (primaryErr) {
      // Fallback to legacy endpoint
      try {
        const legacy = await fetchClient.postJson<{ status: string; message?: string }>(
          `${API_BASE}/tasks/trigger/legacy`,
          {
            action: 'start',
            target_id: request.target,
            params: { scan_type: request.scanType, ...(request.options ?? {}) }
          }
        )
        return { status: legacy.status ?? 'started' }
      } catch {
        throw primaryErr  // surface the original error
      }
    }
  },

  async getTaskStatus(taskId: string): Promise<Record<string, unknown>> {
    return fetchClient.getJson<Record<string, unknown>>(`${API_BASE}/tasks/status/${taskId}`)
  },

  // Logs
  async getLogs(scanId?: string): Promise<LogEntry[]> {
    // Backend provides GET /api/v1/logs/detailed (no scanId support yet)
    if (scanId) {
      // Preserve signature for future expansion, but fall back to generic stream for now.
    }

    try {
      const detailed = await fetchClient.getJson<BackendDetailedLog[]>(`${API_BASE}/logs/detailed?limit=100`)
      return (Array.isArray(detailed) ? detailed : []).map(mapDetailedLogToLogEntry)
    } catch {
      const fallback = await mockDataService.getLiveFeed()
      return fallback.map(mapLiveFeedItemToLogEntry)
    }
  },

  async getLiveFeed(): Promise<LiveFeedItem[]> {
    try {
      const logs = await apiService.getLogs()
      return logs.map(mapLogEntryToLiveFeedItem)
    } catch {
      return mockDataService.getLiveFeed()
    }
  },

  subscribeToLiveFeed(
    callback: (item: LiveFeedItem) => void,
    onStatusChange?: (connected: boolean) => void
  ): () => void {
    try {
      const ws = new WebSocket(`${WS_BASE}${API_BASE}/logs/ws`)

      ws.onopen = () => {
        onStatusChange?.(true)
      }

      ws.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(String(evt.data)) as Partial<LogEntry>
          if (!parsed) return

          const entry: LogEntry = {
            id: String(parsed.id ?? `ws-${Date.now()}`),
            timestamp: String(parsed.timestamp ?? new Date().toLocaleTimeString()),
            level: (parsed.level as LogEntry['level']) ?? 'info',
            source: String(parsed.source ?? 'Backend'),
            message: String(parsed.message ?? '')
          }
          callback(mapLogEntryToLiveFeedItem(entry))
        } catch {
          // ignore
        }
      }

      ws.onerror = () => {
        onStatusChange?.(false)
        try { ws.close() } catch { /* ignore */ }
      }

      ws.onclose = () => {
        onStatusChange?.(false)
      }

      return () => {
        onStatusChange?.(false)
        try { ws.close() } catch { /* ignore */ }
      }
    } catch {
      onStatusChange?.(true)
      return mockDataService.subscribeToLiveFeed(callback)
    }
  },

  // Target Selection
  async getTargets(): Promise<Array<{ id: string; name: string; url: string; description: string; type: string; status: string; tags: string[] }>> {
    try {
      return await fetchClient.getJson(`${API_BASE}/targets/`)
    } catch {
      // Fallback to local test targets
      return [
        { id: "dvwa", name: "DVWA", url: "http://localhost:8092", description: "Damn Vulnerable Web Application", type: "web", status: "online", tags: ["php", "sql", "xss"] },
        { id: "metasploitable2", name: "Metasploitable2", url: "http://localhost:8093", description: "Linux Vulnerable VM", type: "host", status: "online", tags: ["linux", "metasploit"] }
      ]
    }
  },

  // Reports (PDF Generation)
  async generateReport(params?: { target_id?: string; template?: string }): Promise<{ status: string; report_id?: string; message?: string }> {
    try {
      return await fetchClient.postJson(`${API_BASE}/reports/generate`, {
        target_id: params?.target_id,
        template: params?.template ?? "executive"
      })
    } catch {
      throw new Error("Report generation failed")
    }
  },

  async listReports(): Promise<Array<{ id: string; target_id: string; template: string; generated_at: string; file_path: string; size_kb: number }>> {
    try {
      return await fetchClient.getJson(`${API_BASE}/reports/list`)
    } catch {
      return []
    }
  },

  async downloadReport(filename: string): Promise<Blob> {
    const res = await fetch(`${API_BASE}/reports/download/${filename}`)
    if (!res.ok) throw new Error("Download failed")
    return await res.blob()
  },

  // Threat Stats (placeholder for future backend endpoint)
  async getThreatStats(): Promise<Array<{ label: string; value: number; change?: number; severity?: string }>> {
    // TODO: Wire to real backend when endpoint exists
    return [
      { label: 'Critical Threats', value: 7, change: -12, severity: 'critical' },
      { label: 'Active Exploits', value: 23, change: 5, severity: 'high' },
      { label: 'Scans Running', value: 142, change: 8, severity: 'medium' },
      { label: 'Vulnerabilities', value: 1847, change: -3, severity: 'low' }
    ]
  },

  // CVE Prediction
  async predictCVE(cveId: string, cvss: number = 0): Promise<any> {
    try {
      return await fetchClient.getJson(`${API_BASE}/cti/predict/${cveId}?cvss=${cvss}`)
    } catch {
      return {
        status: 'fallback',
        prediction: {
          probability: 0.3,
          reasoning: 'System offline, using heuristic fallback.',
          threat_level: 'Medium'
        }
      }
    }
  },

  // Arsenal: Polymorphic Payload Generation
  async generatePolymorphicPayload(payload: {
    payload: string
    payload_type?: 'exec' | 'shellcode'
  }): Promise<{
    status: string
    data?: {
      stub_code: string
      metadata: {
        generation: number
        original_hash: string
        encrypted_hash: string
        key_preview: string
      }
      usage_notes: Record<string, string>
    }
  }> {
    try {
      return await fetchClient.postJson(`${API_BASE}/arsenal/polymorphic/generate`, {
        payload: payload.payload,
        payload_type: payload.payload_type ?? 'exec'
      })
    } catch {
      throw new Error('Backend payload generation failed')
    }
  },

  // WebSocket for real-time logs
  getLogWebSocket(scanId?: string): WebSocket {
    const wsUrl = scanId
      ? `${WS_BASE}${API_BASE}/logs/ws/${scanId}`
      : `${WS_BASE}${API_BASE}/logs/ws`
    return new WebSocket(wsUrl)
  },

  // ─── Observatory: Infrastructure Health ───────────────────────────────────
  async getInfraHealth() {
    try {
      return await fetchClient.getJson<InfraHealth>(`${API_BASE}/observatory/infra`)
    } catch {
      return MOCK_INFRA_HEALTH
    }
  },

  async getAIState() {
    try {
      return await fetchClient.getJson<AIState>(`${API_BASE}/observatory/ai-state`)
    } catch {
      return MOCK_AI_STATE
    }
  },

  async getRAGHealth() {
    try {
      return await fetchClient.getJson<RAGHealth>(`${API_BASE}/observatory/rag`)
    } catch {
      return MOCK_RAG_HEALTH
    }
  },

  async getMaintenanceJobs() {
    try {
      return await fetchClient.getJson<MaintenanceJob[]>(`${API_BASE}/observatory/maintenance`)
    } catch {
      return MOCK_MAINTENANCE_JOBS
    }
  },

  async getROIMetrics() {
    try {
      return await fetchClient.getJson<ROIMetrics>(`${API_BASE}/observatory/roi`)
    } catch {
      return MOCK_ROI_METRICS
    }
  }
}

// ─── Observatory Types ─────────────────────────────────────────────────────

export interface DataSource {
  name: string
  type: string
  status: 'connected' | 'degraded' | 'offline'
  eventsPerSec: number
}

export interface InfraHealth {
  sources: DataSource[]
  kafka: { lag: number; topicsActive: number; messagesPerSec: number; fillPercent: number }
  redis: { memoryUsedMb: number; memoryMaxMb: number; queueDepth: number; fillPercent: number }
  qdrant: { vectorCount: number; vectorMax: number; fillPercent: number; collectionCount: number }
  elasticsearch: { indexSizeGb: number; docsIndexed: number; shardsActive: number; fillPercent: number }
  clickhouse: { totalRecords: number; storageUsedTb: number; lastSyncMins: number }
}

export type AIMode = 'HUNTER' | 'LEARNING' | 'AWAITING_APPROVAL' | 'MAINTENANCE' | 'IDLE'

export interface AIState {
  mode: AIMode
  currentTask: string
  taskDetail: string
  confidencePercent: number
  eta: string
  lastDecision: string
}

export interface RAGHealth {
  embeddingModel: string
  vectorStore: string
  documentCount: number
  freshnessMins: number
  lastCrawl: string
  chromaStatus: 'healthy' | 'stale' | 'offline'
  qdrantStatus: 'healthy' | 'stale' | 'offline'
}

export interface MaintenanceJob {
  id: string
  name: string
  schedule: 'daily' | 'weekly' | 'monthly'
  lastRun: string
  nextRun: string
  status: 'completed' | 'running' | 'pending' | 'failed'
  duration: string
}

export interface ROIMetrics {
  threatsBlockedToday: number
  threatsBlockedWeek: number
  threatsBlockedMonth: number
  cvesDiscovered: number
  sentinelInterceptions: number
  payloadsAutoStopped: number
  scansConducted: number
  reportGenerated: number
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_INFRA_HEALTH: InfraHealth = {
  sources: [
    { name: 'Kafka Stream', type: 'Event Bus', status: 'connected', eventsPerSec: 342 },
    { name: 'Shodan API', type: 'OSINT', status: 'connected', eventsPerSec: 12 },
    { name: 'CVE NVD Feed', type: 'Threat Intel', status: 'connected', eventsPerSec: 5 },
    { name: 'VirusTotal', type: 'OSINT', status: 'degraded', eventsPerSec: 2 },
    { name: 'Internal Agents', type: 'Agent Telemetry', status: 'connected', eventsPerSec: 88 },
    { name: 'eBPF Kernel Probe', type: 'System Telemetry', status: 'connected', eventsPerSec: 1204 },
  ],
  kafka: { lag: 142, topicsActive: 7, messagesPerSec: 342, fillPercent: 61 },
  redis: { memoryUsedMb: 1843, memoryMaxMb: 4096, queueDepth: 38, fillPercent: 45 },
  qdrant: { vectorCount: 1_240_000, vectorMax: 2_000_000, fillPercent: 62, collectionCount: 8 },
  elasticsearch: { indexSizeGb: 142, docsIndexed: 14_024_592, shardsActive: 12, fillPercent: 71 },
  clickhouse: { totalRecords: 14_024_592, storageUsedTb: 1.2, lastSyncMins: 2 },
}

const MOCK_AI_STATE: AIState = {
  mode: 'HUNTER',
  currentTask: 'Active Reconnaissance Sweep',
  taskDetail: 'Scanning 192.168.1.0/24 for open ports and service banners. Correlating against CVE-2024-6387 signatures.',
  confidencePercent: 87,
  eta: '~4 min remaining',
  lastDecision: 'Escalated target 10.0.0.5 to active exploit phase after identifying SSH banner match.',
}

const MOCK_RAG_HEALTH: RAGHealth = {
  embeddingModel: 'text-embedding-3-large',
  vectorStore: 'Qdrant (cosine)',
  documentCount: 142_880,
  freshnessMins: 18,
  lastCrawl: '16:02 UTC',
  chromaStatus: 'healthy',
  qdrantStatus: 'healthy',
}

const MOCK_MAINTENANCE_JOBS: MaintenanceJob[] = [
  { id: 'j-01', name: 'Elasticsearch TTL Purge', schedule: 'daily', lastRun: 'Today 03:00', nextRun: 'Tomorrow 03:00', status: 'completed', duration: '1m 12s' },
  { id: 'j-02', name: 'Qdrant Stale Vector Cleanup', schedule: 'weekly', lastRun: 'Mon 02:00', nextRun: 'Mon 02:00', status: 'completed', duration: '4m 38s' },
  { id: 'j-03', name: 'Redis Queue Drain', schedule: 'daily', lastRun: 'Today 03:05', nextRun: 'Tomorrow 03:05', status: 'completed', duration: '0m 8s' },
  { id: 'j-04', name: 'ClickHouse Compaction', schedule: 'monthly', lastRun: '01 Feb 00:00', nextRun: '01 Mar 00:00', status: 'completed', duration: '22m 5s' },
  { id: 'j-05', name: 'Script Library Rebuild', schedule: 'weekly', lastRun: 'Mon 04:00', nextRun: 'Mon 04:00', status: 'pending', duration: '—' },
  { id: 'j-06', name: 'RAG Embedding Refresh', schedule: 'daily', lastRun: 'Today 06:00', nextRun: 'Tomorrow 06:00', status: 'completed', duration: '8m 42s' },
]

const MOCK_ROI_METRICS: ROIMetrics = {
  threatsBlockedToday: 42,
  threatsBlockedWeek: 284,
  threatsBlockedMonth: 1_204,
  cvesDiscovered: 7,
  sentinelInterceptions: 42,
  payloadsAutoStopped: 18,
  scansConducted: 142,
  reportGenerated: 23,
}

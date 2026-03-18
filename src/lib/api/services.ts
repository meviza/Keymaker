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

export interface EnvironmentReadiness {
  environment: Array<{ name: string; configured: boolean }>
  ready_count: number
  total_count: number
}

export interface IdentityProviderRecord {
  id: string
  tenant_id: string
  provider_type: string
  issuer: string
  client_id: string
  audience: string
  discovery_url?: string
  saml_metadata_url?: string
  jwks_uri?: string
  claim_mapping?: Record<string, string>
}

export interface RepositoryIntegrationRecord {
  id: string
  tenant_id: string
  provider: string
  repo_slug: string
  default_branch: string
  ci_provider: string
  auth_mode?: string
  secret_ref?: string
  webhook_secret_ref?: string
  api_base_url?: string
  project_id?: string
}

export interface FederatedIdentityRecord {
  tenant_id: string
  provider_id: string
  subject: string
  email?: string
  role: string
  claims: Record<string, string>
}

export interface IntegrationReadiness {
  repository_id: string
  tenant_id: string
  provider: string
  repo_slug: string
  api_base_url?: string
  auth_mode: string
  secret_ref?: string
  secret_available: boolean
  webhook_secret_ref?: string
  webhook_secret_available: boolean
  delivery_ready: boolean
}

export interface AuthorizedTargetRecord {
  id: string
  tenant_id: string
  repository_id?: string
  target_id: string
  target_type: string
  authorization_mode: string
  evidence_reference: string
  allowed_operations: string[]
  constraints: string[]
}

export interface PatchJobRecord {
  id: string
  plan_id: string
  status: string
  rollback_reference?: string
  pr_artifact?: {
    branch_name: string
    title: string
    body: string
    labels: string[]
  }
}

export interface PullRequestHandoffRecord {
  id: string
  patch_job_id: string
  repository_id: string
  branch_name: string
  title: string
  body: string
  release_gate_status: string
  delivery_status?: string
  remote_id?: string
  remote_url?: string
}

export interface DefensivePackRecord {
  case_type: string
  model_strategy: string
  retrieval: {
    query: string
    filters: Record<string, string>
    memories: Array<{ id: string; title: string; memory_type: string; score: string }>
  }
  policy: {
    persona: string
    guardrails: string[]
    required_checks: string[]
    approval_required: boolean
  }
  evaluation: {
    objectives: string[]
    scorecards: Array<{ name: string; target: string }>
    stop_conditions: string[]
  }
  replay: {
    timeline: Array<{ stage: string; status: string }>
    artifacts: string[]
    writeback_targets: string[]
  }
  authorized_target: {
    target_id: string
    target_type: string
    authorization_mode: string
    evidence_reference: string
    allowed_operations: string[]
    constraints: string[]
  }
}

export interface DefensiveReplayRecord {
  id: string
  tenant_id?: string
  repository_id?: string
  case_type: string
  objective?: string
  status: string
  total_score: number
  candidate_output: string
}

export interface DefensiveRuntimeRecord {
  runtime_mode: string
  instruction_bundle: {
    system_contract: string[]
    retrieval_query: string
    retrieved_memories: Array<{ id: string; title: string; memory_type: string; score: string }>
    guardrails: string[]
    required_checks: string[]
    artifacts: string[]
  }
  evaluation_targets: Array<{ name: string; target: string }>
  stop_conditions: string[]
  writeback_targets: string[]
  pack: DefensivePackRecord
  blocked?: boolean
  halt_reasons?: string[]
  authorization_status?: string
  repository_context?: Record<string, unknown>
}

export interface DefensiveEvaluationRecord {
  total_score: number
  passed: boolean
  blocked?: boolean
  halt_reasons?: string[]
  dimension_scores: {
    traceability: number
    rollback_safety: number
    governance: number
  }
  replay_record: {
    id?: string
    status: string
    reason: string
    candidate_excerpt: string
  }
  replay_memory?: {
    id: string
    memory_type: string
  } | null
}

export interface DefensiveDraftRecord {
  candidate_output: string
  source: string
  blocked?: boolean
  halt_reasons?: string[]
}

export interface CvePredictionResult {
  cve_id?: string
  prediction: {
    probability: number
    reasoning: string
    threat_level: string
  }
  status?: string
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
    try {
      const [environment, reports, system] = await Promise.all([
        apiService.getEnvironmentReadiness(),
        apiService.listReports(),
        apiService.getSystemStatus(),
      ])
      return [
        { label: 'Secrets Ready', value: environment.ready_count, change: environment.ready_count - environment.total_count, severity: environment.ready_count === environment.total_count ? 'low' : 'critical' },
        { label: 'Reports Generated', value: reports.length, change: reports.length, severity: 'low' },
        { label: 'Active Agents', value: system.agents.active, change: system.agents.total - system.agents.active, severity: 'medium' },
        { label: 'Env Coverage', value: environment.total_count, change: 0, severity: 'low' }
      ]
    } catch {
      return [
        { label: 'Critical Threats', value: 7, change: -12, severity: 'critical' },
        { label: 'Active Exploits', value: 23, change: 5, severity: 'high' },
        { label: 'Scans Running', value: 142, change: 8, severity: 'medium' },
        { label: 'Vulnerabilities', value: 1847, change: -3, severity: 'low' }
      ]
    }
  },

  async getEnvironmentReadiness(): Promise<EnvironmentReadiness> {
    return fetchClient.getJson<EnvironmentReadiness>(`${API_BASE}/delivery-ops/environment/readiness`)
  },

  async registerIdentityProvider(payload: {
    tenant_id: string
    provider_type: string
    issuer: string
    client_id: string
    audience: string
    discovery_url?: string
    saml_metadata_url?: string
    jwks_uri?: string
    claim_mapping?: Record<string, string>
  }): Promise<IdentityProviderRecord> {
    return fetchClient.postJson<IdentityProviderRecord>(`${API_BASE}/identity-access/providers`, payload)
  },

  async listIdentityProviders(tenantId?: string): Promise<IdentityProviderRecord[]> {
    const suffix = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : ''
    const response = await fetchClient.getJson<{ providers: IdentityProviderRecord[] }>(`${API_BASE}/identity-access/providers${suffix}`)
    return response.providers
  },

  async getProviderReadiness(providerId: string): Promise<Record<string, unknown>> {
    return fetchClient.getJson<Record<string, unknown>>(`${API_BASE}/identity-access/providers/${providerId}/readiness`)
  },

  async verifyFederatedToken(provider_id: string, token: string): Promise<FederatedIdentityRecord> {
    return fetchClient.postJson<FederatedIdentityRecord>(`${API_BASE}/identity-access/verify-token`, { provider_id, token })
  },

  async registerRepository(payload: {
    tenant_id: string
    provider: string
    repo_slug: string
    default_branch: string
    ci_provider: string
    auth_mode?: string
    secret_ref?: string
    webhook_secret_ref?: string
    api_base_url?: string
    project_id?: string
  }): Promise<RepositoryIntegrationRecord> {
    return fetchClient.postJson<RepositoryIntegrationRecord>(`${API_BASE}/delivery-ops/repositories`, payload)
  },

  async listRepositories(tenantId: string): Promise<RepositoryIntegrationRecord[]> {
    const response = await fetchClient.getJson<{ repositories: RepositoryIntegrationRecord[] }>(`${API_BASE}/delivery-ops/repositories/${tenantId}`)
    return response.repositories
  },

  async getRepositoryReadiness(repositoryId: string): Promise<IntegrationReadiness> {
    return fetchClient.getJson<IntegrationReadiness>(`${API_BASE}/delivery-ops/repositories/${repositoryId}/readiness`)
  },

  async getOperatingModel(tenantId: string): Promise<Record<string, unknown>> {
    return fetchClient.getJson<Record<string, unknown>>(`${API_BASE}/commercial-ops/operating-model/${tenantId}`)
  },

  async upsertAuthorizedTarget(payload: {
    tenant_id: string
    target_id: string
    target_type: string
    authorization_mode: string
    evidence_reference: string
    allowed_operations: string[]
    constraints: string[]
    repository_id?: string
    target_record_id?: string
  }): Promise<AuthorizedTargetRecord> {
    return fetchClient.postJson<AuthorizedTargetRecord>(`${API_BASE}/platform-ops/authorized-targets`, payload)
  },

  async listAuthorizedTargets(tenantId?: string): Promise<AuthorizedTargetRecord[]> {
    const suffix = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : ''
    const response = await fetchClient.getJson<{ authorized_targets: AuthorizedTargetRecord[] }>(`${API_BASE}/platform-ops/authorized-targets${suffix}`)
    return response.authorized_targets
  },

  async getExecutiveSnapshot(tenantId: string): Promise<Record<string, unknown>> {
    return fetchClient.getJson<Record<string, unknown>>(`${API_BASE}/executive-ops/snapshot/${tenantId}`)
  },

  async listPatchJobs(planId?: string): Promise<PatchJobRecord[]> {
    const suffix = planId ? `?plan_id=${encodeURIComponent(planId)}` : ''
    const response = await fetchClient.getJson<{ patch_jobs: PatchJobRecord[] }>(`${API_BASE}/remediation/patch-jobs${suffix}`)
    return response.patch_jobs
  },

  async getPatchJob(patchJobId: string): Promise<PatchJobRecord> {
    const response = await fetchClient.getJson<{ patch_job: PatchJobRecord }>(`${API_BASE}/remediation/patch-jobs/${patchJobId}`)
    return response.patch_job
  },

  async createPrHandoff(payload: { tenant_id: string; patch_job: PatchJobRecord; repository_id: string }): Promise<PullRequestHandoffRecord> {
    return fetchClient.postJson<PullRequestHandoffRecord>(`${API_BASE}/delivery-ops/pr-handoff`, payload)
  },

  async publishPr(handoffId: string): Promise<Record<string, unknown>> {
    return fetchClient.postJson<Record<string, unknown>>(`${API_BASE}/delivery-ops/pr-handoff/${handoffId}/publish`, {})
  },

  async syncPr(handoffId: string): Promise<Record<string, unknown>> {
    return fetchClient.postJson<Record<string, unknown>>(`${API_BASE}/delivery-ops/pr-handoff/${handoffId}/sync`, {})
  },

  async listPrHandoffs(repositoryId?: string, patchJobId?: string): Promise<PullRequestHandoffRecord[]> {
    const query = new URLSearchParams()
    if (repositoryId) query.set('repository_id', repositoryId)
    if (patchJobId) query.set('patch_job_id', patchJobId)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    const response = await fetchClient.getJson<{ handoffs: PullRequestHandoffRecord[] }>(`${API_BASE}/delivery-ops/pr-handoff${suffix}`)
    return response.handoffs
  },

  async getDefensivePack(payload: {
    case_type?: string
    persona?: string
    objective?: string
    tenant_id?: string
    repository_id?: string
    handoff_id?: string
    top_k?: number
    findings?: Array<Record<string, unknown>>
    target_profile?: Record<string, unknown>
  }): Promise<DefensivePackRecord> {
    return fetchClient.postJson<DefensivePackRecord>(`${API_BASE}/defensive-ai/pack`, payload)
  },

  async listDefensiveReplays(params?: {
    tenant_id?: string
    repository_id?: string
    status?: string
  }): Promise<DefensiveReplayRecord[]> {
    const query = new URLSearchParams()
    if (params?.tenant_id) query.set('tenant_id', params.tenant_id)
    if (params?.repository_id) query.set('repository_id', params.repository_id)
    if (params?.status) query.set('status', params.status)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    const response = await fetchClient.getJson<{ replays: DefensiveReplayRecord[] }>(`${API_BASE}/defensive-ai-runtime/replays${suffix}`)
    return response.replays
  },

  async prepareDefensiveRuntime(payload: {
    case_type?: string
    persona?: string
    objective?: string
    tenant_id?: string
    repository_id?: string
    handoff_id?: string
    top_k?: number
    findings?: Array<Record<string, unknown>>
  }): Promise<DefensiveRuntimeRecord> {
    return fetchClient.postJson<DefensiveRuntimeRecord>(`${API_BASE}/defensive-ai-runtime/prepare`, payload)
  },

  async evaluateAndStoreDefensiveCandidate(payload: {
    candidate_output: string
    findings?: Array<Record<string, unknown>>
    pack?: Record<string, unknown>
    tenant_id?: string
    repository_id?: string
    case_type?: string
    objective?: string
  }): Promise<DefensiveEvaluationRecord> {
    return fetchClient.postJson<DefensiveEvaluationRecord>(`${API_BASE}/defensive-ai-runtime/evaluate-and-store`, payload)
  },

  async generateDefensiveDraft(payload: {
    pack: Record<string, unknown>
    findings?: Array<Record<string, unknown>>
    objective?: string
    repository_context?: Record<string, unknown>
  }): Promise<DefensiveDraftRecord> {
    return fetchClient.postJson<DefensiveDraftRecord>(`${API_BASE}/defensive-ai-runtime/draft`, payload)
  },

  // CVE Prediction
  async predictCVE(cveId: string, cvss: number = 0): Promise<CvePredictionResult> {
    try {
      return await fetchClient.getJson<CvePredictionResult>(`${API_BASE}/cti/predict/${cveId}?cvss=${cvss}`)
    } catch {
      return {
        status: 'fallback',
        cve_id: cveId,
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

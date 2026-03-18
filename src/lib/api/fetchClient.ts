import { clearSession } from '@/lib/auth/session'

export type FetchClientOptions = {
  baseUrl?: string
  timeoutMs?: number
}

// Use empty base URL in browser so Next.js rewrite proxy forwards /api/v1/* to FastAPI.
// In Docker / SSR, set NEXT_PUBLIC_API_URL=http://backend:8000
const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('km_token')
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(input, { ...init, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

export function createFetchClient(options: FetchClientOptions = {}) {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  const timeoutMs = options.timeoutMs ?? 30000

  const toUrl = (path: string) => {
    const normalizedBase = baseUrl.replace(/\/$/, '')
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${normalizedBase}${normalizedPath}`
  }

  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const authToken = getAuthToken()

    // Token expiry check — redirect to login if expired
    if (authToken && authToken !== 'demo-token-offline' && isTokenExpired(authToken)) {
      clearSession()
      if (typeof window !== 'undefined') {
        window.location.href = '/login?reason=expired'
      }
      throw new Error('Session expired. Redirecting to login.')
    }

    const headers = new Headers(init.headers ?? {})
    if (authToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${authToken}`)
    }

    const res = await fetchWithTimeout(toUrl(path), { ...init, headers }, timeoutMs)

    // Handle 401 from backend (token revoked server-side, etc.)
    if (res.status === 401) {
      clearSession()
      if (typeof window !== 'undefined') {
        window.location.href = '/login?reason=unauthorized'
      }
      throw new Error('Unauthorized. Redirecting to login.')
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`)
    }

    return res.json() as Promise<T>
  }

  return {
    getJson: <T>(path: string, init?: Omit<RequestInit, 'method'>) => request<T>(path, { ...init, method: 'GET' }),
    postJson: <T>(path: string, body: unknown, init?: Omit<RequestInit, 'method' | 'body'>) =>
      request<T>(path, {
        ...init,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
        body: JSON.stringify(body)
      }),
    deleteJson: <T>(path: string, init?: Omit<RequestInit, 'method'>) => request<T>(path, { ...init, method: 'DELETE' }),
    putJson: <T>(path: string, body: unknown, init?: Omit<RequestInit, 'method' | 'body'>) =>
      request<T>(path, {
        ...init,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
        body: JSON.stringify(body)
      }),
  }
}

export const fetchClient = createFetchClient()

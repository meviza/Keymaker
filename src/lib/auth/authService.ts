/**
 * Keymaker Auth Service
 * Handles JWT-based login/register/me calls to the real backend.
 * Falls back gracefully if the backend is unreachable.
 */
import { clearSession, getToken, storeSessionUser, storeToken, type SessionUser } from "./session"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const AUTH_BASE = `${API_URL}/api/v1/auth`

export type AuthUser = SessionUser

export interface TokenResponse {
    access_token: string
    token_type: string
    user: AuthUser
    tenant?: Record<string, unknown> | null
    memberships?: Array<Record<string, unknown>>
}

/** Authenticate with the backend, returns the token response. */
export async function login(email: string, password: string): Promise<TokenResponse> {
    const res = await fetch(`${AUTH_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Login failed" }))
        throw new Error(err.detail ?? "Login failed")
    }
    const data = await res.json()
    storeToken(data.access_token)
    storeSessionUser(data.user)
    return data
}

/** Register a new operator account. */
export async function register(email: string, name: string, password: string): Promise<TokenResponse> {
    const res = await fetch(`${AUTH_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Registration failed" }))
        throw new Error(err.detail ?? "Registration failed")
    }
    const data = await res.json()
    storeToken(data.access_token)
    storeSessionUser(data.user)
    return data
}

/** Fetch the currently authenticated user. */
export async function getMe(): Promise<AuthUser | null> {
    const token = getToken()
    if (!token) return null
    try {
        const res = await fetch(`${AUTH_BASE}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return null
        const data = await res.json()
        storeSessionUser(data.user)
        return data.user
    } catch {
        return null
    }
}

export function setOfflineDemoSession() {
    storeToken("demo-token-offline")
    storeSessionUser({
        id: "demo-operator",
        email: "demo@keymaker.local",
        name: "Demo Operator",
        role: "owner",
    })
}

export function logout() {
    clearSession()
}

/**
 * Keymaker Auth Service
 * Handles JWT-based login/register/me calls to the real backend.
 * Falls back gracefully if the backend is unreachable.
 */

const AUTH_BASE = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`
    : "http://localhost:8000/api/v1/auth"

export interface AuthUser {
    id: string
    email: string
    name: string
    role: string
}

export interface TokenResponse {
    access_token: string
    token_type: string
    user: AuthUser
}

/** Store JWT in localStorage (client-side only). */
export function storeToken(token: string) {
    if (typeof window !== "undefined") localStorage.setItem("km_token", token)
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("km_token")
}

export function clearToken() {
    if (typeof window !== "undefined") localStorage.removeItem("km_token")
}

export function isLoggedIn(): boolean {
    const t = getToken()
    if (!t) return false
    try {
        const payload = JSON.parse(atob(t.split(".")[1]))
        return payload.exp * 1000 > Date.now()
    } catch {
        return false
    }
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
    return res.json()
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
    return res.json()
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
        return res.json()
    } catch {
        return null
    }
}

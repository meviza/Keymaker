export const TOKEN_STORAGE_KEY = "km_token"
export const USER_STORAGE_KEY = "km_user"
export const AUTH_COOKIE_KEY = "km_auth"

export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
}

export function storeToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
  document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(token)}; Path=/; SameSite=Lax`
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function clearToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  document.cookie = `${AUTH_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function storeSessionUser(user: SessionUser) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function clearSessionUser() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(USER_STORAGE_KEY)
}

export function clearSession() {
  clearToken()
  clearSessionUser()
}

export function isLoggedIn(): boolean {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return token === "demo-token-offline"
  }
}

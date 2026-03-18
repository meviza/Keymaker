const PUBLIC_PATHS = [
  "/",
  "/landing",
  "/pricing",
  "/services",
  "/support",
  "/privacy",
  "/terms",
  "/cookies",
  "/contact",
  "/demo",
  "/login",
  "/beta",
  "/telemetry",
] as const

export type RouteAccessDecision = {
  isPublic: boolean
  isAllowed: boolean
  redirectTo: string | null
}

export function normalizePathname(input: string): string {
  if (!input) return "/"

  const [path, query = ""] = input.split("?", 2)
  const normalizedPath = path === "/" ? "/" : path.replace(/\/+$/, "")
  return query ? `${normalizedPath}?${query}` : normalizedPath
}

export function isPublicPath(input: string): boolean {
  const normalized = normalizePathname(input)
  const [pathname] = normalized.split("?", 1)

  return PUBLIC_PATHS.some((publicPath) => {
    if (publicPath === "/") return pathname === "/"
    return pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  })
}

export function buildLoginRedirect(input: string): string {
  const normalized = normalizePathname(input)
  return `/login?next=${encodeURIComponent(normalized)}`
}

export function resolveRouteAccess(input: string, authenticated: boolean): RouteAccessDecision {
  if (isPublicPath(input)) {
    return { isPublic: true, isAllowed: true, redirectTo: null }
  }

  if (authenticated) {
    return { isPublic: false, isAllowed: true, redirectTo: null }
  }

  return {
    isPublic: false,
    isAllowed: false,
    redirectTo: buildLoginRedirect(input),
  }
}

export function resolvePostLoginPath(nextPath: string | null | undefined): string {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/command"
  }

  const normalized = normalizePathname(nextPath)
  const [pathname] = normalized.split("?", 1)
  if (pathname === "/login") {
    return "/command"
  }

  return normalized
}

export { PUBLIC_PATHS }

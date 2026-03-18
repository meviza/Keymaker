export type EdgeAccessDecision =
  | { action: "next" }
  | { action: "redirect"; location: string }

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

function normalizePathname(input: string): string {
  if (!input) return "/"

  const [path, query = ""] = input.split("?", 2)
  const normalizedPath = path === "/" ? "/" : path.replace(/\/+$/, "")
  return query ? `${normalizedPath}?${query}` : normalizedPath
}

function isPublicPath(input: string): boolean {
  const normalized = normalizePathname(input)
  const [pathname] = normalized.split("?", 1)

  return PUBLIC_PATHS.some((publicPath) => {
    if (publicPath === "/") return pathname === "/"
    return pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  })
}

function buildLoginRedirect(input: string): string {
  const normalized = normalizePathname(input)
  return `/login?next=${encodeURIComponent(normalized)}`
}

function resolvePostLoginPath(nextPath: string | null | undefined): string {
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

export function resolveEdgeAccess(
  pathname: string,
  search: string,
  authenticated: boolean,
): EdgeAccessDecision {
  const currentPath = `${pathname}${search || ""}`

  if (pathname === "/login" && authenticated) {
    const nextTarget = new URLSearchParams(search).get("next")
    return { action: "redirect", location: resolvePostLoginPath(nextTarget) }
  }

  if (isPublicPath(currentPath)) {
    return { action: "next" }
  }

  if (authenticated) {
    return { action: "next" }
  }

  return { action: "redirect", location: buildLoginRedirect(currentPath) }
}

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { AUTH_COOKIE_KEY } from "@/lib/auth/session"
import { resolveEdgeAccess } from "@/lib/auth/edge-access"

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_KEY)?.value
  const decision = resolveEdgeAccess(
    request.nextUrl.pathname,
    request.nextUrl.search,
    Boolean(token),
  )

  if (decision.action === "redirect") {
    return NextResponse.redirect(new URL(decision.location, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

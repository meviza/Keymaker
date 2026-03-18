import test from "node:test"
import assert from "node:assert/strict"

import {
  buildLoginRedirect,
  isPublicPath,
  resolvePostLoginPath,
  resolveRouteAccess,
} from "../src/lib/auth/access.ts"

test("public routes remain accessible without a session", () => {
  assert.equal(isPublicPath("/login"), true)
  assert.equal(isPublicPath("/pricing/enterprise"), true)
  assert.equal(resolveRouteAccess("/demo", false).isAllowed, true)
})

test("protected routes redirect unauthenticated operators to login with next", () => {
  const decision = resolveRouteAccess("/settings?tab=api", false)

  assert.equal(decision.isPublic, false)
  assert.equal(decision.isAllowed, false)
  assert.equal(decision.redirectTo, buildLoginRedirect("/settings?tab=api"))
})

test("protected routes remain accessible when a session exists", () => {
  const decision = resolveRouteAccess("/reports", true)

  assert.equal(decision.isAllowed, true)
  assert.equal(decision.redirectTo, null)
})

test("post-login redirect sanitizes unsafe or recursive next targets", () => {
  assert.equal(resolvePostLoginPath("/command?panel=live"), "/command?panel=live")
  assert.equal(resolvePostLoginPath("/login"), "/command")
  assert.equal(resolvePostLoginPath("https://evil.example"), "/command")
  assert.equal(resolvePostLoginPath("//evil.example"), "/command")
})

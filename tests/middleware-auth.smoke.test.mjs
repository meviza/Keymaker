import test from "node:test"
import assert from "node:assert/strict"

import { resolveEdgeAccess } from "../src/lib/auth/edge-access.ts"

test("middleware redirects direct protected requests without a session", () => {
  const decision = resolveEdgeAccess("/settings", "?tab=api", false)

  assert.deepEqual(decision, {
    action: "redirect",
    location: "/login?next=%2Fsettings%3Ftab%3Dapi",
  })
})

test("middleware allows protected requests with a session cookie", () => {
  assert.deepEqual(resolveEdgeAccess("/reports", "", true), { action: "next" })
})

test("middleware bypasses public routes", () => {
  assert.deepEqual(resolveEdgeAccess("/pricing", "", false), { action: "next" })
})

test("middleware redirects authenticated login visits to the next destination", () => {
  assert.deepEqual(
    resolveEdgeAccess("/login", "?next=%2Fcommand%3Fpanel%3Dlive", true),
    { action: "redirect", location: "/command?panel=live" },
  )
})

/**
 * Input sanitization utilities for Keymaker frontend.
 * Prevents XSS and injection attacks from user input and API responses.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
}

/** Escape HTML entities to prevent XSS when rendering user/API content. */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => HTML_ENTITY_MAP[char] ?? char)
}

/** Validate and sanitize a scan target (IP, domain, CIDR, URL). */
export function sanitizeTarget(input: string): string {
  const trimmed = input.trim()
  // Allow only safe characters for targets: alphanumeric, dots, colons, slashes, hyphens, underscores
  const sanitized = trimmed.replace(/[^a-zA-Z0-9.\-_:\/\[\]@]/g, '')
  // Max length guard
  return sanitized.slice(0, 253)
}

/** Check if a target string looks valid (basic pattern check). */
export function isValidTarget(input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed || trimmed.length < 2) return false

  // IP address (v4)
  const ipv4 = /^\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/\d{1,2})?$/
  // Domain
  const domain = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/
  // URL
  const url = /^https?:\/\/.+/

  return ipv4.test(trimmed) || domain.test(trimmed) || url.test(trimmed)
}

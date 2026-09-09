import { clearSessionCookie } from "@workspace/utils"
import { redirect } from "@tanstack/react-router"

type ApiErrorShape = {
  status?: number
  code?: string
  message?: string
  redirectTo?: string | null
  originalError?: unknown
}

/**
 * Handle API errors with redirect logic untuk auth errors.
 * Hanya throw redirect untuk auth errors (401/403).
 * Untuk error lain, caller harus handle sendiri.
 */
export function handleApiError(err: unknown): void {
  const apiErr = err as ApiErrorShape
  console.log("🔍 handleApiError:", apiErr)

  if (apiErr?.redirectTo) {
    clearSessionCookie()
    throw redirect({ href: apiErr.redirectTo })
  }
}

/**
 * Check apakah error butuh redirect (auth error)
 * Return true jika perlu redirect
 */
export function shouldRedirect(err: unknown): boolean {
  const apiErr = err as ApiErrorShape
  return !!apiErr?.redirectTo
}

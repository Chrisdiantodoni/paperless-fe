import { clearSessionCookie } from "@workspace/utils"
import { redirect } from "@tanstack/react-router"

type ApiErrorShape = {
  status?: number
  code?: string
  message?: string
  redirectTo?: string | null
  originalError?: unknown
}

export function handleApiError(err: unknown): never {
  const apiErr = err as ApiErrorShape

  if (apiErr?.redirectTo) {
    clearSessionCookie()
    throw redirect({ href: apiErr.redirectTo })
  }

  throw apiErr?.originalError ?? err
}

/**
 * Check apakah error butuh redirect (auth error)
 * Return true jika perlu redirect
 */
export function shouldRedirect(err: unknown): boolean {
  const apiErr = err as ApiErrorShape
  return !!apiErr?.redirectTo
}

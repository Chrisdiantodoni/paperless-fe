// src/utils/handle-api-error.ts
import { clearSessionCookie } from "@/server/session.server"
import { redirect } from "@tanstack/react-router"

type ApiErrorShape = {
  status?: number
  code?: string
  message?: string
  redirectTo?: string | null
  originalError?: unknown
}

/**
 * Lempar redirect TanStack yang valid kalau error dari axios interceptor
 * membawa `redirectTo`. Kalau tidak, lempar ulang error aslinya.
 * Panggil ini di dalam `catch` block loader / server function.
 */
export function handleApiError(err: unknown): never {
  const apiErr = err as ApiErrorShape
  console.log(apiErr)

  if (apiErr?.redirectTo) {
    clearSessionCookie()
    throw redirect({ href: apiErr.redirectTo })
  }

  // bukan error yang butuh redirect, lempar apa adanya
  throw err
}

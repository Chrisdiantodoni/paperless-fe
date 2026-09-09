import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import auth from "@/services/API/auth"
import { readSessionToken } from "@/server/session"
import { handleApiError } from "@/lib/handle-api-error"
import { clearSessionCookieServer } from "@/server/session.server"
import type { UserData } from "@workspace/types/user.type"

const loginHref = import.meta.env.DEV
  ? "/auth/dev-ticket"
  : `${import.meta.env.VITE_PORTAL_URL}/login`

export const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const token = await readSessionToken()

    if (!token) {
      throw redirect({
        href: loginHref,
      })
    }

    let userResponse
    try {
      userResponse = await auth.me()
    } catch (err) {
      await clearSessionCookieServer()
      handleApiError(err)
    }

    // Jika data user gagal diambil atau tidak valid
    const user = (
      userResponse as { data?: { user?: UserData } } | null | undefined
    )?.data?.user
    if (!user) {
      await clearSessionCookieServer()
      throw redirect({
        href: loginHref,
      })
    }

    return next({
      context: {
        user,
      },
    })
  }
)

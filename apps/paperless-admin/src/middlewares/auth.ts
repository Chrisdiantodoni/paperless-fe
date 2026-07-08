import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import auth from "@/services/API/auth"
import { readSessionToken } from "@/server/session"
import { handleApiError } from "@/lib/handle-api-error"
import { clearSessionCookie } from "@/server/session.server"

export const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const token = await readSessionToken()

    if (!token) {
      throw redirect({
        href: `${import.meta.env.VITE_PORTAL_URL}/login`,
      })
    }

    let userResponse
    try {
      userResponse = await auth.me()
    } catch (err) {
      await clearSessionCookie()
      handleApiError(err)
    }

    // Jika data user gagal diambil atau tidak valid
    if (!userResponse?.data.user) {
      await clearSessionCookie()
      throw redirect({
        href: `${import.meta.env.VITE_PORTAL_URL}/login`,
      })
    }

    return next({
      context: {
        user: userResponse.data.user,
      },
    })
  }
)

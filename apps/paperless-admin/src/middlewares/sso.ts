import { readSessionToken } from "@/server/session"
import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"

export const ssoMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    if (url.pathname.startsWith("/auth/sso")) {
      const token = await readSessionToken()
      if (!token) {
        return next()
      } else {
        throw redirect({
          to: "/dashboard",
        })
      }
    }
    return next()
  }
)

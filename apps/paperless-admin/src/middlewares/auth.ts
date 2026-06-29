import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import auth from "@/services/API/auth" // Jalur AuthService Anda
import { readSessionToken } from "@/server/session"

export const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const token = readSessionToken()
    if (!token) {
      throw redirect({
        href: `${import.meta.env.VITE_PORTAL_URL}/login`,
      })
    }

    const userResponse = await auth.me()

    // Jika data user gagal diambil atau tidak valid
    if (!userResponse.data.user) {
      throw redirect({
        href: `${import.meta.env.VITE_PORTAL_URL}/login`,
      })
    }
    // 3. Teruskan ke handler berikutnya dengan menyuntikkan context user yang typesafe
    return next({
      context: {
        user: userResponse.data.user, // Menyimpan data objek UserData utama
      },
    })
  }
)

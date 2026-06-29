import { verifySSOTicketSchema } from "@/schema/auth.schema"
import sso from "@/services/API/sso"
import { createServerFn } from "@tanstack/react-start"
import { setSessionCookie } from "./session"
import type { APIResponse } from "@workspace/types/api"
import type { UserData, UserResponse } from "@workspace/types/user.type"
import auth from "@/services/API/auth"

export const verifySSOTicket = createServerFn({ method: "POST" })
  .validator(verifySSOTicketSchema)

  .handler(async ({ data }): Promise<APIResponse<UserResponse>> => {
    try {
      const response = await sso.verifyTicket(data.ticket)

      if (response?.data?.token) {
        console.log(response.data.token, "token")
        setSessionCookie(response.data.token)
        return response // ✨ Terpenuhi jika token ada
      }

      // ── SOLUSI 1: Lempar Error jika data token tidak valid/kosong ──
      throw new Error(
        "Otentikasi gagal: Token tidak ditemukan dalam respon SSO."
      )
    } catch (error: any) {
      // Semua error (baik dari sso.verifyTicket maupun throw manual di atas) akan bermuara di sini
      throw new Error(error.message || "Gagal memvalidasi tiket SSO.")
    }
  })

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<UserData> => {
    try {
      const response = await auth.me()
      return response.data.user
    } catch (error: any) {
      throw new Error(error.message || "Gagal mendapatkan data pengguna.")
    }
  }
)

import { verifySSOTicketSchema } from "@/schema/auth.schema"
import sso from "@/services/API/sso"
import { createServerFn } from "@tanstack/react-start"
import { setSessionCookie, clearSessionCookieServer } from "./session.server"
import type { APIResponse } from "@workspace/types/api"
import type { UserData, UserResponse } from "@workspace/types/user.type"
import auth from "@/services/API/auth"
import { handleApiError } from "@/lib/handle-api-error"
import { api } from "@/services/api"

export const verifySSOTicket = createServerFn({ method: "POST" })
  .validator(verifySSOTicketSchema)

  .handler(async ({ data }): Promise<APIResponse<UserResponse>> => {
    try {
      const response = await sso.verifyTicket(data.ticket)

      if (response?.data?.token) {
        setSessionCookie(response.data.token)
        return response
      }

      throw new Error(
        "Otentikasi gagal: Token tidak ditemukan dalam respon SSO."
      )
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const setTicketAsSession = createServerFn({ method: "POST" })
  .validator(verifySSOTicketSchema)
  .handler(async ({ data }): Promise<void> => {
    setSessionCookie(data.ticket)
  })

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<UserData> => {
    try {
      const response = await auth.me()
      return {
        ...response.data.user,
        unread_count: response.data.unread_count ?? 0,
        leave_quota: response.data.leave_quota ?? 0,
        leave_quota_taken: response.data.leave_quota_taken ?? 0,
      }
    } catch (error: any) {
      // Pastikan handleApiError melempar ulang error (rethrow)
      throw handleApiError(error)
    }
  }
)

export const logout = createServerFn({ method: "POST" }).handler(
  async (): Promise<void> => {
    try {
      await api.post("/logout")
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      clearSessionCookieServer()
    }
  }
)

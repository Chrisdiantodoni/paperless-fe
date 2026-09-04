import { verifySSOTicketSchema } from "@/schema/auth.schema"
import sso from "@/services/API/sso"
import { createServerFn } from "@tanstack/react-start"
import { setSessionCookie } from "./session.server"
import type { APIResponse } from "@workspace/types/api"
import type { UserData, UserResponse } from "@workspace/types/user.type"
import auth from "@/services/API/auth"
import { handleApiError } from "@/lib/handle-api-error"

export const verifySSOTicket = createServerFn({ method: "POST" })
  .validator(verifySSOTicketSchema)

  .handler(async ({ data }): Promise<APIResponse<UserResponse>> => {
    try {
      const response = await sso.verifyTicket(data.ticket)

      if (response?.data?.token) {
        console.log(response.data.token, "token")
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
      return response.data.user
    } catch (error: any) {
      handleApiError(error)
    }
  }
)

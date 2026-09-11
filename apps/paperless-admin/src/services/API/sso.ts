import type { ErrorAPI } from "@workspace/types"
import { api } from "../api"
import axios from "axios"

const SSO_GENERATE_URL = "https://hrd-dev-api.neodev.web.id/api/sso/generate-ticket"
const LOGIN_URL = "https://hrd-dev-api.neodev.web.id/api/login"

class SSOService {
  async login(
    username: string,
    password: string
  ): Promise<{ token: string; user: string }> {
    try {
      const res = await axios.post<{
        success: boolean
        message: string
        data: { token: string; user: string }
      }>(LOGIN_URL, { username, password })
      return res.data.data
    } catch (error: any) {
      const apiError = error as ErrorAPI
      const errorMessage = apiError.message || "Gagal login."

      throw new Error(errorMessage)
    }
  }

  async verifyTicket(ticket: string): Promise<any> {
    try {
      const res = await api.post<any>("/auth/sso-verify", { ticket })
      return res.data
    } catch (error: any) {
      const apiError = error as ErrorAPI
      const errorMessage = apiError.message || "Gagal memvalidasi tiket SSO."

      throw new Error(errorMessage)
    }
  }

  async generateTicket(portalId: string, token: string): Promise<{ ticket: string; redirect_url: string }> {
    try {
      const res = await axios.post<{
        meta: { code: number; status: string; message: string }
        data: { ticket: string; redirect_url: string }
      }>(
        SSO_GENERATE_URL,
        { portal_id: portalId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return res.data.data
    } catch (error: any) {
      const apiError = error as ErrorAPI
      const errorMessage = apiError.message || "Gagal membuat tiket SSO."

      throw new Error(errorMessage)
    }
  }
}

// 3. Export instance dengan nama variabel yang deskriptif
export default new SSOService()

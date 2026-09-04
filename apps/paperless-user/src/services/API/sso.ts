import type { ErrorAPI } from "@workspace/types"
import { api } from "../api"
import axios from "axios"

const SSO_GENERATE_URL = "https://hrd-dev-api.neodev.web.id/api/sso/generate-ticket"

class SSOService {
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

  async generateTicket(portalId: string): Promise<{ ticket: string; redirect_url: string }> {
    try {
      const token = import.meta.env.VITE_SSO_GENERATE_TOKEN
      if (!token) {
        throw new Error("VITE_SSO_GENERATE_TOKEN tidak ditemukan dalam environment variables.")
      }

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

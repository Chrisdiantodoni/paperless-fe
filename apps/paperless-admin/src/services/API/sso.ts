import { api } from "../api"

class SSOService {
  async verifyTicket(ticket: string): Promise<any> {
    try {
      const res = await api.post<any>("/auth/sso-verify", { ticket })
      return res.data
    } catch (error: any) {
      console.log({ error })
      const errorMessage =
        error.response?.data?.message || "Gagal memvalidasi tiket SSO."
      throw new Error(errorMessage)
    }
  }
}

// 3. Export instance dengan nama variabel yang deskriptif
export default new SSOService()

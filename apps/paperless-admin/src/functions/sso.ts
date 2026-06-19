import sso from "@/services/API/sso"
import { createServerFn } from "@tanstack/react-start"

export const verifySSOTicket = createServerFn({ method: "POST" }).handler(
  async (ticket) => {
    // Catatan: Parameter yang dikirim dari client otomatis dibungkus ke dalam properti 'data'
    try {
      const result = await sso.verifyTicket(ticket!)

      return {
        success: true,
        token: result.token,
        user: result.user,
      }
    } catch (error: any) {
      console.log(error)
      return {
        success: false,
        message: error.message || "Terjadi kesalahan pada server.",
      }
    }
  }
)

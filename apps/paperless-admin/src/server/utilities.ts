import utilities from "@/services/API/utilities"
import { createServerFn } from "@tanstack/react-start"

export const getSidebar = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await utilities.getSidebar()
      return response.data
    } catch (error: any) {
      // Semua error (baik dari sso.verifyTicket maupun throw manual di atas) akan bermuara di sini
      throw new Error(error.message)
    }
  }
)

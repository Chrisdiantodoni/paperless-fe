import utilities from "@/services/API/utilities"
import { createServerFn } from "@tanstack/react-start"
import { handleApiError } from "@/lib/handle-api-error"

export const getSidebar = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await utilities.getSidebar()
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  }
)

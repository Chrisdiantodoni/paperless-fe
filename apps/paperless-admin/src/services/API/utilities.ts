import type { APIResponse } from "@workspace/types/api"
import type { NavPrimaryprops } from "@workspace/types/utilities"
import { api } from "../api"

class utilitiesService {
  async getSidebar(): Promise<APIResponse<NavPrimaryprops["items"]>> {
    try {
      const res = await api.get("/sidebar")
      return res.data
    } catch (error: any) {
      console.error("Error di sidebar:", error)
      throw error
    }
  }
}

export default new utilitiesService()

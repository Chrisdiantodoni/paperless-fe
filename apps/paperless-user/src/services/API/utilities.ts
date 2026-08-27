import type { APIResponse } from "@workspace/types/api"
import type { NavPrimaryprops } from "@workspace/types/utilities"
import { api } from "../api"

class UtilitiesService {
  async getSidebar(): Promise<APIResponse<NavPrimaryprops["items"]>> {
    const res = await api.get("/sidebar/user")
    return res.data
  }
}

export default new UtilitiesService()

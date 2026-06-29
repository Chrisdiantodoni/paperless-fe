import { api } from "../api"
import type { APIResponse } from "@workspace/types/api"
import type { UserResponse } from "@workspace/types/user.type"

class AuthService {
  async me(): Promise<APIResponse<UserResponse>> {
    try {
      const res = await api.get<APIResponse<UserResponse>>("/me") // Sesuaikan dengan endpoint backend Anda (misal /auth/me atau /me)
      return res.data
    } catch (error: any) {
      console.error("Error di AuthService.me:", error)
      throw error
    }
  }
}

export default new AuthService()

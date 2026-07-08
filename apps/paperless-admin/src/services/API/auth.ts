import { api } from "../api"
import type { APIResponse } from "@workspace/types/api"
import type { UserResponse } from "@workspace/types/user.type"

class AuthService {
  async me(): Promise<APIResponse<UserResponse>> {
    const res = await api.get<APIResponse<UserResponse>>("/me") // Sesuaikan dengan endpoint backend Anda (misal /auth/me atau /me)
    return res.data
  }
}

export default new AuthService()

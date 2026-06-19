import { api } from "../api"

class AuthService {
  async me() {
    const res = await api.get("/auth/me")
    return res.data
  }
}
export default new AuthService()

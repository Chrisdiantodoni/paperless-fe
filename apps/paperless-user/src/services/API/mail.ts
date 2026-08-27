import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import { api } from "../api"
import type { AllMailProps } from "@workspace/types/mail"

class mails {
  async getMail(
    params?: Record<string, string | number | undefined>
  ): Promise<APIResponse<LaravelPaginationData<AllMailProps[]>>> {
    const res = await api.get("/mail/user-mail/user-inbox", { params })
    return res.data
  }

  async getSentMail(
    params?: Record<string, string | number | undefined>
  ): Promise<APIResponse<LaravelPaginationData<AllMailProps[]>>> {
    const res = await api.get("/mail/user-mail/user-sent", { params })
    return res.data
  }

  async getMailDetails(id: string): Promise<APIResponse<AllMailProps>> {
    const res = await api.get(`/mail/user-mail/user-mails/${id}`)
    return res.data
  }
}

export default new mails()

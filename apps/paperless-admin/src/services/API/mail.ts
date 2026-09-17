import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import { api } from "../api"
import type { AllMailProps, CreateMailPayload } from "@workspace/types/mail"
import type {
  ObligatedTemplateListParams,
  ObligatedTemplateListResponse,
} from "@workspace/types"

class mails {
  async getMails(
    params?: Record<string, string | number | undefined>
  ): Promise<APIResponse<LaravelPaginationData<AllMailProps[]>>> {
    const res = await api.get("/mail/user-mail/all-requests", { params })
    return res.data
  }

  async getMailDetail(id: string): Promise<APIResponse<AllMailProps>> {
    const res = await api.get(`/mail/user-mail/user-mails/${id}`)
    return res.data
  }
}

export default new mails()

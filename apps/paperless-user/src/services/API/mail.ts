import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import { api } from "../api"
import type { AllMailProps, CreateMailPayload } from "@workspace/types/mail"
import type {
  ObligatedTemplateListParams,
  ObligatedTemplateListResponse,
} from "@workspace/types"

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

  async getDraftMail(
    params?: Record<string, string | number | undefined>
  ): Promise<APIResponse<LaravelPaginationData<AllMailProps[]>>> {
    const res = await api.get("/mail/user-mail/user-drafts", { params })
    return res.data
  }

  async getObligatedTemplates(
    params?: ObligatedTemplateListParams
  ): Promise<ObligatedTemplateListResponse> {
    const res = await api.get("/mail/obligated-templates", { params })
    return res.data.data
  }

  async createMail(
    payload: CreateMailPayload
  ): Promise<APIResponse<AllMailProps>> {
    const res = await api.post("/mail/user-mail/user-mails", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  }

  async updateMail(
    id: string,
    payload: CreateMailPayload
  ): Promise<APIResponse<AllMailProps>> {
    const res = await api.put(`/mail/user-mail/user-mails/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  }

  async deleteAttachment(attachmentId: string): Promise<APIResponse<void>> {
    const res = await api.delete(`/mail/attachments/${attachmentId}`)
    return res.data
  }

  async changeStatusMailToSent(id: string): Promise<APIResponse<void>> {
    const res = await api.post(`/mail/user-mail/send-mail/${id}`)
    return res.data
  }

  async changeStatusMailToApproved(
    id: string,
    payload: {
      notes?: string
    }
  ): Promise<APIResponse<void>> {
    const res = await api.post(`/mail/user-mail/approve-mail/${id}`, payload)
    return res.data
  }

  async changeStatusMailToRejected(
    id: string,
    payload: {
      reason: string
    }
  ): Promise<APIResponse<void>> {
    const res = await api.post(`/mail/user-mail/reject-mail/${id}`, payload)
    return res.data
  }

  async changeStatusMailToRevise(
    id: string,
    payload: {
      reason: string
    }
  ): Promise<APIResponse<void>> {
    const res = await api.post(`/mail/user-mail/revise-mail/${id}`, payload)
    return res.data
  }
}

export default new mails()

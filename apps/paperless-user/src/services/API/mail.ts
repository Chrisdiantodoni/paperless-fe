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
    payload: CreateMailPayload | FormData
  ): Promise<APIResponse<AllMailProps>> {
    console.log("\n🌐 API CLIENT: Sending request to backend")
    console.log("Endpoint: POST /mail/user-mail/user-mails")

    if (payload instanceof FormData) {
      console.log("Payload type: FormData")
      const entries: any = {}
      for (const [key, value] of payload.entries()) {
        entries[key] = value instanceof File ? `<File: ${value.name}>` : value
      }
      console.log("FormData entries:", JSON.stringify(entries, null, 2))
    } else {
      console.log("Payload type: Object")
      console.log("Payload:", JSON.stringify(payload, null, 2))
    }

    try {
      const res = await api.post("/mail/user-mail/user-mails", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log("\n✅ API CLIENT: Response received")
      console.log("Status:", res.status)
      console.log("Data preview:", JSON.stringify(res.data, null, 2).substring(0, 500))

      return res.data
    } catch (error: any) {
      console.error("\n🔴 API CLIENT: Request failed")
      console.error("Error object:", {
        status: error?.status,
        code: error?.code,
        message: error?.message,
        errors: error?.errors,
        errorMessage: error?.errorMessage,
        responseData: error?.responseData,
      })
      throw error
    }
  }

  async updateMail(
    id: string,
    payload: CreateMailPayload | FormData
  ): Promise<APIResponse<AllMailProps>> {
    const res = await api.post(`/mail/user-mail/user-mails/${id}`, payload, {
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

  async createNonTemplateMail(
    payload: FormData
  ): Promise<APIResponse<AllMailProps>> {
    const res = await api.post(
      "/mail/user-mail/create-non-template-mail",
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return res.data
  }
}

export default new mails()

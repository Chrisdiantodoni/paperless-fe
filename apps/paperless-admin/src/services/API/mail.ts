import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import { api } from "../api"
import type { AllMailProps, MailSkipProps } from "@workspace/types/mail"
import type { ApprovalBody } from "@/components/mail/dialog/approve-dialog"
import type { CancelBody } from "@/components/mail/dialog/cancel-dialog"
import type { EditableRecipient } from "@/components/mail/mail-detail"

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

  async approveMail(
    id: string,
    body: ApprovalBody
  ): Promise<APIResponse<AllMailProps>> {
    const res = await api.post(`/admin/user-mails/${id}/approval-helper`, body)
    return res.data
  }

  async cancelMail(
    id: string,
    body: CancelBody
  ): Promise<APIResponse<AllMailProps>> {
    const res = await api.post(`/admin/user-mails/${id}/cancel-approval`, body)
    return res.data
  }

  async editMailRecipient(
    id: string,
    body: { recipients: EditableRecipient[] }
  ): Promise<APIResponse<any>> {
    const res = await api.post(`/admin/user-mails/${id}/edit-recipients`, body)
    return res.data
  }

  async getListSkipMails(
    params?: Record<string, string | number | undefined>
  ): Promise<APIResponse<LaravelPaginationData<MailSkipProps[]>>> {
    const res = await api.get("/admin/skip-mails", { params })
    return res.data
  }

  async createSkipMail(body: any): Promise<APIResponse<any>> {
    const res = await api.post("/admin/skip-mails", body)
    return res.data
  }

  async getDetailSkipMail(id: string): Promise<APIResponse<MailSkipProps>> {
    const res = await api.get(`/admin/skip-mails/${id}`)
    return res.data
  }
}

export default new mails()

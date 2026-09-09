import { handleApiError } from "@/lib/handle-api-error"
import { listRequestQuerySchema } from "@/schema/mail/schema"
import { obligatedTemplateListSchema } from "@/schema/mail/obligated-template.schema"
import { createServerFn } from "@tanstack/react-start"
import mails from "@/services/API/mail"

export const getMails = createServerFn({ method: "GET" })
  .validator(listRequestQuerySchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getMail(data)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const getSentMails = createServerFn({ method: "GET" })
  .validator(listRequestQuerySchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getSentMail(data)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const getDraftMails = createServerFn({ method: "GET" })
  .validator(listRequestQuerySchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getDraftMail(data)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const getMailDetails = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getMailDetails(data)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const getObligatedTemplates = createServerFn({ method: "GET" })
  .validator(obligatedTemplateListSchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getObligatedTemplates(data)
      return response
    } catch (error: any) {
      handleApiError(error)
    }
  })

// Note: Currently unused - file uploads done client-side to avoid serialization issues
// Kept for potential future use (server-side mail creation without file uploads)
export const createUserMail = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    try {
      console.log(data)
      const response = await mails.createMail(data as any)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const updateUserMail = createServerFn({ method: "POST" })
  .validator((data: { id: string; payload: any }) => data)
  .handler(async ({ data }) => {
    try {
      const { id, payload } = data
      const response = await mails.updateMail(id, payload)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const deleteAttachment = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.deleteAttachment(data)
      return response
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const sendMail = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.changeStatusMailToSent(data)
      return response
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const reviseMail = createServerFn({ method: "POST" })
  .validator((data: { id: string; reason: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { id, reason } = data
      const response = await mails.changeStatusMailToRevise(id, { reason })
      return response
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const approveMail = createServerFn({ method: "POST" })
  .validator((data: { id: string; notes?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { id, notes } = data
      const response = await mails.changeStatusMailToApproved(id, { notes })
      return response
    } catch (error: any) {
      handleApiError(error)
    }
  })

export const rejectMail = createServerFn({ method: "POST" })
  .validator((data: { id: string; reason: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { id, reason } = data
      const response = await mails.changeStatusMailToRejected(id, { reason })
      return response
    } catch (error: any) {
      handleApiError(error)
    }
  })

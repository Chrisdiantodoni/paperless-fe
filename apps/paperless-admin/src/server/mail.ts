import { createServerFn } from "@tanstack/react-start"
import {
  createSkipMailSchema,
  listRequestQuerySchema,
  listRequestSkipMailSchema,
} from "@/schema/mail/schema"
import mails from "@/services/API/mail"
import { extractApiError } from "@workspace/api-client"
import { handleApiError, shouldRedirect } from "@/lib/handle-api-error"
import { cancelBodySchema } from "@/components/mail/dialog/cancel-dialog"
import z from "zod"
import { approvalBodySchema } from "@/components/mail/dialog/approve-dialog"

export const getMailList = createServerFn({ method: "GET" })
  .validator(listRequestQuerySchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getMails(data)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 getMails Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

export const getMailDetail = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getMailDetail(data)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 getMailDetail Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

const cancelMailInputSchema = z.object({
  id: z.string(),
  body: cancelBodySchema,
})

export const cancelMail = createServerFn({ method: "POST" })
  .validator(cancelMailInputSchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.cancelMail(data.id, data.body)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 cancelMail Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

const approveMailInputSchema = z.object({
  id: z.string(),
  body: approvalBodySchema,
})

export const approvalMail = createServerFn({ method: "POST" })
  .validator(approveMailInputSchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.approveMail(data.id, data.body)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 approvalMail Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

const editableRecipientSchema = z.object({
  user_id: z.string(),
  recipient_type: z.enum(["cc", "to"]),
  sequence: z.number(),
})

const editMailRecipientInputSchema = z.object({
  id: z.string(),
  body: z.array(editableRecipientSchema),
})

export const editMailRecipient = createServerFn({ method: "POST" })
  .validator(editMailRecipientInputSchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.editMailRecipient(data.id, {
        recipients: data.body,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 editMailRecipient Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

export const getListSkippedMails = createServerFn({ method: "GET" })
  .validator(listRequestSkipMailSchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getListSkipMails(data)
      return { success: true, data: response.data }
    } catch (error) {
      const errorInfo = extractApiError(error)
      console.error("📋 editMailRecipient Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

export const getDetailSkippedMail = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getDetailSkipMail(data)
      return { success: true, data: response.data }
    } catch (error) {
      const errorInfo = extractApiError(error)
      console.error("📋 getDetailSkippedMail Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

export const createSkipMail = createServerFn({ method: "POST" })
  .validator(createSkipMailSchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.createSkipMail(data)
      return { success: true, data: response.data }
    } catch (error) {
      const errorInfo = extractApiError(error)
      console.error("📋 sendMail Error:", errorInfo)

      if (shouldRedirect(error)) {
        handleApiError(error)
      }

      return {
        success: false,
        error: errorInfo.message,
        details: errorInfo.details,
        statusCode: errorInfo.statusCode,
      }
    }
  })

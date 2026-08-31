import { handleApiError } from "@/lib/handle-api-error"
import { listRequestQuerySchema } from "@/schema/mail/schema"
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

import { createServerFn } from "@tanstack/react-start"
import { listRequestQuerySchema } from "@/schema/mail/schema"
import mails from "@/services/API/mail"
import { extractApiError } from "@workspace/api-client"
import { handleApiError, shouldRedirect } from "@/lib/handle-api-error"

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

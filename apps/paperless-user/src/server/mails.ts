import { handleApiError, shouldRedirect } from "@/lib/handle-api-error"
import { extractApiError } from "@/lib/extract-api-error"
import { listRequestQuerySchema } from "@/schema/mail/schema"
import { obligatedTemplateListSchema } from "@/schema/mail/obligated-template.schema"
import { createServerFn } from "@tanstack/react-start"
import mails from "@/services/API/mail"

export const getMails = createServerFn({ method: "GET" })
  .validator(listRequestQuerySchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getMail(data)
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

export const getSentMails = createServerFn({ method: "GET" })
  .validator(listRequestQuerySchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getSentMail(data)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 getSentMails Error:", errorInfo)

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

export const getDraftMails = createServerFn({ method: "GET" })
  .validator(listRequestQuerySchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getDraftMail(data)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 getDraftMails Error:", errorInfo)

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

export const getMailDetails = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getMailDetails(data)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 getMailDetails Error:", errorInfo)

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

export const getObligatedTemplates = createServerFn({ method: "GET" })
  .validator(obligatedTemplateListSchema)
  .handler(async ({ data }) => {
    try {
      const response = await mails.getObligatedTemplates(data)
      return { success: true, data: response }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 getObligatedTemplates Error:", errorInfo)

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

export const createUserMail = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof (data as any).get !== "function") {
      throw new Error("Invalid payload: Expected FormData")
    }
    return data as FormData
  })
  .handler(async ({ data }) => {
    try {
      console.log("\n🟢 SERVER FUNCTION: createUserMail")
      console.log("FormData entries:")
      const entries: any = {}
      for (const [key, value] of data.entries()) {
        entries[key] =
          value instanceof File
            ? `<File: ${value.name}, size: ${value.size}>`
            : value
      }
      console.log(JSON.stringify(entries, null, 2))

      console.log("\n🟢 SERVER FUNCTION: dynamic_data fields:")
      const dynamicFields: any = {}
      for (const [key, value] of data.entries()) {
        if (key.startsWith("dynamic_data")) {
          dynamicFields[key] = value
        }
      }
      console.log(JSON.stringify(dynamicFields, null, 2))

      const response = await mails.createMail(data)

      console.log("\n✅ SERVER FUNCTION: Success response")
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error("\n🔴 SERVER FUNCTION: createUserMail Error caught")

      const errorInfo = extractApiError(error)
      console.error("📋 Error Info:", errorInfo)

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

export const createUserMailNonTemplate = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof (data as any).get !== "function") {
      throw new Error("Invalid payload: Expected FormData")
    }
    return data as FormData
  })
  .handler(async ({ data }) => {
    try {
      console.log("\n🟢 SERVER FUNCTION: createUserMail")
      console.log("FormData entries:")
      const entries: any = {}
      for (const [key, value] of data.entries()) {
        entries[key] =
          value instanceof File
            ? `<File: ${value.name}, size: ${value.size}>`
            : value
      }
      console.log(JSON.stringify(entries, null, 2))

      console.log("\n🟢 SERVER FUNCTION: dynamic_data fields:")
      const dynamicFields: any = {}
      for (const [key, value] of data.entries()) {
        if (key.startsWith("dynamic_data")) {
          dynamicFields[key] = value
        }
      }
      console.log(JSON.stringify(dynamicFields, null, 2))

      const response = await mails.createNonTemplateMail(data)

      console.log("\n✅ SERVER FUNCTION: Success response")
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error("\n🔴 SERVER FUNCTION: createUserMail Error caught")

      const errorInfo = extractApiError(error)
      console.error("📋 Error Info:", errorInfo)

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

export const updateUserMail = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof (data as any).get !== "function") {
      throw new Error("Invalid payload: Expected FormData")
    }
    return data as FormData
  })
  .handler(async ({ data }) => {
    try {
      const id = data.get("id") as string
      if (!id) throw new Error("Missing Mail ID")

      data.delete("id")

      const response = await mails.updateMail(id, data)
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 updateUserMail Error:", errorInfo)

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

export const deleteAttachment = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.deleteAttachment(data)
      return { success: true, data: response }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 deleteAttachment Error:", errorInfo)

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

export const sendMail = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await mails.changeStatusMailToSent(data)
      return { success: true, data: response }
    } catch (error: any) {
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

export const reviseMail = createServerFn({ method: "POST" })
  .validator((data: { id: string; reason: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { id, reason } = data
      const response = await mails.changeStatusMailToRevise(id, { reason })
      return { success: true, data: response }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 reviseMail Error:", errorInfo)

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

export const approveMail = createServerFn({ method: "POST" })
  .validator((data: { id: string; notes?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { id, notes } = data
      const response = await mails.changeStatusMailToApproved(id, { notes })
      return { success: true, data: response }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 approveMail Error:", errorInfo)

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

export const rejectMail = createServerFn({ method: "POST" })
  .validator((data: { id: string; reason: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { id, reason } = data
      const response = await mails.changeStatusMailToRejected(id, { reason })
      return { success: true, data: response }
    } catch (error: any) {
      const errorInfo = extractApiError(error)
      console.error("📋 rejectMail Error:", errorInfo)

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

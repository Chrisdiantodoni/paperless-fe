import {
  branchSearchSchema,
  departmentSearchSchema,
  dynamicMailTemplateSearchSchema,
  positionSearchSchema,
  staffSearchSchema,
  staticMailTemplateSearchSchema,
} from "@/schema/list.schema"
import {
  dynamicMailTemplateSchema,
  staticMailTemplateFormSchema,
  updateTemplateValidator,
  revisionRequestSchema,
  type DynamicMailTemplateForm,
  type DynamicMailTemplateInferProps,
  type StaticMailTemplateFormSchema,
} from "@/schema/master/schema"
import master from "@/services/API/master"
import { createServerFn } from "@tanstack/react-start"
import { handleApiError } from "@/lib/handle-api-error"
import { z } from "zod"

export const getArea = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await master.getArea()
    return response.data
  } catch (error: any) {
    handleApiError(error)
  }
})

export const getStaff = createServerFn({ method: "GET" })
  .validator(staffSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaff(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const getBranches = createServerFn({ method: "GET" })
  .validator(branchSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getBranches(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const getDepartments = createServerFn({ method: "GET" })
  .validator(departmentSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getDepartments(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })
export const getPositions = createServerFn({ method: "GET" })
  .validator(positionSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getPositions(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const getStaticMailTemplates = createServerFn({ method: "GET" })
  .validator(staticMailTemplateSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaticMailTemplates(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })
export const getStaticMailTemplateById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaticMailTemplateById(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const createStaticMailTemplate = createServerFn({ method: "POST" })
  .validator(staticMailTemplateFormSchema)
  .handler(async ({ data }) => {
    try {
      const recipients = data.recipients.map((item, index) => ({
        ...item,
        user_id: item.user_id.value,
        sequence: index + 1,
      }))
      const ccRecipients = data.recipients_cc.map((item, index) => ({
        ...item,
        user_id: item.user_id.value,
        sequence: index + 1,
      }))

      const newBody = {
        ...data,
        department_id: data.department_id.value,
        branches: data.branches.map((item) => item.value),
        departments: data.departments.map((item) => item.value),
        positions: data.positions.map((item) => item.value),
        recipients: [...recipients, ...ccRecipients],
      }

      const response = await master.createStaticMailTemplate(newBody)

      // Simpan ID untuk digunakan di luar try..catch
      return response.data.id
    } catch (error: any) {
      // Hanya error dari API yang akan masuk ke sini
      throw new Error(error.message)
    }
  })

export const updateStaticMailTemplate = createServerFn({ method: "POST" })
  .validator((data: { form: StaticMailTemplateFormSchema; id: string }) => data)
  .handler(async ({ data: { form, id } }) => {
    try {
      const recipients = form.recipients.map((item, index) => ({
        ...item,
        user_id: item.user_id.value,
        sequence: index + 1,
      }))
      const ccRecipients = form.recipients_cc.map((item, index) => ({
        ...item,
        user_id: item.user_id.value,
        sequence: index + 1,
      }))

      const newBody = {
        ...form,
        department_id: form.department_id.value,
        branches: form.branches.map((item) => item.value),
        departments: form.departments.map((item) => item.value),
        positions: form.positions.map((item) => item.value),
        recipients: [...recipients, ...ccRecipients],
      }

      const response = await master.updateStaticMailTemplate(id, newBody)

      // Simpan ID untuk digunakan di luar try..catch
      return response.data.id
    } catch (error: any) {
      console.log({ error })
      // Hanya error dari API yang akan masuk ke sini
      throw new Error(error.message)
    }
  })

export const deleteStaticMailTemplate = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const response = await master.deleteStaticMailTemplate(id)
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const getDynamicMailTemplate = createServerFn({
  method: "GET",
})
  .validator(dynamicMailTemplateSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getDynamicMailTemplates(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const getDynamicMailTemplateById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    try {
      const response = await master.getDynamicMailTemplateById(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const createDynamicMailTemplate = createServerFn({ method: "POST" })
  .validator(dynamicMailTemplateSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.createDynamicMailTemplate(data)
      // Simpan ID untuk digunakan di luar try..catch
      return response.data
    } catch (error: any) {
      // Hanya error dari API yang akan masuk ke sini
      throw new Error(error.message)
    }
  })

export const updateDynamicMailTemplate = createServerFn({ method: "POST" })
  .validator((data) => updateTemplateValidator.parse(data))
  .handler(async ({ data: { form, id } }) => {
    try {
      const response = await master.updateDynamicMailTemplate(id, form)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const deleteDynamicMailTemplate = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const response = await master.deleteDynamicMailTemplate(id)
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const submitDynamicMailTemplateForApproval = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const response = await master.submitDynamicMailTemplateForApproval(id)
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const approveDynamicMailTemplate = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const response = await master.approveDynamicMailTemplate(id)
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const rejectDynamicMailTemplate = createServerFn({
  method: "POST",
})
  .validator(z.object({ id: z.string(), reason: z.string() }))
  .handler(async ({ data: { id, reason } }) => {
    try {
      const response = await master.rejectDynamicMailTemplate(id, { reason })
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const requestDynamicMailTemplateRevision = createServerFn({
  method: "POST",
})
  .validator(
    z.object({
      id: z.string(),
      data: revisionRequestSchema,
    })
  )
  .handler(async ({ data: { id, data } }) => {
    try {
      const response = await master.requestDynamicMailTemplateRevision(id, data)
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

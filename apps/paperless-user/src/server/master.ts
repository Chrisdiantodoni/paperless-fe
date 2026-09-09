import {
  branchSearchSchema,
  departmentSearchSchema,
  dynamicMailTemplateSearchSchema,
  positionSearchSchema,
  staffSearchSchema,
  staticMailTemplateSearchSchema,
  subordinateSearchSchema,
} from "@/schema/list.schema"
import {
  dynamicMailTemplateSchema,
  staticMailTemplateFormSchema,
  updateTemplateValidator,
} from "@/schema/master/schema"
import type {
  DynamicMailTemplateForm,
  DynamicMailTemplateInferProps,
  StaticMailTemplateFormSchema,
} from "@/schema/master/schema"
import master from "@/services/API/master"
import { createServerFn } from "@tanstack/react-start"
import { handleApiError } from "@/lib/handle-api-error"

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

export const getObligatedStaticTemplate = createServerFn({ method: "GET" })
  .validator((data: any) => {
    try {
      const parsed = staticMailTemplateSearchSchema.parse(data)
      return parsed
    } catch (error) {
      console.error("[getObligatedStaticTemplate] Validation error:", error)
      throw error
    }
  })
  .handler(async ({ data }) => {
    try {
      const response = await master.getObligatedStaticTemplate(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const getObligatedDynamicTemplate = createServerFn({ method: "GET" })
  .validator((data: any) => {
    try {
      const parsed = dynamicMailTemplateSearchSchema.parse(data)
      return parsed
    } catch (error) {
      console.error("[getObligatedDynamicTemplate] Validation error:", error)
      throw error
    }
  })
  .handler(async ({ data }) => {
    try {
      const response = await master.getObligatedDynamicTemplate(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

export const getSubordinates = createServerFn({ method: "GET" })
  .validator(subordinateSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getSubordinates(data)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

import {
  branchSearchSchema,
  departmentSearchSchema,
  positionSearchSchema,
  staffSearchSchema,
  staticMailTemplateSearchSchema,
} from "@/schema/list.schema"
import { staticMailTemplateFormSchema } from "@/schema/master/schema"
import master from "@/services/API/master"
import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"

export const getArea = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await master.getArea()
    return response.data
  } catch (error: any) {
    throw new Error(error.message)
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

export const createStaticMailTemplate = createServerFn({ method: "POST" })
  .validator(staticMailTemplateFormSchema)
  .handler(async ({ data }) => {
    let newTemplateId: string

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

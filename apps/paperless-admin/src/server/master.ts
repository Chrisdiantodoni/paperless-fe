import { departmentSearchSchema } from "@/schema/department.schema"
import master from "@/services/API/master"
import { createServerFn } from "@tanstack/react-start"

export const getArea = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await master.getArea()
    return response
  } catch (error: any) {
    throw new Error(error.message)
  }
})

export const getBranches = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await master.getBranches()
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
)

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
export const getPositions = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await master.getPositions()
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
)

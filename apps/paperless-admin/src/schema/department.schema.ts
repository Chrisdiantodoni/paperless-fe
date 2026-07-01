import z from "zod"

export const departmentSearchSchema = z.object({
  page: z.number().catch(1),
  search: z.string().catch(""),
  status: z.enum(["all", "active", "inactive"]).catch("all"),
})

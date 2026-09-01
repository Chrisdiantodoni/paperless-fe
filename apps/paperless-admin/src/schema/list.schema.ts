import z from "zod"

export const departmentSearchSchema = z.object({
  page: z.number().catch(1).optional(),
  search: z.string().catch("").optional(),
  is_paginate: z.boolean().catch(false).optional(),
  status: z.enum(["all", "active", "inactive"]).catch("all").optional(),
})

export type DepartmentSearch = z.infer<typeof departmentSearchSchema>

export const staticMailTemplateSearchSchema = z.object({
  page: z.number().catch(1),
  search: z.string().catch(""),
  per_page: z.number().catch(10),
  branch_id: z.string().catch(""),
  branch_label: z.string().catch(""),
  department_id: z.string().catch(""),
  department_label: z.string().catch(""),
  position_id: z.string().catch(""),
  position_label: z.string().catch(""),
  is_active: z
    .preprocess(
      (val) => {
        if (val === "true" || val === true) return true
        if (val === "false" || val === false) return false
        return ""
      },
      z.union([z.boolean(), z.literal("")])
    )
    .catch(""), // Jika error/invalid, fallback ke ""
})

export type StaticMailTemplateSearch = z.infer<
  typeof staticMailTemplateSearchSchema
>

export const dynamicMailTemplateSearchSchema = z.object({
  page: z.number().catch(1),
  search: z.string().catch(""),
  per_page: z.number().catch(10),
  branch_id: z.string().catch(""),
  branch_label: z.string().catch(""),
  department_id: z.string().catch(""),
  department_label: z.string().catch(""),
  position_id: z.string().catch(""),
  position_label: z.string().catch(""),
  is_active: z
    .preprocess(
      (val) => {
        if (val === "true" || val === true) return true
        if (val === "false" || val === false) return false
        return ""
      },
      z.union([z.boolean(), z.literal("")])
    )
    .catch(""), // Jika error/invalid, fallback ke ""
})

export type DynamicMailTemplateSearch = z.infer<
  typeof dynamicMailTemplateSearchSchema
>

export const branchSearchSchema = z.object({
  page: z.number().catch(1).optional(),
  search: z.string().catch("").optional(),
  is_paginate: z.boolean().catch(false).optional(),
  status: z.enum(["all", "active", "inactive"]).catch("all").optional(),
})
export type BranchSearch = z.infer<typeof branchSearchSchema>

export const positionSearchSchema = z.object({
  page: z.number().catch(1).optional(),
  search: z.string().catch("").optional(),
  is_paginate: z.boolean().catch(false).optional(),
  status: z.enum(["all", "active", "inactive"]).catch("all").optional(),
})
export type PositionSearch = z.infer<typeof positionSearchSchema>

export const staffSearchSchema = z.object({
  page: z.number().catch(1).optional(),
  branch_id: z.string().catch(""),
  department_id: z.string().catch(""),
  position_id: z.string().catch(""),
  search: z.string().catch("").optional(),
  status: z
    .enum(["semua", "valid", "suspend", "retired"])
    .catch("semua")
    .optional(),
})

export type StaffSearch = z.infer<typeof staffSearchSchema>

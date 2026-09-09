import { z } from "zod"

export const createMailSearchSchema = z.object({
  department_id: z.string().min(1, "Department ID wajib ada"),
  department_label: z.string(),
  template_id: z.string().min(1, "Template ID wajib ada"),
  template_label: z.string(),
  request_type: z.enum([
    "dynamic",
    "dynamic_template",
    "leave_request",
    "permit_request",
    "absence_request",
    "overtime_request",
  ]),
  type: z.enum(["dynamic", "static"]),
})

export type CreateMailSearchSchema = z.infer<typeof createMailSearchSchema>

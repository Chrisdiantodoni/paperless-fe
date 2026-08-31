import { z } from "zod"

export const listRequestQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().max(100).optional(),

  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  type: z.enum(["all", "sent", "draft"]).default("all"),

  request_type: z
    .enum([
      "dynamic_template",
      "leave_request",
      "permit_request",
      "overtime_request",
      "absence_request",
    ])
    .optional(),

  status: z
    .enum(["Draft", "Sent", "Revision", "Approved", "Rejected"])
    .optional(),

  sort_by: z.enum(["created_at", "status", "document_number"]).optional(),

  sort_dir: z.enum(["asc", "desc"]).optional(),
})

export type ListRequestQueryMail = z.infer<typeof listRequestQuerySchema>
// masuk keluar draft

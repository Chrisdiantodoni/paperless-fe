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

export const listRequestSkipMailSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().max(100).optional(),
})

export type ListRequestSkipMail = z.infer<typeof listRequestSkipMailSchema>
// masuk keluar draft

const dateInputSchema = (label: string) =>
  z.any().transform((value, context) => {
    const date = value instanceof Date ? value.toISOString().slice(0, 10) : value
    const result = z.string().date(label).safeParse(date)
    if (!result.success) {
      context.addIssue(result.error.issues[0])
      return z.NEVER
    }
    return result.data
  })

const skipperInputSchema = z.any().transform((value, context) => {
  const skipperId =
    typeof value === "string" ? value : value?.value
  const result = z.string().trim().min(1, "Skipper wajib dipilih").safeParse(skipperId)
  if (!result.success) {
    context.addIssue(result.error.issues[0])
    return z.NEVER
  }
  return result.data
})

export const createSkipMailSchema = z
  .object({
    date_from: dateInputSchema("Format tanggal mulai tidak valid (YYYY-MM-DD)"),
    date_to: dateInputSchema("Format tanggal selesai tidak valid (YYYY-MM-DD)"),
    reason: z
      .string()
      .trim()
      .min(1, "Alasan wajib diisi")
      .max(500, "Alasan maksimal 500 karakter"),
    skipper_id: skipperInputSchema,
  })
  .refine(
    (data) => {
      const from = new Date(data.date_from).getTime()
      const to = new Date(data.date_to).getTime()
      return to >= from
    },
    {
      message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
      path: ["date_to"], // Menaruh pesan error langsung di input date_to
    }
  )

export type CreateSkipMail = z.infer<typeof createSkipMailSchema>

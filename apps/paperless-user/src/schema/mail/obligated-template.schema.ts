import { z } from "zod"

export const obligatedTemplateListSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  per_page: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().max(100).optional().default(""),
  type: z.string().optional().default(""),
  request_type: z.string().optional().default(""),
  category_id: z.string().optional().default(""),
  is_active: z
    .preprocess(
      (val) => {
        if (val === "true" || val === true) return "true"
        if (val === "false" || val === false) return "false"
        return ""
      },
      z.union([z.literal("true"), z.literal("false"), z.literal("")])
    )
    .catch("")
    .default("true"),
})

export type ObligatedTemplateListSchema = z.infer<
  typeof obligatedTemplateListSchema
>

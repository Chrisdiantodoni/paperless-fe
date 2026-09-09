import { z } from "zod"

export const createMailTemplateSchema = z.object({
  department: z.object({
    value: z.string().min(1, "Departemen wajib dipilih"),
    label: z.string(),
  }),
  template: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      request_type: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Template wajib dipilih",
    }),
})

export const sendMailSchema = z.object({
  ...createMailTemplateSchema.shape,
})

import { z } from "zod"

export const createMailTemplateSchema = z.object({
  department: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val.value.length > 0, {
      message: "Departemen wajib dipilih",
      path: [],
    }),
  template: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val.value.length > 0, {
      message: "Template wajib dipilih",
      path: [],
    }),
})

export const sendMailSchema = z.object({
  ...createMailTemplateSchema,
})

import { z } from "zod"

const selectValueSchema = z.object({
  value: z.string(),
  label: z.string(),
})

const recipientItemSchema = z.object({
  user_id: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val.value.length > 0, {
      message: "Penerima wajib dipilih",
      path: [], // penting: bikin error nempel di department_id, bukan department_id.value
    }),
  recipient_type: z.enum(["to", "cc"]),
  sequence: z.number(),
})

export const staticMailTemplateFormSchema = z.object({
  name: z.string().min(1, { message: "Nama template wajib diisi" }).max(255),
  code: z.string().min(1, { message: "Kode wajib diisi" }).max(50),
  department_id: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val.value.length > 0, {
      message: "Departemen wajib dipilih",
      path: [], // penting: bikin error nempel di department_id, bukan department_id.value
    }),

  description: z.string().optional(),
  content: z.string().optional(),
  branches: z
    .array(selectValueSchema)
    .min(1, { message: "Minimal harus ada 1 cabang" }),
  departments: z
    .array(selectValueSchema)
    .min(1, { message: "Minimal harus ada 1 departemen" }),
  positions: z
    .array(selectValueSchema)
    .min(1, { message: "Minimal harus ada 1 posisi" }),
  recipients: z
    .array(recipientItemSchema)
    .min(1, { message: "Minimal harus ada 1 penerima email" }),
  recipients_cc: z.array(recipientItemSchema),
})

export type StaticMailTemplateFormSchema = z.infer<
  typeof staticMailTemplateFormSchema
>
export type RecipientItem = z.infer<typeof recipientItemSchema>

const emptySelectValue = { value: "", label: "" }

export const emptyStaticMailTemplateValues: StaticMailTemplateFormSchema = {
  name: "",
  code: "",
  description: "",
  content: "",
  department_id: { ...emptySelectValue },
  branches: [],
  departments: [],
  positions: [],
  recipients: [],
  recipients_cc: [],
}

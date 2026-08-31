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
      path: [],
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

// =====================
// Dynamic Mail Template
// =====================
//

export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "checkbox",
  "department",
  "branch",
  "position",
  "staff",
  "date",
] as const
export type FieldType = (typeof FIELD_TYPES)[number]

export const fieldDefinitionSchema = z.object({
  type: z.enum(FIELD_TYPES, { message: "Tipe field wajib dipilih" }),
  name: z.string().min(1, { message: "Name wajib diisi" }),
  label: z.string().min(1, { message: "Label wajib diisi" }),
  is_required: z.boolean(),
  dependsOn: z.array(z.string()).optional(),
})

export type FieldDefinition = z.infer<typeof fieldDefinitionSchema>
// Old formSchema kept as alias for backward compat (or remove)
export const formSchema = fieldDefinitionSchema

const dynamicMailTemplateObject = z.object({
  name: z.string().min(1, { message: "Nama template wajib diisi" }).max(255),
  code: z.string().min(1, { message: "Kode wajib diisi" }).max(50),
  description: z.string().optional(),
  department: selectValueSchema.refine((val) => val.value.length > 0, {
    message: "Departemen wajib dipilih",
    path: [],
  }),
  form_schema: z
    .array(fieldDefinitionSchema)
    .min(1, { message: "Minimal harus ada 1 field" }),
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

export const emptyDynamicMailTemplateValues: DynamicMailTemplateForm = {
  name: "",
  code: "",
  description: "",
  content: "",
  form_schema: [],
  department: { ...emptySelectValue },
  branches: [],
  departments: [],
  positions: [],
  recipients: [],
  recipients_cc: [],
}

/** Use this for form validators (pre-transform) */
export const dynamicMailTemplateValidator = dynamicMailTemplateObject

// 1. Definisikan schema utamanya (Schema untuk Form)
export const dynamicMailTemplateSchema = dynamicMailTemplateObject.transform(
  (data) => {
    // Pisahkan 'department' dari data lainnya
    const { department, recipients, recipients_cc, ...rest } = data
    const newRecipients = recipients.map((item, index) => ({
      ...item,
      user_id: item.user_id.value,
      sequence: index + 1,
    }))
    const newCCRecipients = recipients_cc.map((item, index) => ({
      ...item,
      user_id: item.user_id.value,
      sequence: index + 1,
    }))
    // Return object baru dengan 'department_id' sebagai pengganti 'department'
    return {
      ...rest,
      departments: data.departments.map((item) => item.value),
      branches: data.branches.map((item) => item.value),
      positions: data.positions.map((item) => item.value),
      department_id: department.value,
      recipients: [...newRecipients, ...newCCRecipients],
    }
  }
)

export type DynamicMailTemplateForm = z.input<typeof dynamicMailTemplateSchema>
export type DynamicMailTemplateInferProps = z.infer<
  typeof dynamicMailTemplateSchema
>

export type DynamicMailTemplatePayload = z.output<
  typeof dynamicMailTemplateSchema
>

export const updateTemplateValidator = z.object({
  id: z.string(),
  form: dynamicMailTemplateSchema,
})

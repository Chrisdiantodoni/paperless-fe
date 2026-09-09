import { z } from "zod"

const selectValueSchema = z.object({
  value: z.string(),
  label: z.string(),
})

const recipientItemSchema = z.object({
  user_id: selectValueSchema.refine((val) => val.value.length > 0, {
    message: "Penerima wajib dipilih",
  }),
  recipient_type: z.enum(["to", "cc"]),
  sequence: z.number(),
})

export const composeNonTemplateSchema = z.object({
  description: z.string().min(1, "Subject wajib diisi").max(255),
  content: z.string().min(1, "Isi surat wajib diisi"),
  recipients: z
    .array(recipientItemSchema)
    .min(1, "Minimal 1 penerima (To) wajib diisi"),
  recipients_cc: z.array(recipientItemSchema),
  notes: z.string(),
  attachments: z.array(z.instanceof(File)).max(5, "Maksimal 5 file"),
})

export type ComposeNonTemplateForm = z.infer<typeof composeNonTemplateSchema>

export const emptyRecipient = {
  user_id: { value: "", label: "" },
  recipient_type: "to" as const,
  sequence: 1,
}

export const emptyCcRecipient = {
  user_id: { value: "", label: "" },
  recipient_type: "cc" as const,
  sequence: 1,
}

import { z } from "zod"

export const createMailTemplateSchema = z.object({
  request_type: z.enum(
    [
      "dynamic",
      "leave_request",
      "permit_request",
      "absence_request",
      "overtime_request",
    ],
    {
      message: "Tipe pengajuan wajib dipilih",
    }
  ),
  department: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val.value.length > 0, {
      message: "Departemen wajib dipilih",
      path: [], // penting: bikin error nempel di department_id, bukan department_id.value
    }),
  template: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val.value.length > 0, {
      message: "Template wajib dipilih",
      path: [], // penting: bikin error nempel di department_id, bukan department_id.value
    }),
})

export const sendMailSchema = z.object({
  ...createMailTemplateSchema,
})

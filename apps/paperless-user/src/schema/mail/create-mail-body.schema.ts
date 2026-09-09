import { z } from "zod"

// Helper untuk tanggal ISO toleran
const dateSchema = z
  .string()
  .min(1, "Tanggal wajib diisi")
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  })

// Helper untuk field opsional string form (mengubah "" menjadi null)
const optionalString = z
  .string()
  .nullish()
  .transform((val) => (val === "" ? null : val))

// Helper waktu: mendeteksi HH:mm:ss (contoh: 08:00:00) dan memotongnya jadi HH:mm (08:00)
const formatTime = (val: string) =>
  /^\d{2}:\d{2}:\d{2}$/.test(val) ? val.slice(0, 5) : val

// Helper untuk field waktu wajib (digunakan di overtime detail)
const requiredTimeString = z
  .string()
  .min(1, "Waktu wajib diisi")
  .transform(formatTime)

// Helper untuk field waktu opsional (digunakan di permit)
const optionalTimeString = optionalString.transform((val) =>
  val ? formatTime(val) : null
)

export const createMailLeaveDataSchema = z.object({
  static_mail_template_id: z.string().nullish(),
  start_date: dateSchema,
  end_date: dateSchema,
  days_taken: z.coerce.number().min(0.5, "Minimal 0.5 hari"),
  leave_type: z.string().min(1, "Jenis cuti wajib dipilih"),
  reason: z
    .string()
    .min(1, "Alasan wajib diisi")
    .max(1000, "Alasan maksimal 1000 karakter"),
})

export const createMailPermitDataSchema = z
  .object({
    static_mail_template_id: z.string().nullish(),
    date: dateSchema,
    permit_type: z.enum(
      [
        "Terlambat Masuk Kantor",
        "Keluar Kantor pada Jam Kerja",
        "Pulang Lebih Awal",
      ],
      { message: "Jenis izin wajib dipilih" }
    ),
    start_work_at: optionalTimeString,
    exit_time: optionalTimeString,
    return_time: optionalTimeString,
    end_work_at: optionalTimeString,
    reason: z
      .string()
      .min(1, "Alasan wajib diisi")
      .max(1000, "Alasan maksimal 1000 karakter"),
  })
  .superRefine((data, ctx) => {
    if (data.permit_type === "Terlambat Masuk Kantor") {
      if (!data.start_work_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jam Masuk Kerja wajib diisi untuk izin terlambat",
          path: ["start_work_at"],
        })
      }
    }

    if (data.permit_type === "Keluar Kantor pada Jam Kerja") {
      if (!data.exit_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jam Keluar wajib diisi",
          path: ["exit_time"],
        })
      }
      if (!data.return_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jam Kembali wajib diisi",
          path: ["return_time"],
        })
      }
    }

    if (data.permit_type === "Pulang Lebih Awal") {
      if (!data.end_work_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jam Pulang Kerja wajib diisi",
          path: ["end_work_at"],
        })
      }
    }
  })
  .transform((data) => {
    switch (data.permit_type) {
      case "Terlambat Masuk Kantor":
        return {
          ...data,
          exit_time: null,
          return_time: null,
          end_work_at: null,
        }
      case "Keluar Kantor pada Jam Kerja":
        return { ...data, start_work_at: null, end_work_at: null }
      case "Pulang Lebih Awal":
        return {
          ...data,
          start_work_at: null,
          exit_time: null,
          return_time: null,
        }
      default:
        return data
    }
  })

export const createMailAbsenceDataSchema = z.object({
  static_mail_template_id: z.string().nullish(),
  start_date: dateSchema,
  end_date: dateSchema,
  reason: z
    .string()
    .min(1, "Alasan wajib diisi")
    .max(1000, "Alasan maksimal 1000 karakter"),
})

export const createMailOvertimeDetailSchema = z.object({
  user_id: z.string().min(1, "Staff wajib dipilih"),
  date: dateSchema,
  start_time: requiredTimeString,
  end_time: requiredTimeString,
  reason: z
    .string()
    .min(1, "Alasan wajib diisi")
    .max(1000, "Alasan maksimal 1000 karakter"),
})

export const createMailOvertimeDataSchema = z.object({
  static_mail_template_id: z.string().nullish(),
  details: z
    .array(createMailOvertimeDetailSchema)
    .min(1, "Minimal 1 detail lembur"),
  reason: z
    .string()
    .min(1, "Alasan wajib diisi")
    .max(1000, "Alasan maksimal 1000 karakter"),
})

export const createMailDynamicDataSchema = z.object({
  dynamic_mail_template_id: z.string().nullish(),
  payload: z.string().min(1, "Isi surat wajib diisi"),
  form_schema: z.array(z.any()),
})

export const createMailDelegationSchema = z
  .object({
    user_id: z.string().optional(),
    value: z.string().optional(),
    label: z.string().optional(),
  })
  .transform((item) => ({
    user_id: item.user_id ?? item.value ?? "",
  }))
  .refine((item) => item.user_id.length > 0, {
    message: "User ID wajib diisi",
    path: ["user_id"],
  })

export const createMailPayloadSchema = z
  .object({
    request_type: z.enum([
      "dynamic",
      "dynamic_template",
      "leave_request",
      "permit_request",
      "absence_request",
      "overtime_request",
    ]),
    notes: optionalString,
    delegations: z.array(createMailDelegationSchema).nullish(),
    leave_data: createMailLeaveDataSchema.optional(),
    permit_data: createMailPermitDataSchema.optional(),
    absence_data: createMailAbsenceDataSchema.optional(),
    overtime_data: createMailOvertimeDataSchema.optional(),
    dynamic_data: createMailDynamicDataSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.request_type === "leave_request" && !data.leave_data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data cuti wajib diisi",
        path: ["leave_data"],
      })
    }
    if (data.request_type === "permit_request" && !data.permit_data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data izin wajib diisi",
        path: ["permit_data"],
      })
    }
    if (data.request_type === "absence_request" && !data.absence_data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data ketidakhadiran wajib diisi",
        path: ["absence_data"],
      })
    }
    if (data.request_type === "overtime_request" && !data.overtime_data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data lembur wajib diisi",
        path: ["overtime_data"],
      })
    }
    if (data.request_type === "dynamic_template" && !data.dynamic_data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data template dynamic wajib diisi",
        path: ["dynamic_data"],
      })
    }
  })

export type CreateMailPayloadSchema = z.infer<typeof createMailPayloadSchema>

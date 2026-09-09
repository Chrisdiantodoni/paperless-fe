import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { createMailSearchSchema } from "@/schema/mail/create-mail-search.schema"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { useAppForm } from "@workspace/forms/src/forms"
import { useUser } from "@/hooks/queries/use-user"
import { handleApiError } from "@/lib/handle-api-error"
import { Button } from "@workspace/ui/components/ui/button"
import { toast } from "sonner"
import { createUserMail } from "@/server/mails"
import { createMailPayloadSchema } from "@/schema/mail/create-mail-body.schema"
import { getRequestTypeLabel } from "@workspace/utils"
import { ArrowLeft } from "lucide-react"
import { BasicInfoSection } from "@/components/create/sections/BasicInfoSection"
import { RequestDetailsSection } from "@/components/create/sections/RequestDetailsSection"
import { SummaryCard } from "@/components/create/sections/SummaryCard"
import { ErrorSummaryCard } from "@/components/create/sections/ErrorSummaryCard"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { useStore } from "@tanstack/react-form"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { useRef } from "react"
import { getDynamicMailTemplateById } from "@/server/master"

export const Route = createFileRoute("/_dashboard/mail/user-mails/create")({
  component: RouteComponent,
  validateSearch: createMailSearchSchema,
  loaderDeps: ({ search }) => ({
    template_id: search.template_id,
    template_type: search.request_type,
  }),
  loader: async ({ deps }) => {
    const { template_id, template_type } = deps

    // Hanya fetch jika request_type adalah dynamic dan template_id tersedia
    const isDynamic =
      template_type === "dynamic" || template_type === "dynamic_template"
    if (!isDynamic || !template_id) {
      return null
    }

    const res = await getDynamicMailTemplateById({ data: template_id })
    return res
  },
})
function getDefaultFormValues(
  search: {
    request_type: string
    template_id?: string
  },
  template?: any
) {
  const templateId = search.template_id ?? null

  return {
    request_type: search.request_type,
    notes: "" as string | null,
    delegations: [] as Array<{ value: string; label?: string }>,
    attachments: [] as File[],

    leave_data:
      search.request_type === "leave_request"
        ? {
            static_mail_template_id: templateId,
            start_date: "",
            end_date: "",
            days_taken: 1,
            leave_type: "",
            reason: "",
          }
        : undefined,

    permit_data:
      search.request_type === "permit_request"
        ? {
            static_mail_template_id: templateId,
            date: "",
            permit_type: "Terlambat Masuk Kantor" as const,
            start_work_at: "",
            exit_time: "",
            return_time: "",
            end_work_at: "",
            reason: "",
          }
        : undefined,

    absence_data:
      search.request_type === "absence_request"
        ? {
            static_mail_template_id: templateId,
            start_date: "",
            end_date: "",
            reason: "",
          }
        : undefined,

    overtime_data:
      search.request_type === "overtime_request"
        ? {
            static_mail_template_id: templateId,
            reason: "",
            details: [
              {
                user_id: "",
                date: "",
                start_time: "",
                end_time: "",
                reason: "",
              },
            ],
          }
        : undefined,

    dynamic_data:
      search.request_type === "dynamic_template"
        ? {
            dynamic_mail_template_id: templateId,
            payload: "",
            form_schema:
              template && Array.isArray(template.form_schema)
                ? template.form_schema.map((field: any) => ({
                    key: field.key,
                    value: "",
                    label: field.label,
                    type: field.type,
                    is_required: field.is_required,
                  }))
                : [],
          }
        : undefined,
  }
}

function RouteComponent() {
  const search = Route.useSearch()
  const template = Route.useLoaderData()

  const navigate = useNavigate()
  const { data: user } = useUser()
  const confirm = useConfirm()
  const filesRef = useRef<File[]>([])

  const form = useAppForm({
    defaultValues: getDefaultFormValues(search, template),
    validators: {
      onChange: createMailPayloadSchema as any,
    },
    onSubmitInvalid: (value) => {
      console.log(value)
    },
    canSubmitWhenInvalid: true,
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData()

        formData.append(
          "request_type",
          value.request_type === "dynamic_template"
            ? "dynamic"
            : value.request_type
        )
        formData.append("user_id", user.id)
        if (value.notes) {
          formData.append("notes", value.notes)
        }

        if (value.delegations && value.delegations.length > 0) {
          value.delegations.forEach((delegation, index) => {
            const userId = delegation?.value ?? delegation
            if (userId) {
              formData.append(`delegations[${index}][user_id]`, String(userId))
            }
          })
        }

        if (filesRef.current && filesRef.current.length > 0) {
          filesRef.current.forEach((file) => {
            formData.append("attachments[]", file)
          })
        }

        const templateId = search.template_id

        if (value.request_type === "leave_request" && value.leave_data) {
          const leaveData = {
            ...value.leave_data,
            static_mail_template_id:
              value.leave_data.static_mail_template_id || templateId,
          }
          Object.entries(leaveData).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              formData.append(`leave_data[${k}]`, String(v))
            }
          })
        }

        if (value.request_type === "permit_request" && value.permit_data) {
          const permitData = {
            ...value.permit_data,
            static_mail_template_id:
              value.permit_data.static_mail_template_id || templateId,
          }
          Object.entries(permitData).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              formData.append(`permit_data[${k}]`, String(v))
            }
          })
        }

        if (value.request_type === "absence_request" && value.absence_data) {
          const absenceData = {
            ...value.absence_data,
            static_mail_template_id:
              value.absence_data.static_mail_template_id || templateId,
          }
          Object.entries(absenceData).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              formData.append(`absence_data[${k}]`, String(v))
            }
          })
        }

        if (value.request_type === "overtime_request" && value.overtime_data) {
          const otData = value.overtime_data
          const otTemplateId = otData.static_mail_template_id || templateId
          if (otTemplateId) {
            formData.append(
              "overtime_data[static_mail_template_id]",
              otTemplateId
            )
          }
          if (otData.reason) {
            formData.append("overtime_data[reason]", otData.reason)
          }

          if (Array.isArray(otData.details)) {
            otData.details.forEach((item: any, idx: number) => {
              Object.entries(item).forEach(([k, v]) => {
                if (v !== undefined && v !== null) {
                  formData.append(
                    `overtime_data[details][${idx}][${k}]`,
                    String(v)
                  )
                }
              })
            })
          }
        }
        if (value.request_type === "dynamic_template" && value.dynamic_data) {
          console.log("🔍 DEBUG: dynamic_data object SEBELUM processing:")
          console.log(JSON.stringify(value.dynamic_data, null, 2))

          console.log("\n🔍 DEBUG: dynamic_data fields breakdown:")
          console.log("  - dynamic_mail_template_id:", value.dynamic_data.dynamic_mail_template_id)
          console.log("  - payload type:", typeof value.dynamic_data.payload)
          console.log("  - payload length:", value.dynamic_data.payload?.length)
          console.log("  - payload preview (first 200 chars):", value.dynamic_data.payload?.substring(0, 200))
          console.log("  - form_schema type:", typeof value.dynamic_data.form_schema)
          console.log("  - form_schema is array:", Array.isArray(value.dynamic_data.form_schema))
          console.log("  - form_schema length:", value.dynamic_data.form_schema?.length)
          console.log("  - form_schema content:", JSON.stringify(value.dynamic_data.form_schema, null, 2))

          const dynamicData = value.dynamic_data
          const dtTemplateId =
            dynamicData.dynamic_mail_template_id || templateId

          if (dtTemplateId) {
            formData.append(
              "dynamic_data[dynamic_mail_template_id]",
              dtTemplateId
            )
          }

          if (dynamicData.payload) {
            formData.append(
              "dynamic_data[payload]",
              dynamicData.payload
            )
          }

          if (Array.isArray(dynamicData.form_schema)) {
            formData.append(
              "dynamic_data[form_schema]",
              JSON.stringify(dynamicData.form_schema)
            )
          }
        }

        console.log("\n✅ DEBUG: FormData entries untuk dynamic_data:")
        const dynamicEntries: any = {}
        for (const [key, value] of formData.entries()) {
          if (key.startsWith("dynamic_data")) {
            dynamicEntries[key] = value instanceof File ? `<File: ${value.name}>` : value
          }
        }
        console.log(JSON.stringify(dynamicEntries, null, 2))

        console.log("\n📤 FormData being sent:")
        for (const [key, value] of formData.entries()) {
          console.log(
            `  ${key}:`,
            value instanceof File ? `<File: ${value.name}>` : value
          )
        }

        const result = await createUserMail({ data: formData })

        if (!result.success) {
          console.error("❌ Create mail failed:", result)

          toast.error(result.error || "Gagal membuat mail")

          if (result.details) {
            console.error("Validation errors:", result.details)
            const detailMessages = Object.entries(result.details)
              .map(([field, errors]: [string, any]) => `${field}: ${errors.join(", ")}`)
              .join("\n")
            toast.error(`Detail errors:\n${detailMessages}`)
          }

          return
        }

        toast.success("Mail berhasil dibuat")
        navigate({ to: "/mail/user-mails" })
      } catch (error) {
        console.error("Submit Mail Error:", error)
        handleApiError(error)
      }
    },
  })

  const isDirty = useStore(form.store, (state) => state.isDirty)
  const { confirmNavigation } = useUnsavedChanges({
    isDirty,
    message:
      "Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?",
  })

  const startDate = useStore(
    form.store,
    (state) => state.values.leave_data?.start_date
  )
  const endDate = useStore(
    form.store,
    (state) => state.values.leave_data?.end_date
  )
  const singleDate = useStore(
    form.store,
    (state) =>
      state.values.permit_data?.date || state.values.absence_data?.start_date
  )
  const daysTaken = useStore(
    form.store,
    (state) => state.values.leave_data?.days_taken
  )
  const delegations = useStore(
    form.store,
    (state) => state.values.delegations || []
  )
  const attachments = useStore(
    form.store,
    (state) => state.values.attachments || []
  )

  console.log({ template })

  const showDelegations =
    search.request_type === "leave_request" ||
    search.request_type === "permit_request"

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            confirmNavigation(() => navigate({ to: "/mail/user-mails" }))
          }
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Buat Mail: {search.template_label}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {search.department_label} •{" "}
              {getRequestTypeLabel(search.request_type)}
            </p>
          </div>
          {isDirty && (
            <span className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600">
              Draft - Belum Disimpan
            </span>
          )}
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const confirmed = await confirm({
            title: "Konfirmasi Kirim Mail",
            description: "Apakah Anda yakin ingin mengirim mail ini?",
          })
          if (confirmed) {
            form.handleSubmit()
          }
        }}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <BasicInfoSection
              form={form}
              departmentId={search.department_id}
              showDelegations={showDelegations}
              onFilesChange={(files) => {
                filesRef.current = files
              }}
            />
            <RequestDetailsSection
              form={form}
              requestType={search.request_type}
              template={template ?? undefined}
            />
          </div>

          <div className="hidden lg:block">
            <SummaryCard
              templateLabel={search.template_label}
              departmentLabel={search.department_label}
              startDate={startDate}
              endDate={endDate}
              singleDate={singleDate}
              duration={daysTaken ? `${daysTaken} hari kerja` : undefined}
              delegations={delegations}
              attachmentCount={attachments.length}
              status={isDirty ? "draft" : "ready"}
            />
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <ErrorSummaryCard errors={[]} />

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  confirmNavigation(() => navigate({ to: "/mail/user-mails" }))
                }
              >
                Batal
              </Button>
              <form.AppForm>
                <form.SubmitButton label="Kirim Mail" />
              </form.AppForm>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

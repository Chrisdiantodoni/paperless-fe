import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { useAppForm } from "@workspace/forms/src/forms"
import { useUser } from "@/hooks/queries/use-user"
import { handleApiError } from "@/lib/handle-api-error"
import { Button } from "@workspace/ui/components/ui/button"
import { toast } from "sonner"
import { updateUserMail, deleteAttachment } from "@/server/mails"
import { createMailPayloadSchema } from "@/schema/mail/create-mail-body.schema"
import { getRequestTypeLabel } from "@workspace/utils"
import { ArrowLeft } from "lucide-react"
import { BasicInfoSection } from "@/components/create/sections/BasicInfoSection"
import { RequestDetailsSection } from "@/components/create/sections/RequestDetailsSection"
import { SummaryCard } from "@/components/create/sections/SummaryCard"
import { ErrorSummaryCard } from "@/components/create/sections/ErrorSummaryCard"
import { AttachmentItem } from "@/components/mail/AttachmentItem"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { useStore } from "@tanstack/react-form"
import { useMailDetail } from "@/hooks/queries/use-mails"
import { useState, useEffect } from "react"
import type { AllMailProps } from "@workspace/types/mail"

export const Route = createFileRoute(
  "/_dashboard/mail/user-mails/$mailId/edit"
)({
  component: RouteComponent,
})

function getDefaultFormValues(mail: AllMailProps & { mail_template?: { id: string } }) {
  const req = mail.request_data
  const templateId = mail.mail_template?.id ?? ""

  return {
    request_type: req.type,
    notes: req.notes ?? "",
    delegations:
      mail.delegations?.map((d) => ({
        value: String(d.user_id || d.id),
        label: d.name,
      })) ?? [],
    attachments: [] as File[],

    leave_data:
      req.type === "leave_request"
        ? {
            static_mail_template_id: templateId ?? "",
            start_date: req.start_date ?? "",
            end_date: req.end_date ?? "",
            days_taken: Number(req.quota_deducted) || 1,
            leave_type: req.leave_type ?? "",
            reason: req.reason ?? "",
          }
        : undefined,

    permit_data:
      req.type === "permit_request"
        ? {
            static_mail_template_id: templateId ?? "",
            date: req.date ? new Date(req.date).toISOString().split("T")[0] : "",
            permit_type: (req.permit_type as any) ?? "Terlambat Masuk Kantor",
            start_work_at: req.start_work_at ?? "",
            exit_time: req.exit_time ?? "",
            return_time: req.return_time ?? "",
            end_work_at: req.end_work_at ?? "",
            reason: req.reason ?? "",
          }
        : undefined,

    absence_data:
      req.type === "absence_request"
        ? {
            static_mail_template_id: templateId ?? "",
            start_date: req.start_date ?? "",
            end_date: req.end_date ?? "",
            reason: req.reason ?? "",
          }
        : undefined,

    overtime_data:
      req.type === "overtime_request"
        ? {
            static_mail_template_id: templateId ?? "",
            reason: req.reason ?? "",
            details:
              req.table_details?.map((d: any) => ({
                user_id: String(d.user_id || d.id),
                date: d.date,
                start_time: d.start_time,
                end_time: d.end_time,
                reason: d.reason,
              })) ?? [],
          }
        : undefined,

    dynamic_data:
      req.type === "dynamic"
        ? {
            dynamic_mail_template_id: templateId ?? "",
            payload: "{}",
            form_schema: "[]",
          }
        : undefined,
  }
}

function RouteComponent() {
  const { mailId } = Route.useParams()
  const navigate = useNavigate()
  const { data: user } = useUser()
  const { data: mail, isLoading } = useMailDetail(mailId)
  const [existingAttachments, setExistingAttachments] = useState<
    Array<{ id: string; name: string; url: string }>
  >([])
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<string[]>(
    []
  )

  useEffect(() => {
    if (mail?.attachments) {
      setExistingAttachments(
        mail.attachments.map((a) => ({
          id: String(a.id),
          name: a.file_name,
          url: a.file_url,
        }))
      )
    }
  }, [mail])

  const form = useAppForm({
    defaultValues: mail ? getDefaultFormValues(mail) : undefined,
    validators: {
      onChange: createMailPayloadSchema as any,
    },
    onSubmitInvalid: ({ value }) => {
      console.log(value)
    },
    canSubmitWhenInvalid: true,
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData()

        formData.append("request_type", value.request_type)
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

        if (deletedAttachmentIds.length > 0) {
          deletedAttachmentIds.forEach((id, index) => {
            formData.append(`deleted_attachments[${index}]`, id)
          })
        }

        if (value.attachments && value.attachments.length > 0) {
          value.attachments.forEach((file) => {
            if (file instanceof File) {
              formData.append("attachments[]", file)
            }
          })
        }

        if (value.request_type === "leave_request" && value.leave_data) {
          Object.entries(value.leave_data).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              formData.append(`leave_data[${k}]`, String(v))
            }
          })
        }

        if (value.request_type === "permit_request" && value.permit_data) {
          Object.entries(value.permit_data).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              formData.append(`permit_data[${k}]`, String(v))
            }
          })
        }

        if (value.request_type === "absence_request" && value.absence_data) {
          Object.entries(value.absence_data).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              formData.append(`absence_data[${k}]`, String(v))
            }
          })
        }

        if (value.request_type === "overtime_request" && value.overtime_data) {
          const otData = value.overtime_data
          if (otData.static_mail_template_id) {
            formData.append(
              "overtime_data[static_mail_template_id]",
              otData.static_mail_template_id
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

        if (value.request_type === "dynamic" && value.dynamic_data) {
          Object.entries(value.dynamic_data).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              formData.append(`dynamic_data[${k}]`, String(v))
            }
          })
        }

        await updateUserMail({ data: { id: mailId, payload: formData } })
        toast.success("Mail berhasil diupdate")
        navigate({ to: "/mail/user-mails" })
      } catch (error) {
        console.error("Update Mail Error:", error)
        handleApiError(error)
      }
    },
  })

  const handleDeleteExistingAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment({ data: attachmentId })
      setExistingAttachments((prev) =>
        prev.filter((a) => a.id !== attachmentId)
      )
      setDeletedAttachmentIds((prev) => [...prev, attachmentId])
      toast.success("Attachment berhasil dihapus")
    } catch (error) {
      handleApiError(error)
    }
  }

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

  const showDelegations =
    mail?.request_data.type === "leave_request" ||
    mail?.request_data.type === "permit_request"

  if (isLoading || !mail) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  const mailWithTemplate = mail as AllMailProps & {
    mail_template?: { id: string; name: string; department_id: string; department?: { name: string } }
  }

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
              Edit Mail: {mailWithTemplate.mail_template?.name ?? "Mail"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mailWithTemplate.mail_template?.department?.name ?? "-"} •{" "}
              {getRequestTypeLabel(mail.request_data.type)}
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
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {existingAttachments.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-3 text-sm font-medium">
                    Existing Attachments
                  </h3>
                  <div className="space-y-2">
                    {existingAttachments.map((attachment) => (
                      <AttachmentItem
                        key={attachment.id}
                        file={{
                          id: attachment.id,
                          name: attachment.name,
                          url: attachment.url,
                        }}
                        mode="edit"
                        onDelete={handleDeleteExistingAttachment}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <BasicInfoSection
              form={form}
              departmentId={mailWithTemplate.mail_template?.department_id ?? ""}
              showDelegations={showDelegations}
            />

            <RequestDetailsSection
              form={form}
              requestType={mail.request_data.type}
              formSchema={[]}
            />
          </div>

          <div className="hidden lg:block">
            <SummaryCard
              templateLabel={mailWithTemplate.mail_template?.name ?? "Mail"}
              departmentLabel={mailWithTemplate.mail_template?.department?.name ?? "-"}
              startDate={startDate}
              endDate={endDate}
              singleDate={singleDate}
              duration={daysTaken ? `${daysTaken} hari kerja` : undefined}
              delegations={delegations}
              attachmentCount={
                attachments.length + existingAttachments.length
              }
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
                <form.SubmitButton label="Update Mail" />
              </form.AppForm>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

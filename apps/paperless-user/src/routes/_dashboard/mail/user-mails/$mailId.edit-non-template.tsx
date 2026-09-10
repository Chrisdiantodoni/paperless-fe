// route: /_dashboard/mail/user-mails/$mailId/edit-non-template
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"
import { useStore } from "@tanstack/react-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { toast } from "sonner"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { handleApiError } from "@/lib/handle-api-error"
import { useAppForm } from "@workspace/forms/src/forms"
import { composeNonTemplateSchema } from "@/schema/mail/compose-non-template.schema"
import { StaffCombobox } from "@/components/select/select-staff"
import { AttachmentItem } from "@/components/mail/AttachmentItem"
import { ErrorSummaryCard } from "@/components/create/sections/ErrorSummaryCard"
import { deleteAttachment, updateUserMail } from "@/server/mails"
import { useMailDetail } from "@/hooks/queries/use-mails"
import { useUser } from "@/hooks/queries/use-user"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import {
  getFormFieldErrors,
  useFormFieldErrors,
} from "@/hooks/use-form-errors"
import {
  ArrowLeft,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Plus,
  Lock,
} from "lucide-react"
import type { AllMailProps } from "@workspace/types/mail"

export const Route = createFileRoute(
  "/_dashboard/mail/user-mails/$mailId/edit-non-template"
)({
  component: RouteComponent,
})

interface RecipientFormItem {
  user_id: { value: string; label: string }
  recipient_type: "to" | "cc"
  sequence: number
  status?: string
  locked: boolean
}

const emptyItem = (type: "to" | "cc"): RecipientFormItem => ({
  user_id: { value: "", label: "" },
  recipient_type: type,
  sequence: 1,
  status: "pending",
  locked: false,
})

function getDefaultValues(mail: AllMailProps) {
  const req = mail.request_data

  const mapRecipients = (type: "to" | "cc") =>
    (mail.recipients || [])
      .filter((r) => r.recipient_type === type)
      .sort((a, b) => a.sequence - b.sequence)
      .map((r) => ({
        user_id: { value: r.recipient_user_id, label: r.name },
        recipient_type: type,
        sequence: r.sequence,
        status: r.status,
        locked: !!r.status && r.status.toLowerCase() !== "pending",
      }))

  return {
    description: req.description ?? "",
    content: req.content ?? "",
    notes: req.notes ?? "",
    recipients: mapRecipients("to") as RecipientFormItem[],
    recipients_cc: mapRecipients("cc") as RecipientFormItem[],
    attachments: [] as File[],
  }
}

function getBadgeClass(status?: string) {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    case "revision":
    case "sent":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
    case "rejected":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
    case "pending":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

interface RecipientRepeaterProps {
  form: any
  name: "recipients" | "recipients_cc"
  label: string
}

function RecipientRepeater({ form, name, label }: RecipientRepeaterProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const moveTo = (
    arrayField: any,
    items: RecipientFormItem[],
    from: number,
    to: number
  ) => {
    if (
      from < 0 ||
      from >= items.length ||
      to < 0 ||
      to >= items.length ||
      items[from]?.locked ||
      items[to]?.locked
    )
      return
    arrayField.swapValues(from, to)
  }

  const moveUp = (
    arrayField: any,
    items: RecipientFormItem[],
    index: number
  ) => {
    for (let i = index - 1; i >= 0; i--) {
      if (!items[i]?.locked) {
        moveTo(arrayField, items, index, i)
        return
      }
    }
  }

  const moveDown = (
    arrayField: any,
    items: RecipientFormItem[],
    index: number
  ) => {
    for (let i = index + 1; i < items.length; i++) {
      if (!items[i]?.locked) {
        moveTo(arrayField, items, index, i)
        return
      }
    }
  }

  return (
    <form.Field name={name} mode="array">
      {(arrayField: any) => {
        const items = (arrayField.state.value || []) as RecipientFormItem[]
        const errors = arrayField.state.meta.errors
        const isTouched = arrayField.state.meta.isTouched
        const showError = isTouched && errors.length > 0

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{label}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() =>
                  arrayField.pushValue(
                    emptyItem(name === "recipients" ? "to" : "cc")
                  )
                }
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah
              </Button>
            </div>

            {showError && (
              <p className="text-sm font-medium text-destructive">
                {errors
                  .map((err: { message?: string } | string) =>
                    typeof err === "string" ? err : err?.message
                  )
                  .join(", ")}
              </p>
            )}

            {items.length === 0 && (
              <div className="rounded-md border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                Belum ada {label.toLowerCase()}
              </div>
            )}

            {items.map((item, index) => (
              <div
                key={index}
                draggable={!item.locked}
                onDragStart={() => {
                  if (!item.locked) setDraggedIndex(index)
                }}
                onDragEnd={() => setDraggedIndex(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedIndex !== null && draggedIndex !== index) {
                    moveTo(arrayField, items, draggedIndex, index)
                  }
                  setDraggedIndex(null)
                }}
                className={`flex items-center gap-2 rounded-md border p-2.5 transition-colors ${
                  item.locked ? "bg-muted/40 opacity-80" : "border-border"
                } ${draggedIndex === index ? "opacity-50" : ""}`}
              >
                <button
                  type="button"
                  disabled={item.locked}
                  className={`${item.locked ? "cursor-not-allowed text-muted-foreground/50" : "cursor-grab active:cursor-grabbing"}`}
                >
                  {item.locked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1">
                  {item.locked ? (
                    <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm">
                      {item.user_id.label || "-"}
                    </div>
                  ) : (
                    <form.Field name={`${name}.${index}.user_id`}>
                      {(field: any) => {
                        const fieldErrors = field.state.meta.errors
                        const showFieldError =
                          field.state.meta.isTouched && fieldErrors.length > 0
                        return (
                          <StaffCombobox
                            value={field.state.value}
                            onChange={field.handleChange}
                            onBlur={field.handleBlur}
                            invalid={showFieldError}
                            error={
                              showFieldError
                                ? String(fieldErrors?.[0]?.message ?? "")
                                : undefined
                            }
                          />
                        )
                      }}
                    </form.Field>
                  )}
                </div>

                {item.locked && item.status && (
                  <Badge
                    variant="outline"
                    className={`px-1.5 py-0 text-[10px] capitalize ${getBadgeClass(item.status)}`}
                  >
                    {item.status}
                  </Badge>
                )}

                {!item.locked && (
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveUp(arrayField, items, index)}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveDown(arrayField, items, index)}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }}
    </form.Field>
  )
}

function RouteComponent() {
  const { mailId } = Route.useParams()
  const navigate = useNavigate()
  const { data: user } = useUser()
  const confirm = useConfirm()
  const filesRef = useRef<File[]>([])

  const { data: mailResponse, isLoading } = useMailDetail(mailId)
  const mail = mailResponse?.success ? mailResponse.data : undefined

  const [existingAttachments, setExistingAttachments] = useState<
    Array<{ id: string; name: string; url: string }>
  >([])
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<string[]>([])

  useEffect(() => {
    if (mail?.attachments) {
      setExistingAttachments(
        mail.attachments.map((a: any) => ({
          id: String(a.id),
          name: a.file_name,
          url: a.file_url,
        }))
      )
    }
  }, [mail])

  const form = useAppForm({
    defaultValues: mail ? getDefaultValues(mail) : undefined,
    validators: {
      onSubmit: composeNonTemplateSchema as any,
    },
    canSubmitWhenInvalid: true,
    onSubmitInvalid: ({ formApi }) => {
      const errors = getFormFieldErrors(formApi)
      if (errors.length > 0) {
        toast.error(
          `Form tidak valid: ${errors
            .map((e) => `${e.label}: ${e.message}`)
            .join("; ")}`
        )
      }
    },
    onSubmit: async ({ value }) => {
      const confirmed = await confirm({
        title: "Konfirmasi Update Mail",
        description: "Apakah Anda yakin ingin menyimpan perubahan mail ini?",
      })
      if (!confirmed) return

      try {
        const formData = new FormData()
        formData.append("id", mailId)
        formData.append("request_type", "non_template")
        formData.append("user_id", user.id)
        if (value.notes) formData.append("notes", value.notes)

        formData.append("non_template_data[description]", value.description)
        formData.append("non_template_data[content]", value.content)

        const allRecipients = [
          ...value.recipients.map((r, i) => ({
            user_id: r.user_id.value,
            recipient_type: "to" as const,
            sequence: i + 1,
          })),
          ...value.recipients_cc.map((r, i) => ({
            user_id: r.user_id.value,
            recipient_type: "cc" as const,
            sequence: value.recipients.length + i + 1,
          })),
        ]
        allRecipients.forEach((r, idx) => {
          formData.append(
            `non_template_data[recipients][${idx}][user_id]`,
            r.user_id
          )
          formData.append(
            `non_template_data[recipients][${idx}][recipient_type]`,
            r.recipient_type
          )
          formData.append(
            `non_template_data[recipients][${idx}][sequence]`,
            String(r.sequence)
          )
        })

        const keepAttachmentIds = existingAttachments
          .filter((a) => !deletedAttachmentIds.includes(a.id))
          .map((a) => a.id)
        keepAttachmentIds.forEach((id, index) => {
          formData.append(`keep_attachment_ids[${index}]`, id)
        })
        if (filesRef.current && filesRef.current.length > 0) {
          filesRef.current.forEach((file) => {
            formData.append("attachments[]", file)
          })
        }

        const result = await updateUserMail({ data: formData })
        if (!result.success) {
          toast.error(result.error || "Gagal update mail")
          if (result.details) {
            const detailMessages = Object.entries(result.details)
              .map(
                ([field, errors]: [string, any]) =>
                  `${field}: ${errors.join(", ")}`
              )
              .join("\n")
            toast.error(`Detail errors:\n${detailMessages}`)
          }
          return
        }

        toast.success("Mail berhasil diupdate")
        navigate({ to: "/mail/user-mails" })
      } catch (error) {
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
  const fieldErrors = useFormFieldErrors(form)

  if (isLoading || !mail) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          Memuat data mail...
        </div>
      </div>
    )
  }

  const isEditable = ["draft", "revision"].includes(mail.status.toLowerCase())

  if (!isEditable) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/mail/user-mails" })}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Hanya mail dengan status <strong>Draft</strong> atau{" "}
            <strong>Revisi</strong> yang dapat diedit.
          </CardContent>
        </Card>
      </div>
    )
  }

  const superiorRecipients = (mail.recipients || [])
    .filter((r) => r.recipient_type === "superior")
    .sort((a, b) => a.sequence - b.sequence)

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

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Edit surat non-template</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {mail.document_number}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mail.sent_by.department} • Draft / Revisi
            </p>
          </div>
          {isDirty && (
            <Badge
              variant="outline"
              className="shrink-0 border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            >
              Belum disimpan
            </Badge>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            {existingAttachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lampiran Saat Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informasi Surat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form.AppField name="description">
                  {(field: any) => <field.TextField label="Subject" required />}
                </form.AppField>

                <form.AppField name="content">
                  {(field: any) => (
                    <field.RichTextEditorField label="Isi Surat" required />
                  )}
                </form.AppField>

                <form.AppField name="notes">
                  {(field: any) => (
                    <field.TextareaField
                      label="Catatan (Opsional)"
                      placeholder="Tambahkan catatan jika diperlukan..."
                      rows={3}
                    />
                  )}
                </form.AppField>

                <form.Field name="attachments">
                  {(field: any) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Lampiran Baru
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          field.handleChange(files)
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  )}
                </form.Field>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">Penerima</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RecipientRepeater
                  form={form}
                  name="recipients"
                  label="Kepada (To)"
                />

                <hr className="border-border" />

                <RecipientRepeater
                  form={form}
                  name="recipients_cc"
                  label="Tembusan (CC)"
                />

                {superiorRecipients.length > 0 && (
                  <>
                    <hr className="border-border" />
                    <div className="space-y-2">
                      <span className="text-sm font-medium">
                        Diketahui ({superiorRecipients.length})
                      </span>
                      <div className="space-y-2">
                        {superiorRecipients.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex items-center justify-between rounded-md border border-border bg-muted/40 p-2.5"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-sm font-medium">
                                  {rec.name}
                                </span>
                                <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {rec.position ?? "-"} • {rec.department ?? "-"}
                              </div>
                            </div>
                            {rec.status && (
                              <Badge
                                variant="outline"
                                className={`px-1.5 py-0 text-[10px] capitalize ${getBadgeClass(rec.status)}`}
                              >
                                {rec.status}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Diketahui otomatis (read-only)
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <ErrorSummaryCard errors={fieldErrors} />

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

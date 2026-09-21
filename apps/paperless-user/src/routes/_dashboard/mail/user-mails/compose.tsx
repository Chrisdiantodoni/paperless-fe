import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAppForm } from "@workspace/forms/src/forms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { FileInput } from "@workspace/ui/components/ui/file-input"
import { toast } from "sonner"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { handleApiError } from "@/lib/handle-api-error"
import {
  composeNonTemplateSchema,
} from "@/schema/mail/compose-non-template.schema"
import type { ComposeNonTemplateForm } from "@/schema/mail/compose-non-template.schema"
import { SortableList } from "@workspace/ui/components/ui/sortable-list"
import { StaffCombobox } from "@/components/select/select-staff"
import { ArrowLeft, GripVertical, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { createUserMailNonTemplate } from "@/server/mails"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { useStore } from "@tanstack/react-form"
import { ErrorSummaryCard } from "@/components/create/sections/ErrorSummaryCard"
import { getFormFieldErrors, useFormFieldErrors } from "@/hooks/use-form-errors"

export const Route = createFileRoute("/_dashboard/mail/user-mails/compose")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [reorderAnnouncement, setReorderAnnouncement] = useState("")

  const form = useAppForm({
    defaultValues: {
      description: "",
      content: "",
      recipients: [] as ComposeNonTemplateForm["recipients"],
      recipients_cc: [] as ComposeNonTemplateForm["recipients_cc"],
      notes: "",
      attachments: [] as File[],
    },
    validators: {
      onChange: composeNonTemplateSchema,
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
        title: "Kirim memo internal?",
        description: "Pastikan penerima dan isi surat sudah benar.",
      })

      if (confirmed) {
        try {
          const allRecipients = [
            ...value.recipients.map((r, i) => ({
              user_id: r.user_id.value,
              recipient_type: "to",
              sequence: i + 1,
            })),
            ...value.recipients_cc.map((r, i) => ({
              user_id: r.user_id.value,
              recipient_type: "cc",
              sequence: value.recipients.length + i + 1,
            })),
          ]

          const formData = new FormData()
          formData.append("description", value.description)
          formData.append("content", value.content)
          formData.append("notes", value.notes || "")

          allRecipients.forEach((r, idx) => {
            formData.append(`recipients[${idx}][user_id]`, r.user_id)
            formData.append(
              `recipients[${idx}][recipient_type]`,
              r.recipient_type
            )
            formData.append(`recipients[${idx}][sequence]`, String(r.sequence))
          })

          value.attachments.forEach((file) => {
            formData.append("attachments[]", file)
          })

          const result = await createUserMailNonTemplate({ data: formData })
          if (!result.success) {
            toast.error(result.error || "Gagal membuat mail")

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
          toast.success("Surat berhasil dikirim")
          navigate({ to: "/mail/user-mails" })
        } catch (error) {
          handleApiError(error)
        }
      }
    },
  })

  const isDirty = useStore(form.store, (state) => state.isDirty)
  const { confirmNavigation } = useUnsavedChanges({
    isDirty,
    message:
      "Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?",
  })
  const fieldErrors = useFormFieldErrors(form)

  const moveRecipient = (
    fieldName: "recipients" | "recipients_cc",
    fromIndex: number,
    toIndex: number
  ) => {
    const items = form.getFieldValue(fieldName)
    if (
      fromIndex < 0 ||
      fromIndex >= items.length ||
      toIndex < 0 ||
      toIndex >= items.length
    )
      return
    const newItems = [...items]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    form.setFieldValue(fieldName, newItems)
    const recipient =
      newItems[toIndex]?.user_id.label || `Penerima ${toIndex + 1}`
    setReorderAnnouncement(
      `${recipient} dipindahkan ke urutan ${toIndex + 1} pada ${fieldName === "recipients" ? "Kepada" : "Tembusan"}.`
    )
  }

  return (
    <PageWrapper className="space-y-6">
      <PageHeader
        title="Buat Surat Non-Template"
        description="Buat surat tanpa menggunakan template"
        actions={
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                confirmNavigation(() => navigate({ to: "/mail/user-mails" }))
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {isDirty && (
              <Badge
                variant="outline"
                className="border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              >
                Belum disimpan
              </Badge>
            )}
          </div>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Surat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form.AppField name="description">
                  {(field: any) => <field.TextField label="Subject" required />}
                </form.AppField>

                <form.AppField name="content">
                  {(field: any) => (
                    <field.RichTextEditorField
                      label="Isi Surat"
                      required
                      format="html"
                    />
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
                    <FileInput
                      label="Lampiran"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Array.from(e.target.files || []))
                      }
                    />
                  )}
                </form.Field>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>Penerima</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Kepada (To)
                  </label>
                  <form.Field name="recipients" mode="array">
                    {(arrayField: any) => {
                      const recipients = arrayField.state.value
                      return (
                        <SortableList
                          items={recipients}
                          getId={(item: any) =>
                            `compose-recipient-${item.user_id.value}`
                          }
                          onReorder={(items) => arrayField.handleChange(items)}
                          renderItem={(item, state) => {
                            const index = recipients.indexOf(item)
                            return (
                              <div
                                ref={state.ref}
                                className={`flex items-center gap-2 rounded-md border p-2 ${state.isDragging ? "opacity-50" : ""}`}
                              >
                                <button
                                  type="button"
                                  className="cursor-grab active:cursor-grabbing"
                                  aria-label={`Seret penerima Kepada ${index + 1} untuk mengubah urutan`}
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <div className="flex-1">
                                  <form.Field
                                    name={`recipients[${index}].user_id`}
                                  >
                                    {(field: any) => {
                                      const errors = field.state.meta.errors
                                      const showError =
                                        field.state.meta.isTouched &&
                                        errors.length > 0
                                      return (
                                        <StaffCombobox
                                          value={field.state.value}
                                          onChange={field.handleChange}
                                          onBlur={field.handleBlur}
                                          invalid={showError}
                                          error={
                                            showError
                                              ? String(
                                                  errors?.[0]?.message ?? ""
                                                )
                                              : undefined
                                          }
                                        />
                                      )
                                    }}
                                  </form.Field>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    disabled={index === 0}
                                    aria-label={`Pindahkan penerima Kepada ${index + 1} ke atas`}
                                    onClick={() =>
                                      moveRecipient(
                                        "recipients",
                                        index,
                                        index - 1
                                      )
                                    }
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    disabled={index === recipients.length - 1}
                                    aria-label={`Pindahkan penerima Kepada ${index + 1} ke bawah`}
                                    onClick={() =>
                                      moveRecipient(
                                        "recipients",
                                        index,
                                        index + 1
                                      )
                                    }
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )
                          }}
                        />
                      )
                    }}
                  </form.Field>
                </div>

                <hr className="border-border" />

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Tembusan (CC)
                  </label>
                  <form.Field name="recipients_cc" mode="array">
                    {(arrayField: any) => {
                      const recipients = arrayField.state.value
                      return (
                        <SortableList
                          items={recipients}
                          getId={(item: any) =>
                            `compose-cc-recipient-${item.user_id.value}`
                          }
                          onReorder={(items) => arrayField.handleChange(items)}
                          renderItem={(item, state) => {
                            const index = recipients.indexOf(item)
                            return (
                              <div
                                ref={state.ref}
                                className={`flex items-center gap-2 rounded-md border p-2 ${state.isDragging ? "opacity-50" : ""}`}
                              >
                                <button
                                  type="button"
                                  className="cursor-grab active:cursor-grabbing"
                                  aria-label={`Seret penerima Tembusan ${index + 1} untuk mengubah urutan`}
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <div className="flex-1">
                                  <form.Field
                                    name={`recipients_cc[${index}].user_id`}
                                  >
                                    {(field: any) => {
                                      const errors = field.state.meta.errors
                                      const showError =
                                        field.state.meta.isTouched &&
                                        errors.length > 0
                                      return (
                                        <StaffCombobox
                                          value={field.state.value}
                                          onChange={field.handleChange}
                                          onBlur={field.handleBlur}
                                          invalid={showError}
                                          error={
                                            showError
                                              ? String(
                                                  errors?.[0]?.message ?? ""
                                                )
                                              : undefined
                                          }
                                        />
                                      )
                                    }}
                                  </form.Field>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    disabled={index === 0}
                                    aria-label={`Pindahkan penerima Tembusan ${index + 1} ke atas`}
                                    onClick={() =>
                                      moveRecipient(
                                        "recipients_cc",
                                        index,
                                        index - 1
                                      )
                                    }
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    disabled={index === recipients.length - 1}
                                    aria-label={`Pindahkan penerima Tembusan ${index + 1} ke bawah`}
                                    onClick={() =>
                                      moveRecipient(
                                        "recipients_cc",
                                        index,
                                        index + 1
                                      )
                                    }
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )
                          }}
                        />
                      )
                    }}
                  </form.Field>
                </div>
              </CardContent>
            </Card>
            <p className="sr-only" aria-live="polite">
              {reorderAnnouncement}
            </p>
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
                <form.SubmitButton label="Kirim Surat" />
              </form.AppForm>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageWrapper>
  )
}

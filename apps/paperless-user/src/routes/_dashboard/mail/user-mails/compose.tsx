import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAppForm } from "@workspace/forms/src/forms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { toast } from "sonner"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { handleApiError } from "@/lib/handle-api-error"
import mailService from "@/services/API/mail"
import {
  emptyRecipient,
  emptyCcRecipient,
  composeNonTemplateSchema,
} from "@/schema/mail/compose-non-template.schema"
import type { ComposeNonTemplateForm } from "@/schema/mail/compose-non-template.schema"
import { Repeater } from "@workspace/forms/src/fields"
import { StaffCombobox } from "@/components/select/select-staff"
import { ArrowLeft, GripVertical, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"
import { createUserMailNonTemplate } from "@/server/mails"

export const Route = createFileRoute("/_dashboard/mail/user-mails/compose")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

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
      onSubmit: composeNonTemplateSchema,
    },
    canSubmitWhenInvalid: true,
    onSubmit: async ({ value }) => {
      const confirmed = await confirm({
        title: "Kirim surat non-template?",
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
            console.error("❌ Create mail failed:", result)

            toast.error(result.error || "Gagal membuat mail")

            if (result.details) {
              console.error("Validation errors:", result.details)
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
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (
    fieldName: "recipients" | "recipients_cc",
    dropIndex: number
  ) => {
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveRecipient(fieldName, draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/mail/user-mails" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Buat Surat Non-Template</h1>
          <p className="text-sm text-muted-foreground">
            Buat surat tanpa menggunakan template
          </p>
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
                      <label className="text-sm font-medium">Lampiran</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          field.handleChange(files)
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                <CardTitle>Penerima</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Kepada (To)
                  </label>
                  <Repeater
                    form={form}
                    name="recipients"
                    label="Penerima"
                    defaultItem={() => ({ ...emptyRecipient })}
                    renderItem={(index) => {
                      const recipients = form.getFieldValue("recipients")
                      return (
                        <div
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop("recipients", index)}
                          className={`flex items-center gap-2 rounded-md border p-2 ${draggedIndex === index ? "opacity-50" : ""}`}
                        >
                          <button
                            type="button"
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <div className="flex-1">
                            <form.Field name={`recipients.${index}.user_id`}>
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
                                        ? String(errors?.[0]?.message ?? "")
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
                              onClick={() =>
                                moveRecipient("recipients", index, index - 1)
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
                              onClick={() =>
                                moveRecipient("recipients", index, index + 1)
                              }
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    }}
                  />
                </div>

                <hr className="border-border" />

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Tembusan (CC)
                  </label>
                  <Repeater
                    form={form}
                    name="recipients_cc"
                    label="Tembusan"
                    defaultItem={() => ({ ...emptyCcRecipient })}
                    renderItem={(index) => {
                      const recipients_cc = form.getFieldValue("recipients_cc")
                      return (
                        <div
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop("recipients_cc", index)}
                          className={`flex items-center gap-2 rounded-md border p-2 ${draggedIndex === index ? "opacity-50" : ""}`}
                        >
                          <button
                            type="button"
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <div className="flex-1">
                            <form.Field name={`recipients_cc.${index}.user_id`}>
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
                                        ? String(errors?.[0]?.message ?? "")
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
                              onClick={() =>
                                moveRecipient("recipients_cc", index, index - 1)
                              }
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={index === recipients_cc.length - 1}
                              onClick={() =>
                                moveRecipient("recipients_cc", index, index + 1)
                              }
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/mail/user-mails" })}
          >
            Batal
          </Button>
          <Button type="submit">Kirim Surat</Button>
        </div>
      </form>
    </div>
  )
}

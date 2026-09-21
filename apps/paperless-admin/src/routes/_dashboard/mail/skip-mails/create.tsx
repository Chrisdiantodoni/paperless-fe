import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAppForm } from "@workspace/forms/src/forms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { StaffCombobox } from "@/components/select/select-staff"

import { Search, RotateCcw, ArrowLeft } from "lucide-react"
import { useState } from "react"
import type { StaffSelectValue } from "@/components/select/select-staff"
import { Button } from "@workspace/ui/components/ui/button"
import { createSkipMailSchema } from "@/schema/mail/schema"
import { format } from "date-fns"
import { useCreateSkipMail } from "@/hooks/queries/use-skip-mail"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { toast } from "sonner"

export const Route = createFileRoute("/_dashboard/mail/skip-mails/create")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [selectedStaff, setSelectedStaff] = useState<StaffSelectValue | null>(
    null
  )
  const handleReset = () => {
    setSelectedStaff(null)
    form.reset()
  }

  const createSkipMail = useCreateSkipMail()

  const form = useAppForm({
    defaultValues: {
      date_from: "",
      date_to: "",
      reason: "",
      skipper_id: "",
    },
    validators: {
      onChange: createSkipMailSchema,
    },
    canSubmitWhenInvalid: true,
    onSubmit: async ({ value }) => {
      await confirm({
        title: "Simpan template email?",
        description: "Pastikan data yang dimasukkan sudah benar.",
        confirmLabel: "Simpan",
        onConfirm: async () => {
          try {
            const payload = {
              ...value,
              date_from: format(value.date_from, "yyyy-MM-dd"),
              date_to: format(value.date_to, "yyyy-MM-dd"),
            }
            const res = await createSkipMail.mutateAsync(payload)
            console.log(res)
            toast.success("Skip Mail berhasil dibuat")
            navigate({
              to: "/mail/skip-mails/$id/detail",
              params: { id: res.id },
            })
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Gagal menyimpan template email"
            )
            throw error
          }
        },
      })
    },
  })

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Kembali ke list skip mail"
          onClick={() =>
            navigate({
              to: "/mail/skip-mails",
              search: {
                page: 1,
                search: "",
                per_page: 10,
              },
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buat Skip Mail</h1>
          <p className="text-sm text-muted-foreground">
            Buat skip mail untuk melewati approver yang dipilih.
          </p>
        </div>
      </div>

      <Card className="shadow-xs">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="text-base font-semibold">Cari Mail</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Field Staf */}
              <form.Field name="skipper_id">
                {(field: any) => {
                  const errors = field.state.meta.errors
                  const showError =
                    field.state.meta.isTouched && errors.length > 0
                  return (
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="staff-select">
                        Nama Staff
                        <span className="text-destructive"> *</span>
                      </Label>
                      <StaffCombobox
                        value={field.state.value}
                        onChange={(staff) => {
                          setSelectedStaff(
                            "staff" in staff && staff.value ? staff : null
                          )
                          field.handleChange(staff.value)
                        }}
                        onBlur={field.handleBlur}
                        invalid={showError}
                        error={
                          showError
                            ? String(errors?.[0]?.message ?? "")
                            : undefined
                        }
                      />
                      {selectedStaff && (
                        <div className="grid grid-cols-2 gap-2 rounded-md border bg-muted/20 p-3 text-sm">
                          <span>NIP</span>
                          <span className="font-medium">
                            {selectedStaff.staff.nip || "-"}
                          </span>
                          <span>Jabatan</span>
                          <span className="font-medium">
                            {selectedStaff.staff.employment_data?.position
                              ?.name || "-"}
                          </span>
                          <span>Bagian</span>
                          <span className="font-medium">
                            {selectedStaff.staff.employment_data?.department
                              ?.name || "-"}
                          </span>
                          <span>Cabang</span>
                          <span className="font-medium">
                            {selectedStaff.staff.employment_data?.branch
                              ?.name || "-"}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                }}
              </form.Field>

              {/* Field Tanggal Dari */}
              <form.AppField name="date_from">
                {(field) => (
                  <field.DatePickerField
                    required
                    {...field}
                    label="Dari Tanggal"
                  />
                )}
              </form.AppField>

              {/* Field Tanggal Sampai */}
              <form.AppField name="date_to">
                {(field) => (
                  <field.DatePickerField
                    required
                    {...field}
                    label="Sampai Tanggal"
                  />
                )}
              </form.AppField>
            </div>

            {/* Field Alasan */}
            <div className="w-full">
              <form.AppField
                name="reason"
                validators={{
                  onBlur: ({ value }) =>
                    value.trim() ? undefined : "Alasan wajib diisi",
                }}
              >
                {(field) => (
                  <field.TextareaField
                    {...field}
                    label="Alasan"
                    required
                    placeholder="Masukkan alasan..."
                    rows={2}
                  />
                )}
              </form.AppField>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>

              <form.AppForm>
                <div className="relative flex items-center">
                  <form.SubmitButton type="submit" label="Simpan" />
                </div>
              </form.AppForm>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

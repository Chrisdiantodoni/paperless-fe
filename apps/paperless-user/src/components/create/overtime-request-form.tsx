import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker"
import { TimePicker } from "@workspace/ui/components/ui/time-picker"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Label } from "@workspace/ui/components/ui/label"
import { Button } from "@workspace/ui/components/ui/button"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { StaffCombobox } from "../select/select-staff"
import { Plus, Trash2 } from "lucide-react"
import type { SelectValue } from "@workspace/types"
import { useUser } from "@/hooks/queries/use-user"
import { useStore } from "@tanstack/react-form"

interface OvertimeRequestFormProps {
  form: any
}

export function OvertimeRequestForm({ form }: OvertimeRequestFormProps) {
  const detailsLength = useStore(
    form.store,
    (state: any) => state.values.overtime_data?.details?.length || 0
  )

  const { data: user } = useUser()

  const handleAddDetail = () => {
    const current = form.getFieldValue("overtime_data.details") || []
    form.setFieldValue("overtime_data.details", [
      ...current,
      {
        user_id: user.id ? String(user.id) : "",
        date: "",
        start_time: "",
        end_time: "",
        reason: "",
      },
    ])
  }

  return (
    <FieldGroup className="gap-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Detail Lembur</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddDetail}
          >
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        </div>

        {Array.from({ length: detailsLength }).map((_, idx) => (
          <div key={idx} className="relative space-y-3 rounded-lg border p-4">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => {
                const current =
                  form.getFieldValue("overtime_data.details") || []
                form.setFieldValue(
                  "overtime_data.details",
                  current.filter((_item: any, i: number) => i !== idx)
                )
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <form.Field name={`overtime_data.details[${idx}].user_id`}>
              {(field: any) => {
                const errors = field.state.meta.errors
                const showError =
                  field.state.meta.isTouched && errors.length > 0
                return (
                  <div className="flex w-full flex-col space-y-1.5">
                    <Label required>Staff</Label>
                    <StaffCombobox
                      value={field.state.value || ""}
                      onChange={(val: SelectValue) =>
                        field.handleChange(val.value)
                      }
                      onBlur={field.handleBlur}
                      invalid={showError}
                      error={showError ? (errors[0]?.message ?? "") : undefined}
                    />
                  </div>
                )
              }}
            </form.Field>

            <form.Field name={`overtime_data.details[${idx}].date`}>
              {(field: any) => {
                const errors = field.state.meta.errors
                const showError =
                  field.state.meta.isTouched && errors.length > 0
                return (
                  <DateTimePicker
                    mode="date"
                    label="Tanggal"
                    value={field.state.value || ""}
                    onChange={(value) => {
                      if (value) {
                        field.handleChange(`${value}T00:00:00.000Z`)
                      } else {
                        field.handleChange("")
                      }
                    }}
                    onBlur={field.handleBlur}
                    invalid={showError}
                    error={showError ? (errors[0]?.message ?? "") : undefined}
                    required
                  />
                )
              }}
            </form.Field>

            <div className="grid grid-cols-2 gap-3">
              <form.Field name={`overtime_data.details[${idx}].start_time`}>
                {(field: any) => {
                  const errors = field.state.meta.errors
                  const showError =
                    field.state.meta.isTouched && errors.length > 0
                  return (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-medium">
                        Jam Mulai <span className="text-destructive">*</span>
                      </label>
                      <TimePicker
                        value={field.state.value || ""}
                        onChange={(value) => field.handleChange(value)}
                        invalid={showError}
                        disabled={false}
                      />
                      {showError && (
                        <p className="text-sm text-destructive">
                          {errors[0]?.message ?? ""}
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>

              <form.Field name={`overtime_data.details[${idx}].end_time`}>
                {(field: any) => {
                  const errors = field.state.meta.errors
                  const showError =
                    field.state.meta.isTouched && errors.length > 0
                  return (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-medium">
                        Jam Selesai <span className="text-destructive">*</span>
                      </label>
                      <TimePicker
                        value={field.state.value || ""}
                        onChange={(value) => field.handleChange(value)}
                        invalid={showError}
                        disabled={false}
                      />
                      {showError && (
                        <p className="text-sm text-destructive">
                          {errors[0]?.message ?? ""}
                        </p>
                      )}
                    </div>
                  )
                }}
              </form.Field>
            </div>

            <form.Field name={`overtime_data.details[${idx}].reason`}>
              {(field: any) => {
                const errors = field.state.meta.errors
                const showError =
                  field.state.meta.isTouched && errors.length > 0
                return (
                  <div className="flex w-full flex-col space-y-1.5">
                    <Label required>Alasan</Label>
                    <Textarea
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      invalid={showError}
                      error={showError ? (errors[0]?.message ?? "") : undefined}
                      maxLength={1000}
                      placeholder="Alasan lembur..."
                      rows={2}
                    />
                  </div>
                )
              }}
            </form.Field>
          </div>
        ))}
      </div>

      <form.Field name="overtime_data.reason">
        {(field: any) => {
          const errors = field.state.meta.errors
          const showError = field.state.meta.isTouched && errors.length > 0
          return (
            <div className="flex w-full flex-col space-y-1.5">
              <Label required>Alasan Umum</Label>
              <Textarea
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? errors[0]?.message ?? "" : undefined}
                maxLength={1000}
                placeholder="Jelaskan alasan lembur secara umum..."
                rows={3}
              />
            </div>
          )
        }}
      </form.Field>
    </FieldGroup>
  )
}

import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Label } from "@workspace/ui/components/ui/label"
import { FieldGroup } from "@workspace/ui/components/ui/field"

interface LeaveRequestFormProps {
  form: any
}

export function LeaveRequestForm({ form }: LeaveRequestFormProps) {

  return (
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup className="col-span-2 grid grid-cols-2 gap-4">
        <form.Field name="leave_data.start_date">
          {(field: any) => {
            const errors = field.state.meta.errors
            const showError = field.state.meta.isTouched && errors.length > 0
            return (
              <DateTimePicker
                mode="date"
                label="Tanggal Mulai"
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
                error={showError ? errors[0]?.message ?? "" : undefined}
                required
              />
            )
          }}
        </form.Field>

        <form.Field name="leave_data.end_date">
          {(field: any) => {
            const errors = field.state.meta.errors
            const showError = field.state.meta.isTouched && errors.length > 0
            return (
              <DateTimePicker
                mode="date"
                label="Tanggal Selesai"
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
                error={showError ? errors[0]?.message ?? "" : undefined}
                required
              />
            )
          }}
        </form.Field>
      </FieldGroup>

      <form.Field name="leave_data.days_taken">
        {(field: any) => {
          const errors = field.state.meta.errors
          const showError = field.state.meta.isTouched && errors.length > 0
          return (
            <div className="flex w-full flex-col space-y-1.5">
              <Label required>Jumlah Hari</Label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? errors[0]?.message ?? "" : undefined}
                placeholder="Contoh: 1 atau 0.5"
              />
            </div>
          )
        }}
      </form.Field>

      <form.Field name="leave_data.leave_type">
        {(field: any) => {
          const errors = field.state.meta.errors
          const showError = field.state.meta.isTouched && errors.length > 0
          return (
            <div className="flex w-full flex-col space-y-1.5">
              <Label required>Jenis Cuti</Label>
              <Input
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? errors[0]?.message ?? "" : undefined}
                placeholder="Cuti Tahunan, Cuti Sakit, dll"
              />
            </div>
          )
        }}
      </form.Field>

      <form.Field name="leave_data.reason">
        {(field: any) => {
          const errors = field.state.meta.errors
          const showError = field.state.meta.isTouched && errors.length > 0
          const charCount = field.state.value?.length || 0
          const maxChars = 1000
          return (
            <div className="col-span-2 flex w-full flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <Label required>Alasan</Label>
                <span className="text-xs text-muted-foreground">
                  {charCount}/{maxChars}
                </span>
              </div>
              <Textarea
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? errors[0]?.message ?? "" : undefined}
                maxLength={maxChars}
                placeholder="Jelaskan alasan cuti..."
                rows={4}
              />
            </div>
          )
        }}
      </form.Field>
    </div>
  )
}

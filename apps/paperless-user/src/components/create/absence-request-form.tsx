import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Label } from "@workspace/ui/components/ui/label"
import { FieldGroup } from "@workspace/ui/components/ui/field"

interface AbsenceRequestFormProps {
  form: any
}

export function AbsenceRequestForm({ form }: AbsenceRequestFormProps) {
  return (
    <FieldGroup className="gap-4">
      <div className="grid grid-cols-2 gap-x-2">
        <form.Field name="absence_data.start_date">
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

        <form.Field name="absence_data.end_date">
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
      </div>

      <form.Field name="absence_data.reason">
        {(field: any) => {
          const errors = field.state.meta.errors
          const showError = field.state.meta.isTouched && errors.length > 0
          return (
            <div className="flex w-full flex-col space-y-1.5">
              <Label required>Alasan</Label>
              <Textarea
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? errors[0]?.message ?? "" : undefined}
                maxLength={1000}
                placeholder="Jelaskan alasan ketidakhadiran..."
                rows={4}
              />
            </div>
          )
        }}
      </form.Field>
    </FieldGroup>
  )
}

import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker"
import { TimePicker } from "@workspace/ui/components/ui/time-picker"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Label } from "@workspace/ui/components/ui/label"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

interface PermitRequestFormProps {
  form: any
}

const PERMIT_TYPES = [
  "Terlambat Masuk Kantor",
  "Keluar Kantor pada Jam Kerja",
  "Pulang Lebih Awal",
] as const

type PermitType = (typeof PERMIT_TYPES)[number]

function TimePickerField({
  field,
  label,
  required = false,
}: {
  field: any
  label: string
  required?: boolean
}) {
  const errors = field.state.meta.errors
  const showError = field.state.meta.isTouched && errors.length > 0

  return (
    <div className="flex flex-col space-y-1.5">
      <Label required={required}>{label}</Label>
      <TimePicker
        value={field.state.value || ""}
        onChange={(value) => field.handleChange(value)}
        invalid={showError}
      />
      {showError && (
        <p className="text-sm text-destructive">{errors[0]?.message ?? ""}</p>
      )}
    </div>
  )
}

export function PermitRequestForm({ form }: PermitRequestFormProps) {
  return (
    <FieldGroup className="flex flex-col gap-4">
      {/* Baris 1: Tanggal & Jenis Izin berdampingan (responsif 1 col di mobile, 2 col di desktop) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="permit_data.date">
          {(field: any) => {
            const errors = field.state.meta.errors
            const showError = field.state.meta.isTouched && errors.length > 0
            return (
              <DateTimePicker
                mode="date"
                label="Tanggal"
                value={field.state.value || ""}
                onChange={(value) => {
                  field.handleChange(value ? `${value}T00:00:00.000Z` : "")
                }}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? (errors[0]?.message ?? "") : undefined}
                required
              />
            )
          }}
        </form.Field>

        <form.Field name="permit_data.permit_type">
          {(field: any) => {
            const errors = field.state.meta.errors
            const showError = field.state.meta.isTouched && errors.length > 0
            return (
              <div className="flex w-full flex-col space-y-1.5">
                <Label required>Jenis Izin</Label>
                <Select
                  value={field.state.value || ""}
                  onValueChange={(val) => {
                    field.handleChange(val)
                    // Reset jam lain agar payload bersih
                    form.setFieldValue("permit_data.start_work_at", null)
                    form.setFieldValue("permit_data.exit_time", null)
                    form.setFieldValue("permit_data.return_time", null)
                    form.setFieldValue("permit_data.end_work_at", null)
                  }}
                >
                  <SelectTrigger invalid={showError} className="w-full">
                    <SelectValue placeholder="Pilih jenis izin" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERMIT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      {/* Baris 2: Field Jam Dinamis berdasarkan permit_type */}
      <form.Subscribe
        selector={(state: any) => state.values?.permit_data?.permit_type}
      >
        {(permitType: PermitType) => {
          if (!permitType) return null

          return (
            <div className="rounded-lg border bg-muted/20 p-4">
              {permitType === "Terlambat Masuk Kantor" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="permit_data.start_work_at">
                    {(field: any) => (
                      <TimePickerField
                        field={field}
                        label="Jam Masuk Kerja (Aktual)"
                        required
                      />
                    )}
                  </form.Field>
                </div>
              )}

              {permitType === "Keluar Kantor pada Jam Kerja" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="permit_data.exit_time">
                    {(field: any) => (
                      <TimePickerField
                        field={field}
                        label="Jam Keluar"
                        required
                      />
                    )}
                  </form.Field>

                  <form.Field name="permit_data.return_time">
                    {(field: any) => (
                      <TimePickerField
                        field={field}
                        label="Jam Kembali"
                        required
                      />
                    )}
                  </form.Field>
                </div>
              )}

              {permitType === "Pulang Lebih Awal" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="permit_data.end_work_at">
                    {(field: any) => (
                      <TimePickerField
                        field={field}
                        label="Jam Pulang Kerja"
                        required
                      />
                    )}
                  </form.Field>
                </div>
              )}
            </div>
          )
        }}
      </form.Subscribe>

      {/* Baris 3: Alasan */}
      <form.Field name="permit_data.reason">
        {(field: any) => {
          const errors = field.state.meta.errors
          const showError = field.state.meta.isTouched && errors.length > 0
          const charCount = field.state.value?.length || 0
          const maxChars = 1000
          return (
            <div className="flex w-full flex-col space-y-1.5">
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
                error={showError ? (errors[0]?.message ?? "") : undefined}
                maxLength={maxChars}
                placeholder="Tuliskan detail alasan izin Anda..."
                rows={4}
              />
            </div>
          )
        }}
      </form.Field>
    </FieldGroup>
  )
}

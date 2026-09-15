import { useState, useEffect } from "react"
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker"
import { Input } from "@workspace/ui/components/ui/input"
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
import { useUser } from "@/hooks/queries/use-user"

interface LeaveRequestFormProps {
  form: any
}

export function LeaveRequestForm({ form }: LeaveRequestFormProps) {
  const [isOtherType, setIsOtherType] = useState(false)
  const { data } = useUser()

  // Ambil data dengan fallback default
  const leaveQuota = data?.leave_quota ?? 0
  const leaveQuotaTaken = data?.leave_quota_taken ?? 0
  const remainingQuota = leaveQuota - leaveQuotaTaken

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Informational Widget: Kuota Cuti */}
      <div className="col-span-2 flex items-center justify-between rounded-lg border bg-muted/40 p-3 text-sm">
        <div>
          <span className="font-medium">Sisa Kuota Cuti: </span>
          <span
            className={`font-bold ${remainingQuota <= 0 ? "text-destructive" : "text-primary"}`}
          >
            {remainingQuota} Hari
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Terpakai {leaveQuotaTaken} dari {leaveQuota} hari
        </div>
      </div>

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
                  const formattedValue = value ? `${value}T00:00:00.000Z` : ""
                  field.handleChange(formattedValue)
                }}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? (errors[0]?.message ?? "") : undefined}
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
                  const formattedValue = value ? `${value}T00:00:00.000Z` : ""
                  field.handleChange(formattedValue)
                }}
                onBlur={field.handleBlur}
                invalid={showError}
                error={showError ? (errors[0]?.message ?? "") : undefined}
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
                error={showError ? (errors[0]?.message ?? "") : undefined}
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
          const standardTypes = ["Cuti Melahirkan", "Cuti Tahunan"]
          const isCustomType =
            isOtherType ||
            (field.state.value && !standardTypes.includes(field.state.value))
          const selectedType = isCustomType ? "Lainnya" : field.state.value

          return (
            <div className="flex w-full flex-col space-y-1.5">
              <Label required>Jenis Cuti</Label>
              <Select
                value={selectedType || ""}
                onValueChange={(value) => {
                  const isOther = value === "Lainnya"
                  setIsOtherType(isOther)
                  if (!isOther) field.handleChange(value)
                  else field.handleChange("")
                }}
              >
                <SelectTrigger invalid={showError} className="w-full">
                  <SelectValue placeholder="Pilih jenis cuti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cuti Melahirkan">
                    Cuti Melahirkan
                  </SelectItem>
                  <SelectItem value="Cuti Tahunan">Cuti Tahunan</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>

              {selectedType === "Lainnya" && (
                <Input
                  className="mt-2"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  invalid={showError && isOtherType}
                  error={
                    showError && isOtherType
                      ? (errors[0]?.message ?? "")
                      : undefined
                  }
                  placeholder="Masukkan jenis cuti lainnya"
                />
              )}
              {selectedType !== "Lainnya" && showError && (
                <p className="text-sm text-destructive">
                  {errors[0]?.message ?? ""}
                </p>
              )}
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
                error={showError ? (errors[0]?.message ?? "") : undefined}
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

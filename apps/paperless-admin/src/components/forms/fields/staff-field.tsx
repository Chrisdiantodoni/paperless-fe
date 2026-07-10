import type { SelectValue } from "@workspace/types"
import { StaffCombobox } from "@/components/select/select-staff"
import { Label } from "@workspace/ui/components/ui/label"

interface StaffFieldProps {
  field: {
    state: { value: SelectValue }
    handleChange: (value: SelectValue) => void
    handleBlur: () => void
  }
  label: string
  required?: boolean
  deps?: Record<string, unknown>
}

export function StaffField({
  field,
  label,
  required = false,
  deps,
}: StaffFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <StaffCombobox
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        dependsOn={deps}
      />
    </div>
  )
}

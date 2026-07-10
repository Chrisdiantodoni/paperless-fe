import type { SelectValue } from "@workspace/types"
import { DepartmentCombobox } from "@/components/select/select-departments"
import { Label } from "@workspace/ui/components/ui/label"

interface DepartmentFieldProps {
  field: {
    state: { value: SelectValue }
    handleChange: (value: SelectValue) => void
    handleBlur: () => void
  }
  label: string
  required?: boolean
  deps?: Record<string, unknown>
}

export function DepartmentField({
  field,
  label,
  required = false,
}: DepartmentFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <DepartmentCombobox
        value={field.state.value}
        onChange={field.handleChange}
      />
    </div>
  )
}

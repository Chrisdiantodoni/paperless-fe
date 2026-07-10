import type { SelectValue } from "@workspace/types"
import { BranchCombobox } from "@/components/select/select-branch"
import { Label } from "@workspace/ui/components/ui/label"

interface BranchFieldProps {
  field: {
    state: { value: SelectValue }
    handleChange: (value: SelectValue) => void
    handleBlur: () => void
  }
  label: string
  required?: boolean
  deps?: Record<string, unknown>
}

export function BranchField({
  field,
  label,
  required = false,
}: BranchFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <BranchCombobox
        value={field.state.value}
        onChange={field.handleChange}
      />
    </div>
  )
}

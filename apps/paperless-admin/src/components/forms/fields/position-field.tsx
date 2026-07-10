import type { SelectValue } from "@workspace/types"
import { PositionCombobox } from "@/components/select/select-position"
import { Label } from "@workspace/ui/components/ui/label"

interface PositionFieldProps {
  field: {
    state: { value: SelectValue }
    handleChange: (value: SelectValue) => void
    handleBlur: () => void
  }
  label: string
  required?: boolean
  deps?: Record<string, unknown>
}

export function PositionField({
  field,
  label,
  required = false,
  deps,
}: PositionFieldProps) {
  console.log(deps)
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <PositionCombobox
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        dependsOn={deps}
      />
    </div>
  )
}

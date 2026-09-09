import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker"
import { Label } from "@workspace/ui/components/ui/label"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { StaffCombobox } from "../select/select-staff"
import { DepartmentCombobox } from "../select/select-departments"
import type { SelectValue } from "@workspace/types"

interface DynamicFormRendererProps {
  form: any
  formSchema: any[]
}

export function DynamicFormRenderer({ form, formSchema }: DynamicFormRendererProps) {
  const renderField = (field: any, index: number) => {
    const fieldName = `dynamic_data.payload.${field.name}`
    
    return (
      <form.Field key={index} name={fieldName}>
        {(formField: any) => {
          const errors = formField.state.meta.errors
          const showError = formField.state.meta.isTouched && errors.length > 0

          switch (field.type) {
            case "text":
              return (
                <div className="flex w-full flex-col space-y-1.5">
                  <Label>{field.label}{field.is_required && " *"}</Label>
                  <Input
                    value={formField.state.value || ""}
                    onChange={(e) => formField.handleChange(e.target.value)}
                    onBlur={formField.handleBlur}
                    invalid={showError}
                    error={showError ? errors[0]?.message ?? "" : undefined}
                  />
                </div>
              )
            
            case "textarea":
              return (
                <div className="flex w-full flex-col space-y-1.5">
                  <Label>{field.label}{field.is_required && " *"}</Label>
                  <Textarea
                    value={formField.state.value || ""}
                    onChange={(e) => formField.handleChange(e.target.value)}
                    onBlur={formField.handleBlur}
                    invalid={showError}
                    error={showError ? errors[0]?.message ?? "" : undefined}
                    rows={3}
                  />
                </div>
              )
            
            case "number":
              return (
                <div className="flex w-full flex-col space-y-1.5">
                  <Label>{field.label}{field.is_required && " *"}</Label>
                  <Input
                    type="number"
                    value={formField.state.value || ""}
                    onChange={(e) => formField.handleChange(e.target.value)}
                    onBlur={formField.handleBlur}
                    invalid={showError}
                    error={showError ? errors[0]?.message ?? "" : undefined}
                  />
                </div>
              )
            
            case "date":
              return (
                <DateTimePicker
                  mode="date"
                  label={field.label + (field.is_required ? " *" : "")}
                  value={formField.state.value || ""}
                  onChange={formField.handleChange}
                  onBlur={formField.handleBlur}
                  invalid={showError}
                  error={showError ? errors[0]?.message ?? "" : undefined}
                />
              )
            
            case "staff":
              return (
                <div className="flex w-full flex-col space-y-1.5">
                  <Label>{field.label}{field.is_required && " *"}</Label>
                  <StaffCombobox
                    value={formField.state.value || ""}
                    onChange={(val: SelectValue) => formField.handleChange(val.value)}
                    onBlur={formField.handleBlur}
                    invalid={showError}
                    error={showError ? errors[0]?.message ?? "" : undefined}
                  />
                </div>
              )
            
            case "department":
              return (
                <div className="flex w-full flex-col space-y-1.5">
                  <Label>{field.label}{field.is_required && " *"}</Label>
                  <DepartmentCombobox
                    value={formField.state.value || ""}
                    onChange={(val: SelectValue) => formField.handleChange(val.value)}
                    onBlur={formField.handleBlur}
                    invalid={showError}
                    error={showError ? errors[0]?.message ?? "" : undefined}
                  />
                </div>
              )
            
            default:
              return null
          }
        }}
      </form.Field>
    )
  }

  return (
    <FieldGroup className="gap-4">
      {formSchema.map((field, index) => renderField(field, index))}
    </FieldGroup>
  )
}

import React from "react"
import type { FieldDefinition } from "@/schema/master/schema"
import { FIELD_REGISTRY } from "@/components/registry/field-registry"
import { DepartmentField } from "@/components/forms/fields/department-field"
import { BranchField } from "@/components/forms/fields/branch-field"
import { PositionField } from "@/components/forms/fields/position-field"
import { StaffField } from "@/components/forms/fields/staff-field"
interface DynamicFormRendererProps {
  schema: FieldDefinition[]
  form: any
}

/** Components that use `useFieldContext` — rely on `form.Field` context provider */
const CONTEXT_COMPONENT_MAP: Record<string, React.ComponentType<any> | null> = {
  text: null, // handled below via TextField/TextareaField etc.
  textarea: null,
  number: null,
  checkbox: null,
  date: null,
  department: DepartmentField,
  branch: BranchField,
  position: PositionField,
  staff: StaffField,
}

export function DynamicFormRenderer({
  schema,
  form,
}: DynamicFormRendererProps) {
  return (
    <div className="space-y-6">
      {schema.map((fieldDef) => {
        const deps: Record<string, unknown> = {}
        if (fieldDef.dependsOn) {
          for (const depName of fieldDef.dependsOn) {
            deps[depName] = form.state.values[depName]
          }
        }

        const defaultValue = FIELD_REGISTRY[fieldDef.type].defaultValue
        const Comp = CONTEXT_COMPONENT_MAP[fieldDef.type]

        // Standard form-hook components (text, textarea, number, checkbox)
        // use `useFieldContext` via `form.AppField`
        if (Comp === null) {
          return (
            <form.AppField
              key={fieldDef.name}
              name={fieldDef.name}
              defaultValue={defaultValue}
            >
              {(field: any) => {
                const label = fieldDef.label
                const required = fieldDef.is_required
                switch (fieldDef.type) {
                  case "text":
                    return React.createElement(field.TextField, {
                      label,
                      required,
                    })
                  case "date":
                    return React.createElement(field.DatePickerField, {
                      label,
                      required,
                    })
                  case "textarea":
                    return React.createElement(field.TextareaField, {
                      label,
                      required,
                    })
                  case "number":
                    return React.createElement(field.NumberField, {
                      label,
                      required,
                    })
                  case "checkbox":
                    return React.createElement(field.CheckboxField, {
                      label,
                      required,
                    })
                  default:
                    return null
                }
              }}
            </form.AppField>
          )
        }

        // Combobox adapters — receive `field` as a prop via `form.Field`
        return (
          <form.Field
            key={fieldDef.name}
            name={fieldDef.name}
            defaultValue={defaultValue}
          >
            {(f: any) => (
              <Comp
                field={f}
                label={fieldDef.label}
                required={fieldDef.is_required}
                deps={deps}
              />
            )}
          </form.Field>
        )
      })}
    </div>
  )
}

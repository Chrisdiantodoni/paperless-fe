import type { FieldType } from "@/schema/master/schema"
import type { ReactNode } from "react"

export interface FieldRegistryEntry {
  type: FieldType
  /** Label shown in the builder dropdown */
  label: string
  /** Small description shown in the builder */
  description?: string
  /** Default value used when initializing the form */
  defaultValue: unknown
  /** Icon rendered in the builder list */
  icon: ReactNode
  /** Whether this field supports dependsOn */
  supportsDeps?: boolean
}
// Use a Record so we can look up by type string
export const FIELD_REGISTRY: Record<FieldType, FieldRegistryEntry> = {
  text: {
    type: "text",
    label: "Text Input",
    description: "Single line text",
    defaultValue: "",
    icon: "T",
  },
  textarea: {
    type: "textarea",
    label: "Text Area",
    description: "Multi-line text",
    defaultValue: "",
    icon: "¶",
  },
  number: {
    type: "number",
    label: "Number Input",
    description: "Numeric value",
    defaultValue: 0,
    icon: "#",
  },
  date: {
    type: "date",
    label: "Date Input",
    description: "Date value",
    defaultValue: 0,
    icon: "#",
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    description: "True/false toggle",
    defaultValue: false,
    icon: "✓",
  },
  department: {
    type: "department",
    label: "Department Picker",
    description: "Search & select department",
    defaultValue: { value: "", label: "" },
    icon: "🏢",
  },
  branch: {
    type: "branch",
    label: "Branch Picker",
    description: "Search & select branch",
    defaultValue: { value: "", label: "" },
    icon: "🏗",
  },
  position: {
    type: "position",
    label: "Position Picker",
    description: "Search & select position",
    defaultValue: { value: "", label: "" },
    icon: "💼",
    supportsDeps: true,
  },
  staff: {
    type: "staff",
    label: "Staff Picker",
    description: "Search & select staff",
    defaultValue: { value: "", label: "" },
    icon: "👤",
    supportsDeps: true,
  },
}
/** Flat list for iterating in the builder dropdown */
export const FIELD_REGISTRY_LIST = Object.values(FIELD_REGISTRY)

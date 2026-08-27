import { useId } from "react"
import { useFieldContext } from "../forms/form-context"
import { Label } from "@workspace/ui/components/ui/label"
import { useStore } from "@tanstack/react-form"
import { cn } from "@workspace/ui/lib/utils"
import { RichTextEditor } from "@workspace/ui/components/editor/RichTextEditor"
import type { EditorOutputFormat } from "@workspace/ui/hooks/useEditor"

interface RichTextEditorFieldProps {
  label: string
  placeholder?: string
  required?: boolean
  /** Format saved to the field. Defaults to "markdown". */
  outputFormat?: EditorOutputFormat
}

export function RichTextEditorField({
  label,
  placeholder,
  required,
  outputFormat = "markdown",
}: RichTextEditorFieldProps) {
  const field = useFieldContext<string>()
  const id = useId()
  const errorId = `${id}-error`

  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <RichTextEditor
        id={id}
        outputFormat={outputFormat}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(value) => field.handleChange(value)}
        // aria-invalid={errors.length > 0}
        aria-describedby={errors.length ? errorId : undefined}
        className={cn(errors.length && "border-destructive")}
      />
      {errors && <div id={errorId}>{errors}</div>}
    </div>
  )
}

import { useId } from "react"
import { useFieldContext } from "../forms/form-context"
import { Label } from "@workspace/ui/components/ui/label"
import { useStore } from "@tanstack/react-form"
import { cn } from "@workspace/ui/lib/utils"
import { TiptapEditor } from "@workspace/ui/components/editor/TiptapEditor"
import { getErrorMessage } from "../utils/get-error-message"

interface RichTextEditorFieldProps {
  label: string
  placeholder?: string
  required?: boolean
}

export function RichTextEditorField({
  label,
  placeholder,
  required,
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
      <TiptapEditor
        id={id}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(value) => field.handleChange(value)}
        aria-describedby={errors.length ? errorId : undefined}
        className={cn(errors.length && "border-destructive")}
      />
      {errors.length > 0 && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}
    </div>
  )
}

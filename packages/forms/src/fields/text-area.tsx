"use client"

import { useId } from "react"
import { useStore } from "@tanstack/react-form"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Label } from "@workspace/ui/components/ui/label"
import { cn } from "@workspace/ui/lib/utils"
import { useFieldContext } from "../forms/form-context"

interface TextareaFieldProps {
  label: string
  placeholder?: string
  rows?: number
  /** Show a "Checking…" hint while an async validator is in flight. */
  isValidating?: boolean
  /** Shows a red asterisk next to the label and sets aria-required. Purely
   * visual/a11y — actual required validation still comes from `validators`
   * on the field, this doesn't add validation by itself. */
  required?: boolean
  /** Show a live character counter, e.g. "128/500". */
  maxLength?: number
}

export function TextareaField({
  label,
  placeholder,
  rows = 4,
  isValidating: showValidating = false,
  required = false,
  maxLength,
}: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const id = useId()
  const errorId = `${id}-error`

  // Granular subscription: only re-renders on this field's own errors /
  // touched / validating state, not on every keystroke elsewhere in the form.
  const value = useStore(field.store, (state) => state.value) ?? ""
  const errors = useStore(field.store, (state) => state.meta.errors)
  const isTouched = useStore(field.store, (state) => state.meta.isTouched)
  const isValidating = useStore(field.store, (state) => state.meta.isValidating)

  // "onTouched"-style UX: don't show errors until the user has left this
  // field at least once (or a submit attempt was made, which also marks
  // fields touched) — not immediately on the first keystroke.
  const showErrors = isTouched && errors.length > 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        {maxLength !== undefined && (
          <span
            className={cn(
              "text-xs text-muted-foreground",
              value.length > maxLength && "text-destructive"
            )}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        required={required}
        aria-required={required}
        // aria-invalid={showErrors}
        aria-describedby={showErrors ? errorId : undefined}
        className={cn(showErrors && "border-destructive")}
      />
      {showValidating && isValidating && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Checking…
        </p>
      )}
      {showErrors && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(String).join(", ")}
        </p>
      )}
    </div>
  )
}

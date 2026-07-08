"use client"

import { useId } from "react"
import { useStore } from "@tanstack/react-form"
import { useFieldContext } from "../forms/form-context"
import { Label } from "@workspace/ui/components/ui/label"
import { Input } from "@workspace/ui/components/ui/input"
import { cn } from "@workspace/ui/lib/utils"
import { getErrorMessage } from "../utils/get-error-message"

interface TextFieldProps {
  label: string
  type?: "text" | "email" | "password"
  placeholder?: string
  required?: boolean
  /** Show a "Checking…" hint while an async validator is in flight. */
  isValidating?: boolean
}

export function TextField({
  label,
  type = "text",
  placeholder,
  required = false,
  isValidating: showValidating = false,
}: TextFieldProps) {
  const field = useFieldContext<string>()
  const id = useId()
  const errorId = `${id}-error`

  // Granular subscription: only re-renders on this field's own errors /
  // validating state, not on every keystroke elsewhere in the form.
  const errors = useStore(field.store, (state) => state.meta.errors)
  const isValidating = useStore(field.store, (state) => state.meta.isValidating)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        // aria-invalid={errors.length > 0}
        aria-describedby={errors.length ? errorId : undefined}
        className={cn(errors.length && "border-destructive")}
      />
      {showValidating && isValidating && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Checking…
        </p>
      )}
      {errors.length > 0 && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}
    </div>
  )
}

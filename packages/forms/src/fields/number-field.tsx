"use client"

import { useId } from "react"
import { useStore } from "@tanstack/react-form"
import { Label } from "@workspace/ui/components/ui/label"
import { Input } from "@workspace/ui/components/ui/input"
import { cn } from "@workspace/ui/lib/utils"
import { useFieldContext } from "../forms/form-context"
import { getErrorMessage } from "../utils/get-error-message"

export function NumberField({
  label,
  min,
  max,
  required = false,
}: {
  label: string
  min?: number
  max?: number
  required?: boolean
}) {
  const field = useFieldContext<number>()
  const id = useId()
  const errorId = `${id}-error`
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={Number.isNaN(field.state.value) ? "" : field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        // aria-invalid={errors.length > 0}
        aria-describedby={errors.length ? errorId : undefined}
        className={cn(
          errors.length && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {errors.length > 0 && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}
    </div>
  )
}

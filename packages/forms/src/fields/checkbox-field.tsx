"use client"

import { useId } from "react"
import { useStore } from "@tanstack/react-form"
import { Label } from "@workspace/ui/components/ui/label"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { useFieldContext } from "../forms/form-context"
import { getErrorMessage } from "../utils/get-error-message"

export function CheckboxField({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const id = useId()
  const errorId = `${id}-error`
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={field.state.value}
          onBlur={field.handleBlur}
          onCheckedChange={(checked) => field.handleChange(checked === true)}
          // aria-invalid={errors.length > 0}
          aria-describedby={errors.length ? errorId : undefined}
        />
        <Label htmlFor={id} className="font-normal">
          {label}
        </Label>
      </div>
      {errors.length > 0 && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}
    </div>
  )
}

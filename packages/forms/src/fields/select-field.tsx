"use client"

import { useId } from "react"
import { useStore } from "@tanstack/react-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Label } from "@workspace/ui/components/ui/label"
import { cn } from "@workspace/ui/lib/utils"
import { useFieldContext } from "../forms/form-context"
import { getErrorMessage } from "../utils/get-error-message"

interface SelectFieldProps {
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

export function SelectField({
  label,
  options,
  placeholder = "Select…",
  required = false,
}: SelectFieldProps) {
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
      <Select
        value={field.state.value || undefined}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger
          id={id}
          onBlur={field.handleBlur}
          // aria-invalid={errors.length > 0}
          aria-describedby={errors.length ? errorId : undefined}
          className={cn(
            "w-full",
            errors.length && "border-destructive focus-visible:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.length > 0 && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}
    </div>
  )
}

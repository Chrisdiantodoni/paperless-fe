"use client"

import { useId, useState } from "react"
import { useStore } from "@tanstack/react-form"
import { CalendarIcon } from "lucide-react"
import { useFieldContext } from "../forms/form-context"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/ui/popover"
import { Label } from "@workspace/ui/components/ui/label"
import { Button } from "@workspace/ui/components/ui/button"
import { Calendar } from "@workspace/ui/components/ui/calendar"
import { cn } from "@workspace/ui/lib/utils"
import { format } from "date-fns"
import { getErrorMessage } from "../utils/get-error-message"

interface DatePickerFieldProps {
  label: string
  placeholder?: string
  disabledDates?: (date: Date) => boolean
  required?: boolean
}

export function DatePickerField({
  label,
  placeholder = "Pick a date",
  disabledDates,
  required = false,
}: DatePickerFieldProps) {
  const field = useFieldContext<Date | undefined>()
  const id = useId()
  const errorId = `${id}-error`
  const [open, setOpen] = useState(false)
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            onBlur={field.handleBlur}
            // aria-invalid={errors.length > 0}
            aria-describedby={errors.length ? errorId : undefined}
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.state.value && "text-muted-foreground",
              errors.length && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {field.state.value ? format(field.state.value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(date) => {
              field.handleChange(date)
              setOpen(false)
            }}
            disabled={disabledDates}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {errors.length > 0 && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}
    </div>
  )
}

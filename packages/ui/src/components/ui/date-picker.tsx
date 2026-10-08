"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@workspace/ui/components/ui/calendar"
import { Field } from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface DatePickerInputProps {
  id?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePickerInput({
  id,
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled,
  minDate,
  maxDate,
  className,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value)
  const [inputValue, setInputValue] = React.useState(formatDate(value))

  React.useEffect(() => {
    setInputValue(formatDate(value))
    setMonth(value)
  }, [value])

  return (
    <Field className={className}>
      <InputGroup>
        <InputGroupInput
          id={id}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            const date = new Date(e.target.value)
            setInputValue(e.target.value)
            if (isValidDate(date)) {
              onChange?.(date)
              setMonth(date)
            } else if (!e.target.value) {
              onChange?.(undefined)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="Pilih tanggal"
                disabled={disabled}
              >
                <CalendarIcon />
                <span className="sr-only">Pilih tanggal</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                 selected={value}
                 month={month}
                 onMonthChange={setMonth}
                 disabled={(date) =>
                   Boolean(
                     (minDate && date < minDate) ||
                       (maxDate && date > maxDate)
                   )
                 }
                 onSelect={(date) => {
                   onChange?.(date)
                   setInputValue(formatDate(date))
                   setOpen(false)
                 }}

              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

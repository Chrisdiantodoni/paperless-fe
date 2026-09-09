import { forwardRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Label } from "./label"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Calendar } from "./calendar"
import { TimePicker } from "./time-picker"
import { CalendarIcon, Clock } from "lucide-react"
import { format, parse } from "date-fns"
import { id as idLocale } from "date-fns/locale"

export interface DateTimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  mode?: "date" | "datetime" | "time"
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  label?: string
  error?: string
  invalid?: boolean
  disabledDates?: (date: Date) => boolean
}

const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (
    {
      className,
      label,
      error,
      invalid,
      mode = "date",
      value = "",
      onChange,
      onBlur,
      placeholder,
      required,
      disabled,
      disabledDates
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
      if (!value) return undefined
      if (mode === "time") return undefined
      try {
        if (mode === "date") {
          const datePart = value.split('T')[0]
          return parse(datePart, "yyyy-MM-dd", new Date())
        }
        if (mode === "datetime") {
          return parse(value, "yyyy-MM-dd'T'HH:mm", new Date())
        }
      } catch {
        return undefined
      }
      return undefined
    })

    const [timeValue, setTimeValue] = useState<string>(() => {
      if (!value) return "00:00"
      if (mode === "time") return value
      if (mode === "datetime") {
        const parts = value.split("T")
        return parts[1] || "00:00"
      }
      return "00:00"
    })

    const getDisplayValue = () => {
      if (!value) return ""

      try {
        if (mode === "time") {
          return value
        }

        if (mode === "date" && selectedDate) {
          return format(selectedDate, "PPP", { locale: idLocale })
        }

        if (mode === "datetime" && selectedDate) {
          return `${format(selectedDate, "PPP", { locale: idLocale })} ${timeValue}`
        }
      } catch {
        return value
      }

      return value
    }

    const handleDateSelect = (date: Date | undefined) => {
      setSelectedDate(date)
      if (!date) {
        onChange?.("")
        if (mode === "date") {
          setOpen(false)
        }
        return
      }

      const dateStr = format(date, "yyyy-MM-dd")

      if (mode === "date") {
        onChange?.(dateStr)
        setOpen(false)
      } else if (mode === "datetime") {
        onChange?.(`${dateStr}T${timeValue}`)
      }
    }

    const handleTimeChange = (time: string) => {
      setTimeValue(time)

      if (mode === "time") {
        onChange?.(time)
      } else if (mode === "datetime" && selectedDate) {
        const dateStr = format(selectedDate, "yyyy-MM-dd")
        onChange?.(`${dateStr}T${time}`)
      }
    }

    const handleClear = () => {
      setSelectedDate(undefined)
      setTimeValue("00:00")
      onChange?.("")
    }

    const getPlaceholder = () => {
      if (placeholder) return placeholder
      if (mode === "date") return "Pilih tanggal"
      if (mode === "time") return "Pilih waktu"
      return "Pilih tanggal dan waktu"
    }

    const getIcon = () => {
      if (mode === "time") return <Clock className="mr-2 h-4 w-4" />
      return <CalendarIcon className="mr-2 h-4 w-4" />
    }

    if (mode === "time") {
      return (
        <div className="flex w-full flex-col space-y-1.5">
          {label && (
            <Label>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}
          <TimePicker
            value={value}
            onChange={onChange}
            invalid={invalid}
            disabled={disabled}
            ref={ref}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )
    }

    return (
      <div className="flex w-full flex-col space-y-1.5">
        {label && (
          <Label>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
        )}
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) onBlur?.()
          }}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                invalid && "border-destructive focus-visible:ring-destructive",
                className
              )}
            >
              {getIcon()}
              <span className="flex-1 truncate">{getDisplayValue() || getPlaceholder()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDates}
              />
              {mode === "datetime" && (
                <div className="mt-3 space-y-2 border-t pt-3">
                  <Label className="text-sm font-medium">Waktu</Label>
                  <TimePicker value={timeValue} onChange={handleTimeChange} />
                </div>
              )}
              <div className="mt-3 flex gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Bersihkan
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Selesai
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)
DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker }

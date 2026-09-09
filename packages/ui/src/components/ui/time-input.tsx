import { forwardRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface TimeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string
  onChange?: (value: string) => void
  invalid?: boolean
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, value = "", onChange, invalid, ...props }, ref) => {
    const [hours, minutes] = value.split(":").map((v) => v || "00")
    const [hoursValue, setHoursValue] = useState(hours)
    const [minutesValue, setMinutesValue] = useState(minutes)

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, "")
      if (val.length > 2) val = val.slice(0, 2)
      const numVal = parseInt(val || "0", 10)
      if (numVal > 23) val = "23"
      setHoursValue(val)
      const paddedHours = val || "00"
      const paddedMinutes = minutesValue || "00"
      onChange?.(`${paddedHours.padStart(2, "0")}:${paddedMinutes.padStart(2, "0")}`)
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, "")
      if (val.length > 2) val = val.slice(0, 2)
      const numVal = parseInt(val || "0", 10)
      if (numVal > 59) val = "59"
      setMinutesValue(val)
      const paddedHours = hoursValue || "00"
      const paddedMinutes = val || "00"
      onChange?.(`${paddedHours.padStart(2, "0")}:${paddedMinutes.padStart(2, "0")}`)
    }

    const handleHoursBlur = () => {
      const padded = (hoursValue || "00").padStart(2, "0")
      setHoursValue(padded)
      const paddedMinutes = (minutesValue || "00").padStart(2, "0")
      onChange?.(`${padded}:${paddedMinutes}`)
    }

    const handleMinutesBlur = () => {
      const padded = (minutesValue || "00").padStart(2, "0")
      setMinutesValue(padded)
      const paddedHours = (hoursValue || "00").padStart(2, "0")
      onChange?.(`${paddedHours}:${padded}`)
    }

    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={hoursValue}
          onChange={handleHoursChange}
          onBlur={handleHoursBlur}
          placeholder="00"
          className={cn(
            "flex h-9 w-12 rounded-md border border-input bg-transparent px-2 py-1 text-center text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            invalid && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="text-base font-medium md:text-sm">:</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={minutesValue}
          onChange={handleMinutesChange}
          onBlur={handleMinutesBlur}
          placeholder="00"
          className={cn(
            "flex h-9 w-12 rounded-md border border-input bg-transparent px-2 py-1 text-center text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            invalid && "border-destructive focus-visible:ring-destructive",
            className
          )}
        />
      </div>
    )
  }
)
TimeInput.displayName = "TimeInput"

export { TimeInput }

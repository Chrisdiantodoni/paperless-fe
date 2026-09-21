"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface TimePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  value?: string // Waktu format "HH:mm"
  onChange?: (value: string) => void
  invalid?: boolean
}

const parseTimeString = (val?: string) => {
  if (!val) return { hours: "00", minutes: "00" }
  const [h = "00", m = "00"] = val.split(":")
  return {
    hours: h.padStart(2, "0").slice(0, 2),
    minutes: m.padStart(2, "0").slice(0, 2),
  }
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      className,
      value = "00:00",
      onChange,
      invalid,
      disabled,
      id,
      name,
      required,
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel = "Waktu",
      ...props
    },
    ref
  ) => {
    const [flag, setFlag] = React.useState(false)

    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => setFlag(false), 2000)
        return () => clearTimeout(timer)
      }
    }, [flag])

    const parsed = React.useMemo(() => parseTimeString(value), [value])

    const updateTime = (segment: "hours" | "minutes", newSegVal: string) => {
      const maxVal = segment === "hours" ? 23 : 59
      const numericValue = Math.min(
        Number(newSegVal.replace(/\D/g, "")) || 0,
        maxVal
      )
      const next = {
        ...parsed,
        [segment]: numericValue.toString().padStart(2, "0"),
      }
      onChange?.(`${next.hours}:${next.minutes}`)
    }

    const handleSegmentChange =
      (segment: "hours" | "minutes") =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTime(segment, event.target.value)
      }

    const handleSegmentKeyDown =
      (segment: "hours" | "minutes") =>
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const cur = parsed[segment]
        const maxVal = segment === "hours" ? 23 : 59

        if (e.key === "Tab") return

        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
          e.preventDefault()
          const step = e.key === "ArrowUp" ? 1 : -1
          let numericVal = parseInt(cur, 10) + step
          if (numericVal > maxVal) numericVal = 0
          if (numericVal < 0) numericVal = maxVal
          setFlag(false)
          updateTime(segment, numericVal.toString())
          return
        }

        if (e.key >= "0" && e.key <= "9") {
          e.preventDefault()
          let calculated = !flag ? "0" + e.key : cur.slice(1, 2) + e.key

          if (parseInt(calculated, 10) > maxVal) {
            calculated = "0" + e.key
          }

          updateTime(segment, calculated)

          if (flag) {
            setFlag(false)
          } else {
            setFlag(true)
          }
        }
      }

    return (
      <div
        {...props}
        className={cn("flex items-center", className)}
        role="group"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
      >
        <input
          ref={ref}
          id={id}
          name={name ? `${name}.hours` : undefined}
          type="tel"
          inputMode="numeric"
          maxLength={2}
          required={required}
          disabled={disabled}
          value={parsed.hours}
          aria-label="Jam"
          onKeyDown={handleSegmentKeyDown("hours")}
          onChange={handleSegmentChange("hours")}
          className={cn(
            "h-9 w-11 rounded-l-md border border-input bg-transparent text-center font-mono text-sm tabular-nums caret-transparent transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            invalid &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40 dark:border-destructive/50"
          )}
        />
        <span
          aria-hidden="true"
          className="mx-2 text-sm font-medium text-muted-foreground select-none"
        >
          :
        </span>
        <input
          name={name ? `${name}.minutes` : undefined}
          type="tel"
          inputMode="numeric"
          maxLength={2}
          required={required}
          disabled={disabled}
          value={parsed.minutes}
          aria-label="Menit"
          onKeyDown={handleSegmentKeyDown("minutes")}
          onChange={handleSegmentChange("minutes")}
          className={cn(
            "-ml-px h-9 w-11 rounded-r-md border border-input bg-transparent text-center font-mono text-sm tabular-nums caret-transparent transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            invalid &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40 dark:border-destructive/50"
          )}
        />
      </div>
    )
  }
)

TimePicker.displayName = "TimePicker"

export { TimePicker }

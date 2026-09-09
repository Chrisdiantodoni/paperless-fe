import { forwardRef } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Label } from "./label"

export interface DateTimeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  invalid?: boolean
}

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  ({ className, label, error, invalid, type = "datetime-local", ...props }, ref) => {
    return (
      <div className="flex w-full flex-col space-y-1.5">
        {label && <Label>{label}</Label>}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            invalid && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)
DateTimeInput.displayName = "DateTimeInput"

export { DateTimeInput }

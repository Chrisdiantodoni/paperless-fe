import { FileArrowDown } from "@phosphor-icons/react"
import { forwardRef, useId, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Label } from "./label"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  invalid?: boolean
  tooltip?: string
  accept?: string
  maxSize?: number
  maxSizeUnit?: "KB" | "MB" | "GB"
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({
    className,
    label,
    error,
    invalid,
    tooltip,
    accept,
    maxSize,
    maxSizeUnit = "MB",
    ...props
  }, ref) => {
    const generatedId = useId()
    const inputId = props.id ?? generatedId
    const errorId = `${inputId}-error`
    const [fileName, setFileName] = useState("")
    const [validationError, setValidationError] = useState("")
    const displayedError = error || validationError

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      setValidationError("")
      setFileName(file?.name ?? "")

      if (file && maxSize !== undefined) {
        const multiplier = { KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 }[maxSizeUnit]
        if (file.size > maxSize * multiplier) {
          e.target.value = ""
          setFileName("")
          setValidationError(`File size must not exceed ${maxSize}${maxSizeUnit}.`)
          return
        }
      }

      props.onChange?.(e)
    }

    const tooltipContent = tooltip
      ? `${tooltip}${maxSize !== undefined ? ` (Max: ${maxSize}${maxSizeUnit})` : ""}`
      : maxSize !== undefined
        ? `Max file size: ${maxSize}${maxSizeUnit}`
        : undefined

    return (
      <div className="flex w-full flex-col space-y-1.5">
        <div className="flex items-center gap-1.5">
          {label && <Label htmlFor={inputId}>{label}</Label>}
          {tooltipContent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <FileArrowDown className="size-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right">{tooltipContent}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <input
          {...props}
          type="file"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            (invalid || displayedError) &&
              "border-destructive focus-visible:ring-destructive",
            className
          )}
          id={inputId}
          ref={ref}
          accept={accept}
          onChange={handleChange}
          aria-invalid={invalid || Boolean(displayedError) || undefined}
          aria-describedby={displayedError ? errorId : undefined}
        />
        {fileName && (
          <p className="text-xs text-muted-foreground">Selected: {fileName}</p>
        )}
        {displayedError && (
          <p id={errorId} className="text-sm text-destructive">
            {displayedError}
          </p>
        )}
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput }

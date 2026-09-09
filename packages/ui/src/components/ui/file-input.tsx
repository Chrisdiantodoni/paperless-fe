import { FileArrowDown } from "@phosphor-icons/react"
import { forwardRef, useState } from "react"
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
    const [fileName, setFileName] = useState<string>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        setFileName(files[0].name)
      }
      props.onChange?.(e)
    }

    const tooltipContent = tooltip
      ? `${tooltip}${maxSize ? ` (Max: ${maxSize}${maxSizeUnit})` : ""}`
      : maxSize
        ? `Max file size: ${maxSize}${maxSizeUnit}`
        : undefined

    return (
      <div className="flex w-full flex-col space-y-1.5">
        <div className="flex items-center gap-1.5">
          {label && <Label>{label}</Label>}
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
          type="file"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            invalid && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          accept={accept}
          onChange={handleChange}
          {...props}
        />
        {fileName && (
          <p className="text-xs text-muted-foreground">Selected: {fileName}</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput }

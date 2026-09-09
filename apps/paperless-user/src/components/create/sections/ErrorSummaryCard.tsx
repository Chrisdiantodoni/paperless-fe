import { useState } from "react"
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/ui/components/ui/card"

export interface FieldError {
  field: string
  label: string
  message: string
}

export interface ErrorSummaryCardProps {
  errors: FieldError[]
  onFieldClick?: (field: string) => void
}

export function ErrorSummaryCard({
  errors,
  onFieldClick,
}: ErrorSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (errors.length === 0) {
    return null
  }

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-semibold text-destructive">
            {errors.length} field{errors.length > 1 ? "s" : ""} perlu diperbaiki
          </h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li key={`${error.field}-${index}`}>
                <button
                  type="button"
                  onClick={() => onFieldClick?.(error.field)}
                  className="text-left text-sm text-muted-foreground hover:text-foreground"
                >
                  <span className="font-medium">{error.label}:</span>{" "}
                  {error.message}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}

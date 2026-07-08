import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip"
import { resolveLabels } from "./forms/utils/fn"
import type { SelectValue } from "@workspace/types"
import { useMemo } from "react"

export function LabelWithTooltip({ items }: { items: SelectValue[] }) {
  const { display, full, isTruncated } = useMemo(
    () => resolveLabels(items),
    [items]
  )

  if (!isTruncated) return <span>{display}</span>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help underline decoration-muted-foreground decoration-dotted">
          {display}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{full}</p>
      </TooltipContent>
    </Tooltip>
  )
}

"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/ui/popover"
import { Badge } from "@workspace/ui/components/ui/badge"
import type { SelectValue } from "@workspace/types"

interface SelectValuesPreviewProps {
  items: SelectValue[]
  /** Berapa banyak chip yang tampil langsung sebelum di-collapse ke "+N" */
  visibleCount?: number
}

export function SelectValuesPreview({
  items,
  visibleCount = 3,
}: SelectValuesPreviewProps) {
  const [open, setOpen] = useState(false)
  const visibleItems = items.slice(0, visibleCount)
  const hiddenItems = items.slice(visibleCount)
  const hasHidden = hiddenItems.length > 0

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleItems.map((item) => (
        <Badge key={item.value} variant="secondary" className="font-normal">
          {item.label}
        </Badge>
      ))}

      {hasHidden && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              +{hiddenItems.length} lainnya
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 bg-foreground p-2 text-background"
            align="start"
          >
            <div className="flex flex-wrap gap-1">
              {hiddenItems.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="bg-background font-normal text-foreground"
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

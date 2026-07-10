"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/ui/popover"
import { Badge } from "@workspace/ui/components/ui/badge"
import type { SelectValue } from "@workspace/types"

interface GroupedSelectPreviewProps {
  items: SelectValue[]
  /** Opsional — kalau gak dikasih, list ditampilkan flat tanpa grouping */
  getGroupKey?: (item: SelectValue) => string
  /** Key buat item yang gak match grouping manapun */
  fallbackGroupLabel?: string
}

export function GroupedSelectPreview({
  items,
  getGroupKey,
  fallbackGroupLabel = "Lainnya",
}: GroupedSelectPreviewProps) {
  const [open, setOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const display =
    items.length <= 3
      ? items.map((i) => i.label).join(", ")
      : `${items
          .slice(0, 3)
          .map((i) => i.label)
          .join(", ")}, +${items.length - 3} lainnya`

  if (items.length <= 3) return <span>{display}</span>

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Kalau gak ada getGroupKey, render flat list tanpa grouping
  const content = !getGroupKey ? (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li
          key={item.value}
          className="px-2 py-1 text-sm text-muted-foreground"
        >
          {item.label}
        </li>
      ))}
    </ul>
  ) : (
    (() => {
      const groups = new Map<string, SelectValue[]>()
      for (const item of items) {
        const key = getGroupKey(item) || fallbackGroupLabel
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(item)
      }
      const sortedGroupKeys = Array.from(groups.keys()).sort()

      return sortedGroupKeys.map((groupKey) => {
        const groupItems = groups.get(groupKey)!
        const isExpanded = expandedGroups.has(groupKey)

        return (
          <div key={groupKey} className="mb-1">
            <button
              type="button"
              onClick={() => toggleGroup(groupKey)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                {groupKey}
                <Badge variant="secondary" className="font-normal">
                  {groupItems.length}
                </Badge>
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            {isExpanded && (
              <ul className="ml-2 space-y-0.5 border-l py-1 pl-3">
                {groupItems.map((item) => (
                  <li
                    key={item.value}
                    className="text-sm text-muted-foreground"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })
    })()
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-pointer text-left underline decoration-muted-foreground decoration-dotted underline-offset-2 hover:decoration-foreground"
        >
          {display}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="max-h-72 overflow-y-auto p-2">{content}</div>
      </PopoverContent>
    </Popover>
  )
}

import { useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@workspace/ui/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/ui/popover"
import { Button } from "@workspace/ui/components/ui/button"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { usePositionSearch } from "@/hooks/queries/use-position"
import type { SelectValue } from "@workspace/types"

function extractValue(val?: string | SelectValue): string {
  return typeof val === "string" ? val : (val?.value ?? "")
}

function extractLabel(val?: string | SelectValue): string {
  return typeof val === "object" ? val.label : ""
}

interface PositionComboboxProps {
  value?: string | SelectValue
  onChange: (value: SelectValue) => void
  onBlur?: () => void
  dependsOn?: Record<string, unknown>
}

export function PositionCombobox({
  value,
  onChange,
  onBlur: _onBlur,
  dependsOn,
}: PositionComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const departmentId = (
    dependsOn?.department_id as SelectValue | undefined
  )?.value

  const resolvedValue = extractValue(value)
  const shouldFetch = open || !!resolvedValue

  const { data, isFetching } = usePositionSearch(
    debouncedSearch,
    shouldFetch,
    departmentId
  )
  const options = data?.data ?? []

  const resolvedLabel =
    extractLabel(value) || options.find((d) => d.id === resolvedValue)?.name

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{resolvedLabel || "Pilih posisi..."}</span>
          <span className="flex shrink-0 items-center gap-0.5">
            {resolvedValue && (
              <span
                role="button"
                tabIndex={0}
                onPointerDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange({ value: "", label: "" })
                }}
                className="flex size-4 items-center justify-center rounded-full text-muted-foreground/60 hover:bg-muted-foreground/20 hover:text-foreground"
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari posisi..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {isFetching ? (
              <div className="p-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>No position found.</CommandEmpty>
            ) : (
              options.map((pos) => (
                <CommandItem
                  key={pos.id}
                  value={pos.id}
                  onSelect={() => {
                    onChange({ value: pos.id, label: pos.name })
                    setOpen(false)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      resolvedValue === pos.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {pos.name}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

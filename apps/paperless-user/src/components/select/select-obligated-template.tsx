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
import type { SelectValue } from "@workspace/types"
import { useObligatedTemplatesSearch } from "@/hooks/queries/use-obligated-template"

function extractValue(val?: string | SelectValue): string {
  return typeof val === "string" ? val : (val?.value ?? "")
}

function extractLabel(val?: string | SelectValue): string {
  return typeof val === "object" ? val.label : ""
}

interface ObligatedTemplateComboboxProps {
  value?: string | SelectValue
  onChange: (value: SelectValue) => void
  onBlur?: () => void
  invalid?: boolean
  error?: string
  categoryId?: string
}

export function ObligatedTemplateCombobox({
  value,
  onChange,
  onBlur,
  error,
  categoryId,
}: ObligatedTemplateComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const resolvedValue = extractValue(value)
  const shouldFetch = open || (!!resolvedValue && !extractLabel(value))

  const deps = {
    page: 1,
    search: debouncedSearch,
    per_page: 50,
    type: "",
    request_type: "",
    category_id: categoryId || "",
    is_active: "true" as const,
  }

  console.log("[ObligatedTemplateCombobox] deps:", deps, "shouldFetch:", shouldFetch)

  const { data, isFetching } = useObligatedTemplatesSearch(
    debouncedSearch,
    shouldFetch,
    deps
  )
  const options = data?.data ?? []
  const resolvedLabel =
    extractLabel(value) || options.find((d) => d.id === resolvedValue)?.name

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) onBlur?.()
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          >
            <span className="truncate">
              {resolvedLabel || "Pilih template wajib..."}
            </span>
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
              placeholder="Cari template wajib..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandGroup>
              {isFetching ? (
                <div className="p-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : options.length === 0 ? (
                <CommandEmpty>No template found.</CommandEmpty>
              ) : (
                options.map((template) => (
                  <CommandItem
                    key={template.id}
                    value={template.id}
                    onSelect={() => {
                      onChange({ value: template.id, label: template.name })
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        resolvedValue === template.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {template.name}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  )
}

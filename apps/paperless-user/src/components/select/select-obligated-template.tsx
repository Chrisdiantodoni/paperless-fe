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
import type { ObligatedTemplate } from "@workspace/types"
import { useObligatedTemplatesSearch } from "@/hooks/queries/use-obligated-template"

interface ObligatedTemplateComboboxProps {
  value?: ObligatedTemplate | null
  onChange: (value: ObligatedTemplate | null) => void
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

  const { data: templates, isLoading } = useObligatedTemplatesSearch({
    page: 1,
    search: debouncedSearch,
    per_page: 20,
    type: "",
    request_type: "",
    category_id: categoryId || "",
    is_active: "true",
  })

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
              {value?.name || "Pilih template wajib..."}
            </span>
            <span className="flex shrink-0 items-center gap-0.5">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(null)
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
              {isLoading ? (
                <div className="p-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : !templates?.data || templates.data.length === 0 ? (
                <CommandEmpty>Template tidak ditemukan</CommandEmpty>
              ) : (
                templates.data.map((template) => (
                  <CommandItem
                    key={template.id}
                    value={template.id}
                    onSelect={() => {
                      onChange(template)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value?.id === template.id ? "opacity-100" : "opacity-0"
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

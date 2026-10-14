import { useDebounce } from "@/hooks/use-debounce"
import { useDropdownFilter } from "@/hooks/queries/use-dropdown-filter"
import type { DropdownFilterType } from "@/hooks/queries/use-dropdown-filter"
import { Button } from "@workspace/ui/components/ui/button"
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
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useState } from "react"

type Option = { id: string; name?: string; name_branch?: string }

interface AsyncFilterComboboxProps {
  type: DropdownFilterType
  value?: string
  label?: string
  placeholder: string
  onChange: (value?: string, label?: string) => void
}

export function AsyncFilterCombobox({
  type,
  value,
  label,
  placeholder,
  onChange,
}: AsyncFilterComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const { data = [], isFetching, isError } = useDropdownFilter(
    type,
    debouncedSearch
  )
  const options = data as Array<Option>
  const selectedLabel =
    label || options.find((option) => option.id === value)?.name_branch ||
    options.find((option) => option.id === value)?.name

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-8 w-full justify-between font-normal"
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <span className="flex shrink-0 items-center gap-0.5">
            {value && (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Hapus ${placeholder.toLowerCase()}`}
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  onChange()
                }}
                className="flex size-4 items-center justify-center rounded-full text-muted-foreground/60 hover:bg-muted-foreground/20 hover:text-foreground"
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronsUpDown className="size-4 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Cari ${placeholder.toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {isFetching ? (
              <div className="p-2 text-sm text-muted-foreground">Loading...</div>
            ) : isError ? (
              <div role="alert" className="p-2 text-sm text-destructive">
                Gagal memuat data
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
            ) : (
              options.map((option) => {
                const optionLabel = option.name_branch || option.name || option.id
                return (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => {
                      onChange(option.id, optionLabel)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={`mr-2 size-4 ${value === option.id ? "opacity-100" : "opacity-0"}`}
                    />
                    {optionLabel}
                  </CommandItem>
                )
              })
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

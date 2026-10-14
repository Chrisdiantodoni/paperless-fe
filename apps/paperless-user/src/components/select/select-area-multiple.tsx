import { useState } from "react"
import { useAreas } from "@/hooks/queries/use-area"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

export function SelectAreaMultiple({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { data, isLoading } = useAreas()
  const areas = data?.data ?? []
  const filtered = areas.filter((area) =>
    area.name_area.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between">
          <span className="truncate">
            {value.length ? `${value.length} area dipilih` : "Pilih area..."}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Cari area..." value={search} onValueChange={setSearch} />
          <CommandList className="max-h-64">
            <CommandGroup>
              {isLoading ? (
                <div className="p-2 text-sm text-muted-foreground">Loading...</div>
              ) : filtered.length === 0 ? (
                <CommandEmpty>Area tidak ditemukan</CommandEmpty>
              ) : (
                filtered.map((area) => {
                  const selected = value.includes(area.name_area)
                  return (
                    <CommandItem
                      key={area.id}
                      value={area.name_area}
                      onSelect={() =>
                        onChange(
                          selected
                            ? value.filter((name) => name !== area.name_area)
                            : [...value, area.name_area]
                        )
                      }
                    >
                      <Check className={`mr-2 size-4 ${selected ? "opacity-100" : "opacity-0"}`} />
                      {area.name_area}
                    </CommandItem>
                  )
                })
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

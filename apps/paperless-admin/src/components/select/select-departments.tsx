import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
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
import { Check, ChevronsUpDown } from "lucide-react"
import { useDepartmentSearch } from "@/hooks/queries/use-departments"

interface DepartmentComboboxProps {
  value?: string
  onChange: (value: string) => void
}

export function DepartmentCombobox({
  value,
  onChange,
}: DepartmentComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { data, isFetching } = useDepartmentSearch(debouncedSearch, open)

  const options = data?.data ?? []
  const selectedLabel = options.find((d) => d.id === value)?.name ?? value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {selectedLabel || "Select department..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search department..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {isFetching ? (
              <div className="p-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>No department found.</CommandEmpty>
            ) : (
              options.map((dept) => (
                <CommandItem
                  key={dept.id}
                  value={dept.id}
                  onSelect={() => {
                    onChange(dept.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === dept.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {dept.name}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

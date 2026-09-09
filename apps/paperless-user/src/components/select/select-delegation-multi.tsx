import { useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "sonner"
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
import { Badge } from "@workspace/ui/components/ui/badge"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useStaffSearch } from "@/hooks/queries/use-staff"
import type { SelectValue } from "@workspace/types"

interface DelegationMultiSelectProps {
  value: SelectValue[]
  onChange: (value: SelectValue[]) => void
  onBlur?: () => void
  departmentId?: string
  invalid?: boolean
  error?: string
  maxDelegations?: number
}

export function DelegationMultiSelect({
  value,
  onChange,
  onBlur,
  departmentId,
  invalid,
  error,
  maxDelegations = 3,
}: DelegationMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const shouldFetch = open
  const { data, isFetching } = useStaffSearch(debouncedSearch, shouldFetch, {
    departmentId,
  })

  const options = (data?.data ?? []).filter((d) => d.user_account?.id != null)

  const handleSelect = (staffId: string, staffLabel: string) => {
    const isAlreadySelected = value.some((v) => v.value === staffId)

    if (isAlreadySelected) {
      onChange(value.filter((v) => v.value !== staffId))
    } else {
      if (value.length >= maxDelegations) {
        toast.error(`Maksimal ${maxDelegations} delegasi dapat dipilih`)
        return
      }
      onChange([...value, { value: staffId, label: staffLabel }])
    }
  }

  const handleRemove = (staffId: string) => {
    onChange(value.filter((v) => v.value !== staffId))
  }

  const selectedCount = value.length

  return (
    <>
      <div className="flex w-full flex-col space-y-2">
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
                invalid
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
            >
              <span className="truncate">
                {selectedCount > 0
                  ? `${selectedCount} delegasi dipilih`
                  : "Pilih delegasi..."}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Cari staff..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandGroup>
                {isFetching ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : options.length === 0 ? (
                  <CommandEmpty>Staff tidak ditemukan</CommandEmpty>
                ) : (
                  options.map((staff) => {
                    const staffId = staff.user_account?.id ?? ""
                    const staffLabel = `${staff.biodata?.fullname} - ${staff.employment_data.position.name}`
                    const isSelected = value.some((v) => v.value === staffId)

                    return (
                      <CommandItem
                        key={staff.id}
                        value={String(staffId)}
                        onSelect={() => {
                          handleSelect(staffId, staffLabel)
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {staffLabel}
                      </CommandItem>
                    )
                  })
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {value.map((staff) => (
              <Badge
                key={staff.value}
                variant="secondary"
                className="gap-1 pr-1"
              >
                <span className="truncate">{staff.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(staff.value)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  )
}

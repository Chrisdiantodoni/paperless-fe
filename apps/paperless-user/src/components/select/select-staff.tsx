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
import { useStaffSearch } from "@/hooks/queries/use-staff"
import type { SelectValue } from "@workspace/types"

function extractValue(val?: string | SelectValue): string {
  return typeof val === "string" ? val : (val?.value ?? "")
}

function extractLabel(val?: string | SelectValue): string {
  return typeof val === "object" ? val.label : ""
}

interface StaffComboboxProps {
  value?: string | SelectValue
  onChange: (value: SelectValue) => void
  onBlur?: () => void
  invalid?: boolean
  error?: string
  dependsOn?: Record<string, unknown>
}

export function StaffCombobox({
  value,
  onChange,
  onBlur,
  invalid,
  error,
  dependsOn,
}: StaffComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const departmentId = (dependsOn?.department_id as SelectValue | undefined)
    ?.value
  const branchId = (dependsOn?.branch_id as SelectValue | undefined)?.value
  const positionId = (dependsOn?.position_id as SelectValue | undefined)?.value

  const resolvedValue = extractValue(value)
  const shouldFetch = open || !!resolvedValue

  const { data, isFetching } = useStaffSearch(debouncedSearch, shouldFetch, {
    departmentId,
    branchId,
    positionId,
  })
  const options = (data?.data ?? []).filter((d) => d.user_account?.id != null)

  const selectedStaff = options.find(
    (d) => d.user_account?.id === resolvedValue
  )
  const fallbackLabel = selectedStaff
    ? `${selectedStaff.biodata?.fullname} - ${selectedStaff.employment_data?.position?.name}`
    : ""

  const resolvedLabel = extractLabel(value) || fallbackLabel

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
              invalid ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          >
            <span className="truncate">
              {resolvedLabel || "Pilih staff..."}
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
                  const staffLabel = `${staff.biodata?.fullname} - ${staff.employment_data?.position?.name}`

                  return (
                    <CommandItem
                      key={staff.id}
                      value={String(staff.user_account?.id ?? "")}
                      onSelect={() => {
                        onChange({
                          value: staff.user_account?.id ?? "",
                          label: staffLabel,
                        })
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          resolvedValue === staff.user_account?.id
                            ? "opacity-100"
                            : "opacity-0"
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  )
}

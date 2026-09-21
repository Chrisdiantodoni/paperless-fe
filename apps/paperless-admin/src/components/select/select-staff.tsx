import { useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
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
import type { IStaff, SelectValue } from "@workspace/types"

export type StaffSelectValue = SelectValue & {
  staff: IStaff
}

function extractValue(val?: string | SelectValue | StaffSelectValue): string {
  return typeof val === "string" ? val : (val?.value ?? "")
}

function extractLabel(val?: string | SelectValue | StaffSelectValue): string {
  return typeof val === "object" ? val.label : ""
}

interface StaffComboboxProps {
  value?: string | SelectValue | StaffSelectValue
  onChange: (value: StaffSelectValue | SelectValue) => void
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
            className={`w-full max-w-full min-w-0 justify-between ${
              invalid ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          >
            <span className="min-w-0 flex-1 truncate text-left">
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
                    onChange({ value: "", label: "", staff: {} as IStaff })
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
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="z-[100] max-h-80 w-[var(--radix-popover-trigger-width)] overflow-hidden p-0"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Cari staff..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-64 overflow-y-auto">
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
                             staff,
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
                        <span className="min-w-0 break-words">
                          {staffLabel}
                        </span>
                      </CommandItem>
                    )
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  )
}

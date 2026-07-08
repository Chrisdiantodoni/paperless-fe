"use client"

import { useMemo, useState } from "react"
import { useStore } from "@tanstack/react-form"
import type { ChangeEvent } from "react"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { useFieldContext } from "../forms/form-context"
import { getErrorMessage } from "../utils/get-error-message"
import { Search } from "lucide-react"

export type CheckboxOption = { value: string; label: string }

interface CheckboxGroupFieldProps {
  label: string
  options: CheckboxOption[]
  /** Max height of the scrollable options list, as a Tailwind max-h-* value
   * (without the "max-h-" prefix isn't needed — pass the full class). */
  maxListHeightClassName?: string
}

export function CheckboxGroupField({
  label,
  options,
  maxListHeightClassName = "max-h-48",
}: CheckboxGroupFieldProps) {
  // 1. Ubah tipe context menjadi array of objects (CheckboxOption[])
  const field = useFieldContext<CheckboxOption[]>()

  const selected = useStore(field.store, (state) => state.value) ?? []
  const errors = useStore(field.store, (state) => state.meta.errors)

  const [search, setSearch] = useState("")

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  )

  const allSelected = options.length > 0 && selected.length === options.length
  const someSelected = selected.length > 0 && !allSelected

  function toggleAll() {
    // 2. Jika di-select all, masukkan seluruh object options (bukan hanya value-nya)
    field.handleChange(allSelected ? [] : [...options])
    field.handleBlur()
  }

  function toggleOne(option: CheckboxOption, checked: boolean) {
    // 3. Masukkan object utuh jika di-check, dan filter berdasarkan value jika di-uncheck
    field.handleChange(
      checked
        ? [...selected, option]
        : selected.filter((item) => item.value !== option.value)
    )
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>

      <div className="min-h-0 rounded-md border">
        <div className="flex items-center gap-2 border-b p-3">
          <Checkbox
            id={`${label}-select-all`}
            checked={
              allSelected ? true : someSelected ? "indeterminate" : false
            }
            onCheckedChange={toggleAll}
          />
          <Label
            htmlFor={`${label}-select-all`}
            className="text-sm font-medium"
          >
            Select all
          </Label>
        </div>

        {options.length > 6 && (
          <div className="relative border-b">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="h-9 rounded-none border-0 pl-9 shadow-none focus-visible:ring-0"
            />
          </div>
        )}

        <div
          className={`${maxListHeightClassName} space-y-2 overflow-y-auto p-3`}
        >
          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              className="relative flex items-center gap-2 pl-1"
            >
              <Checkbox
                id={`${label}-${opt.value}`}
                // 4. Cek apakah item sudah terpilih menggunakan array method .some()
                checked={selected.some((item) => item.value === opt.value)}
                onCheckedChange={
                  (checked) => toggleOne(opt, checked === true) // Kirim object `opt` utuh
                }
                onBlur={field.handleBlur}
              />
              <Label
                htmlFor={`${label}-${opt.value}`}
                className="text-sm font-normal"
              >
                {opt.label}
              </Label>
            </div>
          ))}

          {search && filteredOptions.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground">
              Tidak ditemukan.
            </p>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <p role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}
    </div>
  )
}

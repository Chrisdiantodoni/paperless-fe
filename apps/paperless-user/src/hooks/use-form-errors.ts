import { useStore } from "@tanstack/react-form"
import type { FieldError } from "@/components/create/sections/ErrorSummaryCard"

export function getFormFieldErrors(formApi: any): FieldError[] {
  const errors: FieldError[] = []
  const fieldMeta = formApi?.state?.fieldMeta
  if (!fieldMeta) return errors

  Object.entries(fieldMeta as Record<string, any>).forEach(([name, meta]) => {
    ;(meta?.errors || []).forEach((e: any) => {
      const message = typeof e === "string" ? e : e?.message || String(e)
      errors.push({ field: name, label: name, message })
    })
  })
  return errors
}

export function useFormFieldErrors(form: any): FieldError[] {
  return useStore(form.store, (state: any) => {
    const result: FieldError[] = []
    const fieldMeta = state.fieldMeta as Record<string, any> | undefined
    if (!fieldMeta) return result

    Object.entries(fieldMeta).forEach(([name, meta]) => {
      ;(meta?.errors || []).forEach((e: any) => {
        const message = typeof e === "string" ? e : e?.message || String(e)
        result.push({ field: name, label: name, message })
      })
    })
    return result
  })
}
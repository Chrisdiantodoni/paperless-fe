"use client"

/**
 * Generic repeater for ANY array field (line items, contacts, phone numbers,
 * social links — whatever). This is intentionally not registered in
 * form-hook.ts: you pass the `form` in directly and it renders `form.Field`
 * with `mode: 'array'` internally. Usage looks like:
 *
 *   <Repeater
 *     form={form}
 *     name="items"
 *     label="Line items"
 *     defaultItem={() => ({ sku: '', variant: '', quantity: 1 })}
 *     renderItem={(index) => (
 *       <>
 *         <form.AppField name={`items[${index}].sku`}>
 *           {(field) => <field.TextField label="SKU" />}
 *         </form.AppField>
 *         <form.AppField name={`items[${index}].quantity`}>
 *           {(field) => <field.NumberField label="Quantity" />}
 *         </form.AppField>
 *       </>
 *     )}
 *   />
 *
 * `renderItem` is where YOU decide the row's fields — the Repeater only
 * owns the array shell: add, remove, reorder, empty state.
 */

import type { ReactNode } from "react"
import { ArrowDown, ArrowUp, Plus, Trash2, ListPlus } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"

// `form` is typed as `any` on purpose. useAppForm()'s real return type has
// `Field`'s `name` constrained to a strict union of deep-key paths inferred
// from your defaultValues (not a generic `string`), plus a long chain of
// other generics. Trying to hand-write a "FormLike" interface for that ends
// up structurally incompatible with the real thing (contravariant checks on
// the `name`/`children` params fail) — which is the "types are not
// compatible" error. `any` here is the same deliberate escape hatch as
// `AnyFieldApi` elsewhere in this codebase: full type-safety on a reusable
// component composed against TanStack Form's deep generics isn't worth the
// tradeoff. You still get full autocomplete/type-checking on `form` itself
// wherever you call `useAppForm()` — this only loosens it at the boundary
// where it's passed into Repeater.
interface RepeaterProps<TItem> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  name: string
  label: string
  defaultItem: () => TItem
  renderItem: (index: number) => ReactNode
  minItems?: number
  maxItems?: number
}

export function Repeater<TItem>({
  form,
  name,
  label,
  defaultItem,
  renderItem,
  minItems = 0,
  maxItems,
}: RepeaterProps<TItem>) {
  return (
    <form.Field name={name} mode="array">
      {(arrayField: any) => {
        const items = arrayField.state.value
        const atMax = maxItems !== undefined && items.length >= maxItems

        // tambahkan ini
        const errors = arrayField.state.meta.errors
        const isTouched = arrayField.state.meta.isTouched
        const showError = isTouched && errors.length > 0
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{label}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={atMax}
                onClick={() => arrayField.pushValue(defaultItem())}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add
              </Button>
            </div>
            {showError && (
              <p className="text-sm font-medium text-destructive">
                {errors
                  .map((err: { message?: string } | string) =>
                    typeof err === "string" ? err : err?.message
                  )
                  .join(", ")}
              </p>
            )}
            {items.length === 0 && (
              <div className="flex animate-in flex-col items-center justify-center rounded-md border border-dashed border-border py-8 text-center fade-in-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ListPlus className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">
                    Belum ada {label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Klik tombol <strong className="font-medium">Add</strong> di
                    sudut kanan atas untuk menambahkan item.
                  </p>
                </div>
              </div>
            )}

            {items.map((_: TItem, index: number) => (
              <div
                key={index}
                role="group"
                aria-label={`${label} item ${index + 1}`}
                className="rounded-md border p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Item {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === 0}
                      onClick={() => arrayField.swapValues(index, index - 1)}
                      aria-label="Move item up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={index === items.length - 1}
                      onClick={() => arrayField.swapValues(index, index + 1)}
                      aria-label="Move item down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={items.length <= minItems}
                      onClick={() => arrayField.removeValue(index)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {renderItem(index)}
              </div>
            ))}
          </div>
        )
      }}
    </form.Field>
  )
}

"use client"

import { useSortable } from "@dnd-kit/react/sortable"
import { StaffCombobox } from "@/components/select/select-staff"
import type { SelectValue as StaffValue } from "@workspace/types"
import { Button } from "@workspace/ui/components/ui/button"
import { GripVertical, Lock, Trash2 } from "lucide-react"

export interface EditableRecipientItem {
  id: string
  user_id: string
  user_label?: string
  user_position?: string
  recipient_type: "superior" | "to" | "cc"
  sequence: number
  locked?: boolean
}

interface SortableRecipientRowProps {
  recipient: EditableRecipientItem
  index: number
  displaySequence?: number
  /** Tampilkan nomor urut. Matikan untuk grup tanpa urutan (mis. tembusan). */
  showSequence?: boolean
  onUpdate: (updated: EditableRecipientItem) => void
  onRemove: () => void
}

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function SortableRecipientRow({
  recipient,
  index,
  displaySequence,
  showSequence = true,
  onUpdate,
  onRemove,
}: SortableRecipientRowProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: recipient.id,
    index,
    disabled: recipient.locked,
  })

  const currentOrder = displaySequence ?? index + 1
  const lockedLabel = "Penerima ini terkunci"

  return (
    <div
      ref={ref}
      className={cx(
        "flex w-full min-w-0 items-center gap-2 rounded-lg border bg-card p-2 shadow-xs transition-[border-color,box-shadow,opacity]",
        isDragging
          ? "border-primary/50 opacity-70 shadow-lg ring-2 ring-primary/20"
          : "hover:border-foreground/20",
        recipient.locked && "bg-muted/30"
      )}
    >
      {/* Pegangan seret */}
      <button
        ref={handleRef}
        type="button"
        disabled={recipient.locked}
        className="flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label={
          recipient.locked
            ? lockedLabel
            : `Geser untuk mengubah urutan #${currentOrder}`
        }
      >
        <GripVertical className="size-4" />
      </button>

      {/* Nomor urut */}
      {showSequence && (
        <div
          className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-muted px-1.5 text-xs font-semibold text-muted-foreground tabular-nums"
          aria-label={`Urutan ${currentOrder}`}
        >
          #{currentOrder}
        </div>
      )}

      {/* Pilihan staf */}
      <div className="min-w-0 flex-1">
        {recipient.locked ? (
          <div className="flex min-w-0 items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            <Lock className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {recipient.user_label ?? recipient.user_id}
              {recipient.user_position ? ` - ${recipient.user_position}` : ""}
            </span>
          </div>
        ) : (
          <StaffCombobox
            value={{
              value: recipient.user_id,
              label: recipient.user_label || recipient.user_id,
            }}
            onChange={(val: StaffValue) =>
              onUpdate({
                ...recipient,
                user_id: val.value,
                user_label: val.label,
              })
            }
          />
        )}
      </div>

      {/* Hapus */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={recipient.locked}
        className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
        onClick={onRemove}
        aria-label={recipient.locked ? lockedLabel : "Hapus penerima"}
        title={recipient.locked ? lockedLabel : "Hapus penerima"}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}

"use client"

import { DragDropProvider } from "@dnd-kit/react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog"
import {
  AlertCircle,
  Loader2,
  Plus,
  Send,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useState, type FormEvent } from "react"
import z from "zod"
import {
  SortableRecipientRow,
  type EditableRecipientItem,
} from "./sortable-recipient-row"

export const updateRecipientsBodySchema = z.object({
  recipients: z
    .array(
      z.object({
        user_id: z.string().min(1, { message: "User wajib dipilih" }),
        recipient_type: z.enum(["approver", "to", "cc"], {
          message: "Tipe penerima tidak valid",
        }),
        sequence: z.number().int().min(1),
      })
    )
    .min(1, { message: "Minimal harus ada 1 recipient" }),
})

export type UpdateRecipientsBody = z.infer<typeof updateRecipientsBodySchema>
type RecipientType = EditableRecipientItem["recipient_type"]

interface EditRecipientDialogProps {
  initialRecipients?: Omit<EditableRecipientItem, "id">[]
  onSubmit: (body: UpdateRecipientsBody) => Promise<void> | void
  isSubmitting?: boolean
  trigger?: React.ReactNode
}

const groups: {
  type: RecipientType
  label: string
  description: string
  icon: LucideIcon
}[] = [
  {
    type: "approver",
    label: "Diketahui",
    description: "Penerima yang ikut alur persetujuan.",
    icon: UserCheck,
  },
  {
    type: "to",
    label: "Kepada",
    description: "Penerima utama surat.",
    icon: Send,
  },
  {
    type: "cc",
    label: "Tembusan",
    description: "Penerima informasi tanpa urutan persetujuan.",
    icon: Users,
  },
]

function createRecipient(
  type: RecipientType,
  sequence: number
): EditableRecipientItem {
  return {
    id: crypto.randomUUID(),
    user_id: "",
    user_label: "",
    recipient_type: type,
    sequence,
  }
}

export function EditRecipientDialog({
  initialRecipients = [],
  onSubmit,
  isSubmitting = false,
  trigger,
}: EditRecipientDialogProps) {
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [recipients, setRecipients] = useState<EditableRecipientItem[]>([])

  function normalizeData(data: Omit<EditableRecipientItem, "id">[]) {
    if (!data.length) return [createRecipient("to", 1)]
    return data
      .map((item) => ({ ...item, id: crypto.randomUUID() }))
      .sort((a, b) => a.sequence - b.sequence)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) return
    setOpen(nextOpen)
    if (nextOpen) {
      setRecipients(normalizeData(initialRecipients))
      setErrorMessage(null)
    }
  }

  function updateRecipient(updated: EditableRecipientItem) {
    setRecipients((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    )
  }

  function removeRecipient(id: string) {
    setRecipients((current) => current.filter((item) => item.id !== id))
  }

  function reorderGroup(
    type: RecipientType,
    sourceId: string,
    targetId: string
  ) {
    setRecipients((current) => {
      const group = current.filter((item) => item.recipient_type === type)
      const fromIndex = group.findIndex((item) => item.id === sourceId)
      const toIndex = group.findIndex((item) => item.id === targetId)
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current

      const reordered = [...group]
      const [moved] = reordered.splice(fromIndex, 1)
      if (!moved) return current
      reordered.splice(toIndex, 0, moved)

      const slots = group.map((item) => item.sequence).sort((a, b) => a - b)
      const reassigned = reordered.map((item, i) => ({
        ...item,
        sequence: slots[i] ?? item.sequence,
      }))

      const ids = new Set(group.map((item) => item.id))
      let cursor = 0
      return current.map((item) =>
        ids.has(item.id) ? reassigned[cursor++]! : item
      )
    })
  }

  function addRecipient(type: RecipientType) {
    setRecipients((current) => {
      const approvalSequences = current
        .filter((item) => item.recipient_type !== "cc")
        .map((item) => item.sequence)
      const sequence = type === "cc" ? 1 : Math.max(0, ...approvalSequences) + 1
      return [...current, createRecipient(type, sequence)]
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()
    setErrorMessage(null)

    const approvalSequence = new Map<string, number>()
    recipients
      .filter((item) => item.recipient_type !== "cc")
      .sort((a, b) => a.sequence - b.sequence)
      .forEach((item, index) => approvalSequence.set(item.id, index + 1))

    const payload = {
      recipients: recipients.map(({ id, user_id, recipient_type }) => ({
        user_id,
        recipient_type,
        sequence: approvalSequence.get(id) ?? 1,
      })),
    }
    const validation = updateRecipientsBodySchema.safeParse(payload)
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message ?? "Periksa input")
      return
    }

    try {
      await onSubmit(validation.data)
      setOpen(false)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menyimpan recipient"
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Edit Penerima Surat</Button>}
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-xl border px-0 pt-0 pb-4 shadow-2xl sm:max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="flex max-h-[85dvh] min-h-0 flex-col bg-background"
        >
          {/* Header */}
          <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
            <DialogTitle className="text-base font-semibold tracking-tight sm:text-lg">
              Edit Penerima Surat
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
              Atur siapa yang menerima surat ini. Geser (drag & drop) untuk
              mengubah urutan dalam satu kelompok.
            </DialogDescription>
          </DialogHeader>

          {/* Alert Error */}
          {errorMessage && (
            <div
              role="alert"
              className="flex shrink-0 items-start gap-2.5 border-b border-destructive/20 bg-destructive/10 px-6 py-3 text-xs text-destructive sm:text-sm"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Content Area */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
            {groups.map(({ type, label, description, icon: Icon }) => {
              const items = recipients.filter(
                (item) => item.recipient_type === type
              )
              const headingId = `recipient-group-${type}`

              return (
                <section
                  key={type}
                  aria-labelledby={headingId}
                  className="rounded-xl border border-border/70 bg-card/60 p-4 transition-all"
                >
                  <header className="mb-3.5 flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/50">
                      <Icon className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          id={headingId}
                          className="text-sm font-semibold tracking-tight"
                        >
                          {label}
                        </h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                          {items.length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </header>

                  <DragDropProvider
                    onDragEnd={({ canceled, operation }) => {
                      if (canceled || !operation.source || !operation.target)
                        return
                      const sourceId = String(operation.source.id)
                      const targetId = String(operation.target.id)
                      if (sourceId === targetId) return

                      const source = recipients.find(
                        (item) => item.id === sourceId
                      )
                      const target = recipients.find(
                        (item) => item.id === targetId
                      )
                      if (source?.locked || target?.locked) return

                      reorderGroup(type, sourceId, targetId)
                    }}
                  >
                    <div className="space-y-2">
                      {items.length === 0 && (
                        <div className="rounded-lg border border-dashed border-border/80 bg-background/50 px-3 py-6 text-center text-xs text-muted-foreground">
                          Belum ada penerima di bagian ini.
                        </div>
                      )}
                      {items.map((recipient, index) => (
                        <SortableRecipientRow
                          key={recipient.id}
                          recipient={recipient}
                          index={index}
                          showSequence={type !== "cc"}
                          onUpdate={updateRecipient}
                          onRemove={() => removeRecipient(recipient.id)}
                        />
                      ))}
                    </div>
                  </DragDropProvider>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2.5 w-full gap-1.5 border-dashed border-border bg-background/50 font-normal text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => addRecipient(type)}
                  >
                    <Plus className="size-3.5" />
                    Tambah penerima
                  </Button>
                </section>
              )
            })}
          </div>

          {/* Fixed Footer */}
          <DialogFooter className="shrink-0 flex-row items-center justify-end gap-2.5 border-t bg-muted/30 px-6 py-3.5 sm:gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                className="h-9 px-4"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              className="h-9 gap-2 px-4 shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              Simpan perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

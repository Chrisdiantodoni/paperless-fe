import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"

interface RevisionDialogProps {
  open: boolean
  revisionReason: string
  onReasonChange: (reason: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function RevisionDialog({
  open,
  revisionReason,
  onReasonChange,
  onClose,
  onSubmit,
}: RevisionDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="revision-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="revision-title" className="text-lg font-semibold">
              Revisi Surat
            </h3>
            <p className="text-sm text-muted-foreground">
              Masukkan alasan revisi untuk surat ini.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <textarea
          className="mt-5 min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          value={revisionReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Masukkan alasan revisi (wajib)"
          aria-label="Alasan revisi"
        />

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={!revisionReason.trim()}>
            Submit Revisi
          </Button>
        </div>
      </div>
    </div>
  )
}

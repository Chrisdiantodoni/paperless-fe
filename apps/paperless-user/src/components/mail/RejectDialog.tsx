import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"

interface RejectDialogProps {
  open: boolean
  rejectReason: string
  onReasonChange: (reason: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function RejectDialog({
  open,
  rejectReason,
  onReasonChange,
  onClose,
  onSubmit,
}: RejectDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="reject-title" className="text-lg font-semibold">
              Tolak Permohonan
            </h3>
            <p className="text-sm text-muted-foreground">
              Masukkan alasan penolakan untuk surat ini.
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
          value={rejectReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Masukkan alasan penolakan (wajib)"
          aria-label="Alasan penolakan"
        />

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!rejectReason.trim()}
            variant="destructive"
          >
            Tolak Surat
          </Button>
        </div>
      </div>
    </div>
  )
}

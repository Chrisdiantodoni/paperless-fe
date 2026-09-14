import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
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
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revisi Surat</DialogTitle>
          <DialogDescription>
            Masukkan alasan revisi untuk surat ini.
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          value={revisionReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Masukkan alasan revisi (wajib)"
          aria-label="Alasan revisi"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={!revisionReason.trim()}>
            Submit Revisi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

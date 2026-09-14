import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
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
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tolak Permohonan</DialogTitle>
          <DialogDescription>
            Masukkan alasan penolakan untuk surat ini.
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          value={rejectReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Masukkan alasan penolakan (wajib)"
          aria-label="Alasan penolakan"
        />
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

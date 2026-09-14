import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { Button } from "@workspace/ui/components/ui/button"

interface ApprovalDialogProps {
  open: boolean
  approvalNote: string
  onNoteChange: (note: string) => void
  onClose: () => void
  onApprove: () => void
}

export function ApprovalDialog({
  open,
  approvalNote,
  onNoteChange,
  onClose,
  onApprove,
}: ApprovalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setujui Permohonan</DialogTitle>
          <DialogDescription>
            Tambahkan catatan persetujuan (opsional).
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          value={approvalNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Tambahkan catatan untuk pemohon (opsional)"
          aria-label="Catatan persetujuan"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={onApprove}>Setujui</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

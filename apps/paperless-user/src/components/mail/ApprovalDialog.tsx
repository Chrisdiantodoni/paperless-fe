import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"

interface ApprovalDialogProps {
  open: boolean
  approvalNote: string
  onNoteChange: (note: string) => void
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}

export function ApprovalDialog({
  open,
  approvalNote,
  onNoteChange,
  onClose,
  onApprove,
  onReject,
}: ApprovalDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="approval-title" className="text-lg font-semibold">
              Review request
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose an action and optionally leave a note.
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
          value={approvalNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a note for the requester (optional)"
          aria-label="Approval note"
        />

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onReject}>
            Reject
          </Button>
          <Button onClick={onApprove}>Approve</Button>
        </div>
      </div>
    </div>
  )
}

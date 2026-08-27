import {
  ChevronLeft,
  ChevronRight,
  Archive,
  MoreHorizontal,
  Star,
  FileText,
  Paperclip,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Separator } from '@workspace/ui/components/ui/separator'
import type { Mail } from '@/hooks/queries/use-mail-data'

export interface MailDetailProps {
  current: Mail
  displayedStatus: string
  filtered: Mail[]
  selectedId: number
  onOpenApproval: () => void
  onMoveSelection: (direction: -1 | 1) => void
}

export function MailDetail({
  current,
  displayedStatus,
  filtered,
  selectedId,
  onOpenApproval,
  onMoveSelection,
}: MailDetailProps) {
  const currentIndex = filtered.findIndex((m) => m.id === selectedId)
  const canPrevious = currentIndex > 0
  const canNext = currentIndex < filtered.length - 1

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'default'
      case 'Approved':
        return 'secondary'
      case 'Rejected':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={!canPrevious}
              onClick={() => onMoveSelection(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={!canNext}
              onClick={() => onMoveSelection(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 xl:p-8">
        <div className="flex min-w-0 flex-1 flex-col bg-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant={getBadgeVariant(displayedStatus)}>
                {displayedStatus}
              </Badge>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                {current.subject}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {current.document} · {current.date}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="my-5" />

          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              {current.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{current.sender}</p>
              <p className="text-xs text-muted-foreground">
                {current.department} · {current.branch}
              </p>
            </div>
            <p className="shrink-0 text-xs text-muted-foreground">
              to HR Operations
            </p>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Approval</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review and approve this request
                </p>
              </div>
              <Button onClick={onOpenApproval} size="sm">
                Review request
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Request type</dt>
                <dd className="mt-1 text-sm font-medium">{current.leave}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Dates</dt>
                <dd className="mt-1 text-sm font-medium">{current.leave}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Reason</dt>
                <dd className="mt-1 text-sm font-medium">{current.reason}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Recipients</dt>
                <dd className="mt-1 text-sm font-medium">HR Operations</dd>
              </div>
            </div>
          </div>

          <div className="mt-7 whitespace-pre-wrap text-sm text-foreground">
            {`Hi HR Operations,

I would like to submit a request for ${current.leave.toLowerCase()}. 

Reason: ${current.reason}

Please review and let me know if you need any additional information.

Thank you,
${current.sender}`}
          </div>

          {current.attachments > 0 && (
            <div className="mt-7">
              <h4 className="text-sm font-medium">
                Attachments ({current.attachments})
              </h4>
              <div className="mt-3 flex gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  leave-plan.pdf
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

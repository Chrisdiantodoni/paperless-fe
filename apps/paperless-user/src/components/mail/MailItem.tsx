import { Paperclip } from 'lucide-react'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import type { Mail } from '@/hooks/queries/use-mail-data'

export interface MailItemProps {
  mail: Mail
  isSelected: boolean
  isChecked: boolean
  onSelect: (id: number) => void
  onToggle: (id: number) => void
}

export function MailItem({
  mail,
  isSelected,
  isChecked,
  onSelect,
  onToggle,
}: MailItemProps) {
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

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle(mail.id)
  }

  return (
    <button
      onClick={() => onSelect(mail.id)}
      className={`flex w-full gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${
        isSelected ? 'bg-accent/60' : ''
      }`}
    >
      <div onClick={handleCheckboxClick} className="mt-1 shrink-0">
        <Checkbox
          checked={isChecked}
          aria-label={`Select mail from ${mail.sender}`}
        />
      </div>

      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
          mail.unread
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {mail.initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={`truncate ${
                mail.unread ? 'font-bold' : 'font-medium'
              }`}
            >
              {mail.sender}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {mail.subject}
            </p>
          </div>
          <p className="shrink-0 text-[11px] text-muted-foreground">
            {mail.date}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant(mail.status)} className="px-1.5 py-0 text-[10px]">
              {mail.status}
            </Badge>
            <p className="text-[11px] text-muted-foreground">
              {mail.document}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {mail.attachments > 0 && (
              <Paperclip className="h-3 w-3 text-muted-foreground" />
            )}
            {mail.unread && (
              <div className="size-1.5 shrink-0 rounded-full bg-primary" />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

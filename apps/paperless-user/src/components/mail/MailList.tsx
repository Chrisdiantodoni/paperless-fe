import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import type { Mail } from '@/hooks/queries/use-mail-data'
import { MailItem } from './MailItem'

export interface MailListProps {
  visibleMails: Mail[]
  filtered: Mail[]
  page: number
  pageSize: number
  pageCount: number
  selected: number[]
  selectedId: number
  onSelect: (id: number) => void
  onToggle: (id: number) => void
  onSelectAll: () => void
  onPageChange: (page: number) => void
}

export function MailList({
  visibleMails,
  filtered,
  page,
  pageSize,
  pageCount,
  selected,
  selectedId,
  onSelect,
  onToggle,
  onSelectAll,
  onPageChange,
}: MailListProps) {
  const isAllSelected = filtered.length > 0 && selected.length === filtered.length
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, filtered.length)

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectAll()
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-border px-5 py-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div onClick={handleCheckboxClick} className="cursor-pointer">
              <Checkbox
                checked={isAllSelected}
                aria-label="Select all mails"
              />
            </div>
            <span>
              {selected.length > 0
                ? `${selected.length} selected`
                : `${filtered.length} conversations`}
            </span>
          </div>
          <span>Newest first</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {visibleMails.map((mail) => (
          <MailItem
            key={mail.id}
            mail={mail}
            isSelected={mail.id === selectedId}
            isChecked={selected.includes(mail.id)}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
      </div>

      <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            {filtered.length > 0
              ? `${startIndex}–${endIndex} of ${filtered.length}`
              : '0 results'}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">
              {page} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page === pageCount}
              onClick={() => onPageChange(page + 1)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

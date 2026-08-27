import { ChevronLeft, ChevronRight, Inbox } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import { Skeleton } from "@workspace/ui/components/ui/skeleton"
import { MailItem } from "./MailItem"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { AllMailProps } from "@workspace/types/mail"

export interface MailListProps {
  mails: LaravelPaginationData<AllMailProps[]>
  isLoading: boolean
  page: number
  pageSize: number
  pageCount: number
  selectedId: string | number | null
  onPageChange: (page: number) => void
  onItemClick: (id: string) => void
}

export function MailList({
  mails,
  isLoading,
  page,
  pageSize,
  pageCount,
  selectedId,
  onPageChange,
  onItemClick,
}: MailListProps) {
  const total = mails.total
  const data = mails.data

  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, total)
  const isFirstPage = page <= 1
  const isLastPage = page >= pageCount || pageCount === 0

  return (
    <div className="flex h-full flex-col">
      {/* List Container */}
      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3.5 w-3/4" />
                  <div className="flex justify-between pt-1">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <Inbox className="mb-2 size-10 stroke-1 opacity-50" />
            <p className="text-sm font-medium">Tidak ada surat</p>
            <p className="text-xs text-muted-foreground/80">
              Belum ada permohonan atau surat yang masuk di daftar ini.
            </p>
          </div>
        ) : (
          data.map((mail) => (
            <MailItem
              key={mail.id}
              mail={mail}
              isSelected={String(mail.id) === String(selectedId)}
              onSelect={onItemClick}
            />
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-border bg-background/50 px-4 py-2.5 text-xs text-muted-foreground backdrop-blur-xs">
        <div className="flex items-center justify-between">
          <span>
            {total > 0 ? `${startIndex}–${endIndex} dari ${total}` : "0 hasil"}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="mr-2 tabular-nums">
              {pageCount > 0 ? `${page} / ${pageCount}` : "0 / 0"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={isFirstPage || isLoading}
              onClick={() => onPageChange(page - 1)}
              className="size-7"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLastPage || isLoading}
              onClick={() => onPageChange(page + 1)}
              className="size-7"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

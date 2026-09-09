import { Button } from "@workspace/ui/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { LaravelPaginationData } from "@workspace/types/api"

interface DataTablePaginationProps<T> {
  pagination: LaravelPaginationData<T[]>
  isFetching?: boolean
  onPageChange: (page: number) => void
}

export function DataTablePagination<T>({
  pagination,
  isFetching = false,
  onPageChange,
}: DataTablePaginationProps<T>) {
  const isFirstPage = pagination.current_page <= 1
  const isLastPage =
    pagination.current_page >= pagination.last_page ||
    pagination.last_page === 0

  const startIndex =
    pagination.total === 0
      ? 0
      : (pagination.current_page - 1) * pagination.per_page + 1
  const endIndex = Math.min(
    pagination.current_page * pagination.per_page,
    pagination.total
  )

  return (
    <div className="flex items-center justify-between border-t border-border bg-background/50 px-4 py-2.5 text-xs text-muted-foreground rounded-lg">
      <span>
        {pagination.total > 0
          ? `${startIndex}–${endIndex} dari ${pagination.total}`
          : "0 hasil"}
      </span>

      <div className="flex items-center gap-1.5">
        <span className="mr-2 tabular-nums">
          {pagination.last_page > 0
            ? `${pagination.current_page} / ${pagination.last_page}`
            : "0 / 0"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          disabled={isFirstPage || isFetching}
          onClick={() => onPageChange(pagination.current_page - 1)}
          className="size-7"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isLastPage || isFetching}
          onClick={() => onPageChange(pagination.current_page + 1)}
          className="size-7"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

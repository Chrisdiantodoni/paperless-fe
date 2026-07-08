import { Button } from "@workspace/ui/components/ui/button"

interface DataTablePaginationProps {
  currentPage: number
  lastPage: number
  total: number
  onPageChange: (page: number) => void
  isFetching?: boolean
}

export function DataTablePagination({
  currentPage,
  lastPage,
  total,
  onPageChange,
  isFetching,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Halaman {currentPage} dari {lastPage} &middot; {total} total data
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isFetching}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage || isFetching}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  )
}

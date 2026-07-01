import { TableCell, TableRow } from "@workspace/ui/components/ui/table"
import { Skeleton } from "@workspace/ui/components/ui/skeleton"

interface DataTableSkeletonProps {
  columnCount: number
  rowCount?: number
}

// HANYA baris, tidak ada <Table>/<div> wrapper — supaya valid ditaruh langsung di dalam <TableBody> yang sudah ada
export function DataTableSkeleton({
  columnCount,
  rowCount = 5,
}: DataTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <TableRow key={`skeleton-row-${rowIdx}`}>
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <TableCell key={`skeleton-cell-${rowIdx}-${colIdx}`}>
              <Skeleton className="h-5 w-full max-w-[200px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

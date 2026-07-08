// standalone version — untuk pendingComponent / full page fallback, BUKAN untuk ditaruh di dalam tbody existing
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Skeleton } from "@workspace/ui/components/ui/skeleton"
import { DataTableSkeleton } from "./data-table-skeleton"

interface DataTableSkeletonProps {
  columnCount: number
  rowCount?: number
}
export function DataTableSkeletonStandalone({
  columnCount,
  rowCount = 5,
}: DataTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <DataTableSkeleton columnCount={columnCount} rowCount={rowCount} />
        </TableBody>
      </Table>
    </div>
  )
}

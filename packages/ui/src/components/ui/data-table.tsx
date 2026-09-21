import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useRef, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { DataTableSkeleton } from "./data-table-skeleton"
import type { ColumnDef } from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: Array<TData>
  isFetching?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isFetching = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const wasFetching = useRef(isFetching)
  const [status, setStatus] = useState(isFetching ? "Memuat data." : "")

  useEffect(() => {
    if (isFetching) setStatus("Memuat data.")
    else if (wasFetching.current) setStatus("Data selesai dimuat.")
    wasFetching.current = isFetching
  }, [isFetching])

  return (
    <div
      className="relative overflow-x-auto rounded-md border"
      aria-busy={isFetching}
    >
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody
          className={
            isFetching
              ? "pointer-events-none opacity-40 transition-opacity duration-200"
              : "transition-opacity duration-200"
          }
        >
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : !isFetching ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Tidak ada data.
              </TableCell>
            </TableRow>
          ) : null}

          {isFetching && !table.getRowModel().rows.length && (
            <DataTableSkeleton
              columnCount={columns.length}
              rowCount={data.length || 5}
            />
          )}
        </TableBody>
      </Table>
    </div>
  )
}

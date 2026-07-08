// app/components/data-table.tsx
import type { ColumnDef } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { DataTableSkeleton } from "./data-table-skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isFetching?: boolean // Tambahkan prop penanda refetching
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

  return (
    <Table className="relative overflow-hidden">
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

      {/* Tambahkan transisi halus saat fetching latar belakang terjadi */}
      <TableBody
        className={
          isFetching
            ? "pointer-events-none opacity-40 transition-opacity duration-200"
            : "transition-opacity duration-200"
        }
      >
        {/* HANYA RENDER DATA LAMA JIKA TIDAK SEDANG FETCHING */}
        {!isFetching && table.getRowModel().rows.length ? (
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

        {/* JIKA SEDANG FETCHING, HANYA RENDER SKELETON (Tinggi tabel terjaga) */}
        {isFetching && (
          <DataTableSkeleton
            columnCount={columns.length}
            rowCount={data.length || 5} // Menyesuaikan jumlah baris halaman sebelumnya
          />
        )}
      </TableBody>
    </Table>
  )
}

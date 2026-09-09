import type { ColumnDef } from "@tanstack/react-table"
import type { Subordinate } from "@workspace/types/master"
import { Badge } from "@workspace/ui/components/ui/badge"

export type SubordinateRow = Subordinate & {
  current_page: number
  per_page: number
}

export const columns: ColumnDef<SubordinateRow>[] = [
  {
    accessorKey: "no",
    header: "No.",
    cell: ({ row }) =>
      (row.original.current_page - 1) * row.original.per_page +
      (row.index + 1),
  },
  {
    accessorKey: "fullname",
    header: "Nama Lengkap",
  },
  {
    accessorKey: "nip",
    header: "NIP",
  },
  {
    accessorKey: "branch",
    header: "Cabang",
    cell: ({ row }) => row.original.branch.name,
  },
  {
    accessorKey: "position",
    header: "Posisi",
    cell: ({ row }) => row.original.position.name,
  },
  {
    accessorKey: "department",
    header: "Departemen",
    cell: ({ row }) => row.original.department.name,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusLabel =
        row.original.status === "active" ? "Aktif" : "Tidak Aktif"
      return (
        <Badge
          variant={
            row.original.status === "active" ? "secondary" : "destructive"
          }
          className="rounded-md"
        >
          {statusLabel}
        </Badge>
      )
    },
  },
]

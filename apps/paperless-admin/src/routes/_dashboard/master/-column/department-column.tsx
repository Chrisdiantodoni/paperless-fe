import { DataTableColumnHeader } from "@/components/data-table-column-header"
import type { ColumnDef } from "@tanstack/react-table"
import type { Department } from "@workspace/types/master"

export type DepartmentRow = Department & {
  current_page: number
  per_page: number
}

export const columns: ColumnDef<DepartmentRow>[] = [
  // createSelectColumn<DepartmentRow>(),
  {
    accessorKey: "no",
    header: "No.",
    cell: ({ row }) => {
      return (
        (row.original.current_page - 1) * row.original.per_page +
        (row.index + 1)
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nama Departemen",
  },
  {
    accessorKey: "department_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code Departemen" />
    ),
  },
  {
    accessorKey: "branch_category",
    header: "Kategori Cabang",
  },
  {
    accessorKey: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div>
        <button onClick={() => alert(`Edit ${row.original.name}`)}>Edit</button>
      </div>
    ),
  },
]

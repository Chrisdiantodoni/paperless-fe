import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { createSelectColumn } from "@/components/data-table-select-column"
import type { ColumnDef } from "@tanstack/react-table"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { Area } from "@workspace/types/master"

export const columns: ColumnDef<LaravelPaginationData<Area>>[] = [
  createSelectColumn(),
  {
    accessorKey: "name_area",
    header: "Nama Area",
  },
  {
    accessorKey: "code_area",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code Area" />
    ),
  },
]

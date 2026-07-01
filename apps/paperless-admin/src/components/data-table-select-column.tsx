import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"

/**
 * Kolom checkbox select-all / select-row, reusable lintas tabel.
 * Pemakaian:
 *   export const columns: ColumnDef<Payment>[] = [
 *     selectColumn,
 *     { accessorKey: "email", header: "Email" },
 *     // ...
 *   ]
 */
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

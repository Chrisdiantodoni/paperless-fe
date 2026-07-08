import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { StaticMailTemplate } from "@workspace/types/master"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Eye, Pencil, Trash } from "lucide-react"

export type StaticMailTemplateRow = StaticMailTemplate & {
  current_page: number
  per_page: number
}

export const columns: ColumnDef<StaticMailTemplateRow>[] = [
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
    header: "Nama",
    cell: ({ row }) => {
      return row.original.name
    },
  },
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => {
      return row.original.code
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusLabel = row.original.is_active ? "Aktif" : "Tidak Aktif"
      return (
        <Badge
          variant={row.original.is_active ? "secondary" : "destructive"}
          className="rounded-md"
        >
          {statusLabel}
        </Badge>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex flex-row">
        <Button asChild variant="ghost" size="sm">
          <Link
            to="/mail/static-mail-templates/$id"
            params={{
              id: row.original.id,
            }}
          >
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            to="/mail/static-mail-templates/$id"
            params={{
              id: row.original.id,
            }}
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            to="/mail/static-mail-templates/$id"
            params={{
              id: row.original.id,
            }}
          >
            <Trash className="h-4 w-4" color="red" />
          </Link>
        </Button>
      </div>
    ),
  },
]

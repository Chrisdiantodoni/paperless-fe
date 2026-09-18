import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Eye, Pencil, Trash } from "lucide-react"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { toast } from "sonner"
import { useDeleteStaticMailMutation } from "@/hooks/queries/use-static-mail-template"
import { getRequestTypeLabel } from "@workspace/utils"
import type { AdminUser } from "@workspace/types"

export type AdminUserRow = AdminUser & {
  current_page: number
  per_page: number
}

export function ActionCell({ rowData }: { rowData: AdminUserRow }) {
  // Ambil fungsi confirm dan toast dari hooks yang kamu gunakan di komponen ini

  return (
    <div className="flex flex-row gap-1">
      <Button asChild variant="ghost" size="sm">
        <Link to="/system/users/$id" params={{ id: rowData.id }}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

export const columns: ColumnDef<AdminUserRow>[] = [
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
      return row.original.staff.fullname
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return row.original.user_account.username
    },
  },
  {
    accessorKey: "position",
    header: "Posisi",
    cell: ({ row }) => {
      return row.original.staff.position
    },
  },
  {
    accessorKey: "branch",
    header: "Cabang",
    cell: ({ row }) => {
      return row.original.staff.branch
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusLabel =
        row.original.user_account.is_active === true ? "Aktif" : "Tidak Aktif"
      return (
        <Badge
          variant={
            row.original.user_account.is_active === true
              ? "secondary"
              : "destructive"
          }
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
    cell: ({ row }) => <ActionCell rowData={row.original} />,
  },
]

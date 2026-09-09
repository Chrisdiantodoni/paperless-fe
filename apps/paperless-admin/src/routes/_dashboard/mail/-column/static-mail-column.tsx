import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { StaticMailTemplate } from "@workspace/types/master"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Eye, Pencil, Trash } from "lucide-react"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { toast } from "sonner"
import { useDeleteStaticMailMutation } from "@/hooks/queries/use-static-mail-template"
import { getRequestTypeLabel } from "@workspace/utils"

export type StaticMailTemplateRow = StaticMailTemplate & {
  current_page: number
  per_page: number
}

export function ActionCell({ rowData }: { rowData: StaticMailTemplateRow }) {
  // Ambil fungsi confirm dan toast dari hooks yang kamu gunakan di komponen ini
  const confirm = useConfirm()
  const { mutateAsync: deleteStaticMailTemplate } =
    useDeleteStaticMailMutation()

  const handleDelete = async () => {
    await confirm({
      title: "Hapus Template",
      variant: "destructive",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        await deleteStaticMailTemplate(rowData.id)
        toast.success("Template dihapus")
      },
    })
  }

  return (
    <div className="flex flex-row gap-1">
      <Button asChild variant="ghost" size="sm">
        <Link to="/mail/static-mail-templates/$id" params={{ id: rowData.id }}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>

      <Button asChild variant="ghost" size="sm">
        <Link
          to="/mail/static-mail-templates/$id/edit"
          params={{ id: rowData.id }}
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>

      {/* Gunakan Button biasa dengan onClick, jangan dibungkus <Link> */}
      <Button variant="ghost" size="sm" onClick={handleDelete}>
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
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
    accessorKey: "request_type",
    header: "Tipe Permintaan",
    cell: ({ row }) => {
      const type = row.original.request_type
      return (
        <Badge variant="outline" className="rounded-md">
          {getRequestTypeLabel(type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Kategori / Dept",
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
    cell: ({ row }) => <ActionCell rowData={row.original} />,
  },
]

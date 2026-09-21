import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Eye, Pencil } from "lucide-react"
import type { MailSkipProps } from "@workspace/types/mail"
import { formatDate } from "@workspace/utils"

export type SkipperRow = MailSkipProps & {
  current_page: number
  per_page: number
}

export function ActionCell({ rowData }: { rowData: SkipperRow }) {
  return (
    <div className="flex flex-row gap-1">
      <Button asChild variant="ghost" size="sm">
        <Link
          to="/mail/skip-mails/$id/detail"
          params={{ id: rowData.id }}
          aria-label={`Lihat detail ${rowData.skipper.name}`}
        >
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

export const columns: ColumnDef<SkipperRow>[] = [
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
    accessorKey: "skipper.name",
    header: "Nama Skipper",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.skipper.name}</span>
          <span className="text-xs text-muted-foreground">
            Dibuat oleh: {row.original.created_by.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "date_range",
    header: "Periode",
    cell: ({ row }) => {
      const { date_from, date_to } = row.original
      return (
        <span className="text-sm">
          {formatDate(date_from)} s/d {formatDate(date_to)}
        </span>
      )
    },
  },
  {
    accessorKey: "reason",
    header: "Alasan",
    cell: ({ row }) => {
      return (
        <span
          className="line-clamp-2 max-w-[200px]"
          title={row.original.reason}
        >
          {row.original.reason || "-"}
        </span>
      )
    },
  },
  {
    accessorKey: "skipped_mails",
    header: "Surat Dilewati",
    cell: ({ row }) => {
      const mails = row.original.skipped_mails ?? []
      return (
        <Badge variant="outline" className="rounded-md">
          {mails.length} Surat
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

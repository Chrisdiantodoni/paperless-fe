import { Paperclip, Building2 } from "lucide-react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import type { AllMailProps } from "@workspace/types/mail"
import { getInitials } from "@workspace/ui/lib/utils"
import { formatDate, getRequestTypeLabel } from "@workspace/utils"

export interface MailItemProps {
  mail: AllMailProps
  isSelected: boolean
  onSelect: (id: string) => void
}

export function MailItem({ mail, isSelected, onSelect }: MailItemProps) {
  // Status mapping disesuaikan dengan kode Flutter
  const getBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      case "revision":
      case "sent":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "rejected":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
      case "pending":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
      case "draft":
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  // Ambil label judul request (misal: "Terlambat Masuk Kantor" atau default request type)
  const permitTitle =
    mail.request_data?.permit_type ||
    getRequestTypeLabel(mail.request_data?.type) ||
    "Surat Permohonan"

  return (
    <div
      onClick={() => onSelect(mail.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(mail.id)
        }
      }}
      className={`group relative flex w-full cursor-pointer items-start gap-3 border-b border-border p-3.5 text-left transition-colors hover:bg-muted/50 ${
        isSelected ? "bg-accent/60" : ""
      }`}
    >
      {/* Selection Checkbox & Avatar */}
      <div className="flex items-center gap-2 pt-0.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {getInitials(mail.sent_by.name)}
        </div>
      </div>

      {/* Main Mail Content */}
      <div className="min-w-0 flex-1">
        {/* Header: Sender Name, Department & Date */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-foreground">
                {mail.sent_by?.name ?? "Pengirim Tidak Diketahui"}
              </p>
              {mail.sent_by?.department && (
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  • {mail.sent_by.department}
                </span>
              )}
            </div>
            <p className="truncate text-xs font-medium text-foreground/80">
              {permitTitle}
            </p>
          </div>

          <span className="shrink-0 text-[11px] whitespace-nowrap text-muted-foreground">
            {formatDate(mail.created_at.toString())}
          </span>
        </div>

        {/* Footer: Status Badge, Document Number & Branch */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className={`px-1.5 py-0 text-[10px] font-medium capitalize ${getBadgeClass(
                mail.status
              )}`}
            >
              {mail.status}
            </Badge>

            <span className="font-mono text-[11px] text-muted-foreground">
              {mail.document_number}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {mail.branch?.name && (
              <span className="flex max-w-[140px] items-center gap-1 truncate text-[10px]">
                <Building2 className="size-3 shrink-0" />
                <span className="truncate">{mail.branch.name}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

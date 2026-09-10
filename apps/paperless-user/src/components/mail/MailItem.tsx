import { Building2 } from "lucide-react"
import { Badge } from "@workspace/ui/components/ui/badge"
import type { AllMailProps } from "@workspace/types/mail"
import { getInitials } from "@workspace/ui/lib/utils"
import { formatDate, getRequestTypeLabel } from "@workspace/utils"
import { isMailReadByUser } from "@/utils/mail-helpers"
import { getBadgeClass } from "./MailDetail"

export interface MailItemProps {
  mail: AllMailProps
  isSelected: boolean
  currentUserId: string
  localReadIds: Set<string>
  onSelect: (id: string) => void
}

export function MailItem({
  mail,
  isSelected,
  currentUserId,
  localReadIds,
  onSelect,
}: MailItemProps) {
  const isRead =
    localReadIds.has(mail.id) || isMailReadByUser(mail, currentUserId)

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
      } ${!isRead ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}`}
    >
      {!isRead && (
        <div className="absolute top-1/2 left-1 size-2 -translate-y-1/2 rounded-full bg-blue-500" />
      )}

      <div className="flex items-center gap-2 pt-0.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {getInitials(mail.sent_by.name)}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p
                className={`truncate text-sm text-foreground ${!isRead ? "font-bold" : "font-semibold"}`}
              >
                {mail.sent_by?.name ?? "Pengirim Tidak Diketahui"}
              </p>
              {mail.sent_by?.department && (
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  • {mail.sent_by.department}
                </span>
              )}
            </div>
            <p
              className={`truncate text-xs text-foreground/80 ${!isRead ? "font-semibold" : "font-medium"}`}
            >
              {permitTitle}
            </p>
          </div>

          <span className="shrink-0 text-[11px] whitespace-nowrap text-muted-foreground">
            {formatDate(mail.created_at.toString())}
          </span>
        </div>

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

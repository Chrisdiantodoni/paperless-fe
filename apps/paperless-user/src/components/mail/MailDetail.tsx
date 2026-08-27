import {
  Archive,
  MoreHorizontal,
  Star,
  FileText,
  Paperclip,
  X,
  Building2,
} from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Separator } from "@workspace/ui/components/ui/separator"
import { getInitials } from "@workspace/ui/lib/utils"
import { formatDate } from "@workspace/utils"
import type { AllMailProps } from "@workspace/types/mail"

export interface MailDetailProps {
  detail: AllMailProps | null
  isLoading: boolean
  onOpenApproval: () => void
  onClose?: () => void
  showCloseButton?: boolean
}

export function MailDetail({
  detail,
  isLoading,
  onOpenApproval,
  onClose,
  showCloseButton = false,
}: MailDetailProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
        Memuat detail surat...
      </div>
    )
  }

  if (!detail) return null

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

  const permitTitle =
    detail.request_data?.permit_type ||
    detail.request_data?.type?.replace(/_/g, " ") ||
    "Surat Permohonan"

  // Penanganan format tanggal: Range (start_date - end_date) atau Single (date / created_at)
  const reqData = detail.request_data as Record<string, any> | undefined
  const startDate = reqData?.start_date
  const endDate = reqData?.end_date
  const singleDate = reqData?.date

  let displayDates = "-"
  if (startDate && endDate) {
    displayDates =
      startDate === endDate
        ? formatDate(startDate)
        : `${formatDate(startDate)} - ${formatDate(endDate)}`
  } else if (startDate) {
    displayDates = formatDate(startDate)
  } else if (singleDate) {
    displayDates = formatDate(singleDate)
  } else if (detail.created_at) {
    displayDates = formatDate(detail.created_at)
  }

  const reason = reqData?.reason || reqData?.description || "-"
  const senderName = detail.sent_by?.name ?? "Pengirim Tidak Diketahui"

  return (
    <div className="flex h-full flex-col">
      {/* Action Bar */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Tutup"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto p-6 xl:p-8">
        <div className="flex min-w-0 flex-1 flex-col bg-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge
                variant="outline"
                className={`px-2 py-0.5 text-xs font-medium capitalize ${getBadgeClass(
                  detail.status
                )}`}
              >
                {detail.status}
              </Badge>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                {permitTitle}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-mono">{detail.document_number}</span>
                <span>•</span>
                <span>{formatDate(detail.created_at)}</span>
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="my-5" />

          {/* Sender Info */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(senderName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{senderName}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {detail.sent_by?.department && (
                  <span>{detail.sent_by.department}</span>
                )}
                {detail.sent_by?.department && detail.branch?.name && (
                  <span>•</span>
                )}
                {detail.branch?.name && (
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3" />
                    {detail.branch.name}
                  </span>
                )}
              </p>
            </div>
            <p className="shrink-0 text-xs text-muted-foreground">
              kepada HR Operations
            </p>
          </div>

          {/* Approval Action Banner */}
          <div className="mt-5 rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold">Persetujuan</h3>
                <p className="text-xs text-muted-foreground">
                  Tinjau dan proses permohonan ini
                </p>
              </div>
              <Button onClick={onOpenApproval} size="sm">
                Tinjau Permohonan
              </Button>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Jenis Permohonan</dt>
                <dd className="mt-1 text-sm font-medium">{permitTitle}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Tanggal</dt>
                <dd className="mt-1 text-sm font-medium">{displayDates}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Alasan</dt>
                <dd className="mt-1 text-sm font-medium">{reason}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Penerima</dt>
                <dd className="mt-1 text-sm font-medium">HR Operations</dd>
              </div>
            </div>
          </div>

          {/* Body Note */}
          <div className="mt-6 rounded-md bg-muted/10 p-4 text-sm whitespace-pre-wrap text-foreground">
            {`Yth. HR Operations,\n\nSaya ingin mengajukan ${permitTitle.toLowerCase()}.\n\nPeriode: ${displayDates}\nAlasan: ${reason}\n\nMohon ditinjau dan beri tahu saya jika ada informasi tambahan yang dibutuhkan.\n\nTerima kasih,\n${senderName}`}
          </div>

          {/* Attachments Section */}
          {Array.isArray(reqData?.attachments) &&
            reqData.attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium">
                  Lampiran ({reqData.attachments.length})
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {reqData.attachments.map((file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      <span>{file.name || `Lampiran-${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

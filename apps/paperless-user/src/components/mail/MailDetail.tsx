import {
  Archive,
  MoreHorizontal,
  Star,
  FileText,
  Paperclip,
  Calendar,
  X,
  Clock,
  UserCheck,
  Building2,
  Download,
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

  const req = detail.request_data
  const senderName = detail.sent_by?.name ?? "Pengirim Tidak Diketahui"

  // Resolusi Judul Permohonan
  const resolveTitle = () => {
    switch (req.type) {
      case "leave_request":
        return req.leave_type ? `Cuti: ${req.leave_type}` : "Permohonan Cuti"
      case "permit_request":
        return req.permit_type ?? "Izin Kerja"
      case "absence_request":
        return "Permohonan Ketidakhadiran"
      case "overtime_request":
        return "Permohonan Lembur (Overtime)"
      case "dynamic_form":
        return "Formulir Khusus"
      default:
        return "Surat Permohonan"
    }
  }

  // Resolusi Tanggal Pelaksanaan
  const resolveDateText = () => {
    if (req.start_date && req.end_date) {
      return req.start_date === req.end_date
        ? formatDate(req.start_date)
        : `${formatDate(req.start_date)} – ${formatDate(req.end_date)}`
    }
    if (req.start_date) return formatDate(req.start_date)
    if (req.date) return formatDate(req.date)
    return formatDate(detail.created_at)
  }

  // Resolusi Waktu Jam (Khusus Permit)
  const resolveTimeDetails = () => {
    if (req.start_work_at) return `Mulai Masuk: ${req.start_work_at}`
    if (req.end_work_at) return `Pulang Jam: ${req.end_work_at}`
    if (req.exit_time || req.return_time) {
      return `Keluar: ${req.exit_time ?? "-"} s/d Kembali: ${req.return_time ?? "-"}`
    }
    return null
  }

  const title = resolveTitle()
  const dateRange = resolveDateText()
  const timeDetails = resolveTimeDetails()
  const reason = req.reason || req.notes || "-"

  return (
    <div className="flex h-full flex-col">
      {/* Action Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3.5">
        <div className="flex items-center gap-2">
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Tutup"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          )}
          <span className="font-mono text-xs text-muted-foreground">
            {detail.document_number}
          </span>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 overflow-y-auto p-6 xl:p-8">
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Status & Judul Dokumen */}
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
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                <span>Dibuat pada {formatDate(detail.created_at)}</span>
                {detail.branch?.name && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3" />
                      {detail.branch.name}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Profil Pengirim */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(senderName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {senderName}
              </p>
              <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                {detail.sent_by.position && (
                  <span>{detail.sent_by.position}</span>
                )}
                {detail.sent_by.department && (
                  <span>• {detail.sent_by.department}</span>
                )}
                {detail.sent_by.branch && (
                  <span>• {detail.sent_by.branch}</span>
                )}
              </p>
            </div>
          </div>

          {/* Banner Tombol Aksi Persetujuan */}
          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4">
            <div>
              <h3 className="text-sm font-semibold">Tinjau Permohonan</h3>
              <p className="text-xs text-muted-foreground">
                Beri persetujuan atau catatan revisi untuk permohonan ini.
              </p>
            </div>
            <Button onClick={onOpenApproval} size="sm">
              Review Request
            </Button>
          </div>

          {/* Detail Ringkasan Permohonan */}
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">
                  Jenis Permohonan
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {title}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">
                  Periode / Tanggal
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  {dateRange}
                </dd>
              </div>

              {timeDetails && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Keterangan Jam
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Clock className="size-3.5 text-muted-foreground" />
                    {timeDetails}
                  </dd>
                </div>
              )}

              {typeof req.quota_deducted === "number" && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Potong Kuota Cuti
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {req.quota_deducted} Hari
                  </dd>
                </div>
              )}

              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">
                  Alasan / Catatan
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {reason}
                </dd>
              </div>
            </div>
          </div>

          {/* Tabel Detail Lembur (Jika mail_type = overtime_request) */}
          {req.type === "overtime_request" &&
            Array.isArray(req.table_details) && (
              <div className="mt-6">
                <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Daftar Staf Lembur ({req.table_details.length})
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="p-2.5 font-medium">Nama Staf</th>
                        <th className="p-2.5 font-medium">Jabatan</th>
                        <th className="p-2.5 font-medium">Tanggal</th>
                        <th className="p-2.5 font-medium">Jam</th>
                        <th className="p-2.5 font-medium">Alasan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {req.table_details.map((staff) => (
                        <tr key={staff.id} className="hover:bg-muted/20">
                          <td className="p-2.5 font-medium text-foreground">
                            {staff.fullname}
                          </td>
                          <td className="p-2.5 text-muted-foreground">
                            {staff.position}
                          </td>
                          <td className="p-2.5 whitespace-nowrap">
                            {formatDate(staff.date)}
                          </td>
                          <td className="p-2.5 whitespace-nowrap">
                            {staff.start_time} - {staff.end_time}
                          </td>
                          <td className="p-2.5 text-muted-foreground">
                            {staff.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Alur Penyetuju / Penerima (Recipients) */}
          {Array.isArray(detail.recipients) && detail.recipients.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <UserCheck className="size-3.5" />
                Daftar Persetujuan
              </h4>
              <div className="space-y-2">
                {detail.recipients.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between rounded-md border border-border bg-card p-3 text-xs"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {rec.sequence}. {rec.name ?? "Approver"}
                      </p>
                      <p className="text-muted-foreground">
                        {rec.position ?? "-"} • {rec.department ?? "-"}
                      </p>
                      {rec.notes && (
                        <p className="mt-1 text-muted-foreground italic">
                          Catatan: &ldquo;{rec.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`px-1.5 py-0 text-[10px] capitalize ${getBadgeClass(
                        rec.status
                      )}`}
                    >
                      {rec.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lampiran File (Attachments dari S3) */}
          {Array.isArray(detail.attachments) &&
            detail.attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Lampiran ({detail.attachments.length})
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {detail.attachments.map((file) => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-border bg-background p-3 text-xs transition-colors hover:bg-muted/50"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Paperclip className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                        <span className="truncate font-medium text-foreground">
                          {file.file_name}
                        </span>
                      </div>
                      <Download className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

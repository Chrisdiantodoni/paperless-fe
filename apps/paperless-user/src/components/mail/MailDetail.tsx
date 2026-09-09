import {
  FileText,
  Calendar,
  X,
  User,
  Mail,
  Edit,
  Send,
  RotateCcw,
  Loader2,
} from "lucide-react"
import { AttachmentItem } from "./AttachmentItem"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Avatar, AvatarFallback } from "@workspace/ui/components/ui/avatar"
import { getInitials } from "@workspace/ui/lib/utils"
import { formatDate } from "@workspace/utils"
import type { AllMailProps } from "@workspace/types/mail"

export interface MailDetailProps {
  detail: AllMailProps | null
  isLoading: boolean
  isSendingMail?: boolean
  isRevisingMail?: boolean
  isApprovingMail?: boolean
  isRejectingMail?: boolean
  onApprove?: () => void
  onReject?: () => void
  onEdit?: () => void
  onSend?: () => void
  onRevise?: () => void
  onClose?: () => void
  showCloseButton?: boolean
}

export function MailDetail({
  detail,
  isLoading,
  isSendingMail = false,
  isRevisingMail = false,
  isApprovingMail = false,
  isRejectingMail = false,
  onApprove,
  onReject,
  onEdit,
  onSend,
  onRevise,
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
    if (req.date) return formatDate(req.date.toString())
    return formatDate(detail.created_at.toString())
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

  const approvedCount =
    detail.recipients?.filter((r) => r.status === "approved").length || 0
  const totalApprovers = detail.recipients?.length || 0

  const isEditable =
    detail.status.toLowerCase() === "pending" ||
    detail.status.toLowerCase() === "draft" ||
    detail.status.toLowerCase() === "revision"

  const isSendable = detail.status.toLowerCase() === "draft"
  const isSendMail = detail.status.toLowerCase() === "sent"
  const isRevisable =
    detail.status.toLowerCase() === "revision" ||
    detail.status.toLowerCase() === "rejected"

  console.log(isEditable, detail.status)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
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

      {/* 2-Column Layout */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left Column - Summary Card (Sticky) */}
          <div>
            <Card className="sticky top-0">
              <CardHeader className="pb-4">
                <Badge
                  variant="outline"
                  className={`w-fit text-xs font-medium capitalize ${getBadgeClass(detail.status)}`}
                >
                  {detail.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{senderName}</div>
                    <div className="text-sm text-muted-foreground">
                      {detail.sent_by.position || "Staff"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">
                        Jenis Permintaan
                      </div>
                      <div className="text-sm font-medium">{title}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">
                        Nomor Surat
                      </div>
                      <div className="text-sm font-medium">
                        {detail.document_number}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">
                        Tanggal Dibuat
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(detail.created_at.toString())}
                      </div>
                    </div>
                  </div>

                  {totalApprovers > 0 && (
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">
                          Persetujuan
                        </div>
                        <div className="text-sm font-medium">
                          {approvedCount} dari {totalApprovers} menyetujui
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="space-y-4">
                    {/* Primary Action - Approve/Reject */}
                    {isSendMail && (onApprove || onReject) && (
                      <div className="space-y-2">
                        {onApprove && (
                          <Button
                            onClick={onApprove}
                            disabled={isApprovingMail}
                            variant="default"
                            className="w-full"
                            size="sm"
                          >
                            {isApprovingMail ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Menyetujui...
                              </>
                            ) : (
                              "Setujui"
                            )}
                          </Button>
                        )}
                        {onReject && (
                          <Button
                            onClick={onReject}
                            disabled={isRejectingMail}
                            variant="destructive"
                            className="w-full"
                            size="sm"
                          >
                            {isRejectingMail ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Menolak...
                              </>
                            ) : (
                              "Tolak"
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Mail Actions */}
                    {(isSendable || isRevisable) && (
                      <div className="space-y-2">
                        {isSendable && onSend && (
                          <Button
                            onClick={onSend}
                            disabled={isSendingMail}
                            variant="default"
                            className="w-full gap-2"
                            size="sm"
                          >
                            {isSendingMail ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Mengirim...
                              </>
                            ) : (
                              <>
                                <Send className="size-4" />
                                Send Mail
                              </>
                            )}
                          </Button>
                        )}
                        {isRevisable && onRevise && (
                          <Button
                            onClick={onRevise}
                            disabled={isRevisingMail}
                            variant="default"
                            className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            {isRevisingMail ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Mengirim Revisi...
                              </>
                            ) : (
                              <>
                                <RotateCcw className="size-4" />
                                Revise Mail
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Edit Action */}
                    {isEditable && onEdit && (
                      <Button
                        onClick={onEdit}
                        variant="outline"
                        className="w-full gap-2"
                        size="sm"
                      >
                        <Edit className="size-4" />
                        Edit Mail
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Request Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Permintaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Periode / Tanggal
                    </div>
                    <div className="mt-1 text-sm">{dateRange}</div>
                  </div>

                  {timeDetails && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Keterangan Jam
                      </div>
                      <div className="mt-1 text-sm">{timeDetails}</div>
                    </div>
                  )}

                  {typeof req.quota_deducted === "number" && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Potong Kuota Cuti
                      </div>
                      <div className="mt-1 text-sm">
                        {req.quota_deducted} Hari
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Alasan / Catatan
                    </div>
                    <div className="mt-1 text-sm">{reason}</div>
                  </div>
                </div>

                {req.type === "overtime_request" &&
                  Array.isArray(req.table_details) && (
                    <div className="mt-6">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">
                        Daftar Staf Lembur ({req.table_details.length})
                      </div>
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
              </CardContent>
            </Card>

            {/* Approval Flow Card */}
            {Array.isArray(detail.recipients) &&
              detail.recipients.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Persetujuan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {detail.recipients.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {rec.sequence}. {rec.name ?? "Approver"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {rec.position ?? "-"} • {rec.department ?? "-"}
                            </div>
                            {rec.notes && (
                              <div className="mt-1 text-xs text-muted-foreground italic">
                                Catatan: &ldquo;{rec.notes}&rdquo;
                              </div>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`ml-3 text-xs capitalize ${getBadgeClass(rec.status)}`}
                          >
                            {rec.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Attachments Card */}
            {Array.isArray(detail.attachments) &&
              detail.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Lampiran ({detail.attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {detail.attachments.map((file) => (
                        <AttachmentItem
                          key={file.id}
                          file={{
                            id: file.id,
                            name: file.file_name,
                            url: file.file_url,
                          }}
                          mode="view"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

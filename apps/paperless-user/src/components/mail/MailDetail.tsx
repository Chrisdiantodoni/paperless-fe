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
import type { AllMailProps, Recipient } from "@workspace/types/mail"
import { useUser } from "@/hooks/queries/use-user"

/**
 * Helper function untuk menentukan apakah user dapat melakukan approval
 * @param recipients - Array of recipients from mail detail
 * @param currentUserId - ID of currently logged-in user
 * @returns Object dengan status approval permission
 */
function getApproverStatus(
  recipients: Recipient[],
  currentUserId: string
): {
  canApprove: boolean
  reason?:
    | "not_in_approval_list"
    | "already_responded"
    | "waiting_for_previous_approver"
    | "not_primary_recipient"
  currentStatus?: string
  sequence?: number
  recipient?: Recipient
} {
  if (!recipients.length || !currentUserId) {
    return { canApprove: false, reason: "not_in_approval_list" }
  }

  const currentUserRecipient = recipients.find(
    (r) => r.recipient_user_id === currentUserId
  )

  if (!currentUserRecipient) {
    return { canApprove: false, reason: "not_in_approval_list" }
  }

  if (currentUserRecipient.recipient_type !== "to") {
    return { canApprove: false, reason: "not_primary_recipient" }
  }

  if (currentUserRecipient.status.toLowerCase() !== "pending") {
    return {
      canApprove: false,
      reason: "already_responded",
      currentStatus: currentUserRecipient.status,
    }
  }

  const hasUnapprovedPreviousApprover = recipients.some(
    (r) =>
      r.sequence < currentUserRecipient.sequence &&
      r.recipient_type === "to" &&
      r.status.toLowerCase() !== "approved"
  )

  if (hasUnapprovedPreviousApprover) {
    return {
      canApprove: false,
      reason: "waiting_for_previous_approver",
    }
  }

  return {
    canApprove: true,
    sequence: currentUserRecipient.sequence,
    recipient: currentUserRecipient,
  }
}

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
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
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
    const formatTime = (time: string | null | undefined) => {
      if (!time) return "-"
      return time.slice(0, 5)
    }

    if (req.start_work_at)
      return `Mulai Masuk: ${formatTime(req.start_work_at)}`
    if (req.end_work_at) return `Pulang Jam: ${formatTime(req.end_work_at)}`
    if (req.exit_time || req.return_time) {
      return `Keluar: ${formatTime(req.exit_time)} s/d Kembali: ${formatTime(req.return_time)}`
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

  const { data: userData } = useUser()
  const currentUserId = userData.hris_user_id || ""

  const readIndicatorId = userData.id

  const approverStatus = getApproverStatus(
    detail.recipients || [],
    currentUserId
  )

  const canShowApprovalButtons = isSendMail && approverStatus.canApprove

  console.log(approverStatus)

  const toRecipients = (detail.recipients || [])
    .filter((r) => r.recipient_type === "to")
    .sort((a, b) => a.sequence - b.sequence)

  const superiorRecipients = (detail.recipients || [])
    .filter((r) => r.recipient_type === "superior")
    .sort((a, b) => a.sequence - b.sequence)

  const ccRecipients = (detail.recipients || [])
    .filter((r) => r.recipient_type === "cc")
    .sort((a, b) => a.sequence - b.sequence)

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
                    {canShowApprovalButtons && (onApprove || onReject) && (
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
                        {onRevise && (
                          <Button
                            onClick={onRevise}
                            disabled={isRevisingMail}
                            variant="default"
                            className="w-full gap-2 bg-blue-800 hover:bg-blue-900"
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

                    {/* Informational message ketika tombol approval tidak ditampilkan */}
                    {isSendMail && !canShowApprovalButtons && (
                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          {approverStatus.reason === "not_in_approval_list" &&
                            "Anda bukan bagian dari alur persetujuan surat ini."}
                          {approverStatus.reason === "already_responded" &&
                            `Anda sudah ${
                              approverStatus.currentStatus?.toLowerCase() ===
                              "approved"
                                ? "menyetujui"
                                : approverStatus.currentStatus?.toLowerCase() ===
                                    "rejected"
                                  ? "menolak"
                                  : approverStatus.currentStatus?.toLowerCase() ===
                                      "revision"
                                    ? "meminta revisi untuk"
                                    : "merespons"
                            } surat ini.`}
                          {approverStatus.reason ===
                            "waiting_for_previous_approver" &&
                            "Menunggu persetujuan dari approver sebelumnya."}
                          {approverStatus.reason === "not_primary_recipient" &&
                            "Anda hanya sebagai penerima tembusan/diketahui, tidak dapat melakukan approval."}
                        </p>
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
                    <div className="space-y-6">
                      {/* Group 1: Kepada (TO) */}
                      {toRecipients.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                            Kepada ({toRecipients.length})
                          </h4>
                          <div className="space-y-3">
                            {toRecipients.map((rec) => {
                              const isCurrentUser =
                                rec.recipient_user_id === currentUserId
                              const isActiveApprover =
                                isCurrentUser &&
                                rec.status?.toLowerCase() === "pending"

                              return (
                                <div
                                  key={rec.id}
                                  className={`flex items-center justify-between rounded-lg border p-3 ${
                                    isActiveApprover
                                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                      : "border-border"
                                  }`}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {rec.sequence}. {rec.name ?? "Approver"}
                                      </span>
                                      {isCurrentUser && (
                                        <Badge
                                          variant="outline"
                                          className="px-1.5 py-0 text-[10px]"
                                        >
                                          Anda
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {rec.position ?? "-"} •{" "}
                                      {rec.department ?? "-"}
                                    </div>
                                    {rec.notes && (
                                      <div
                                        className={`mt-1 text-xs italic ${
                                          rec.status?.toLowerCase() ===
                                          "revision"
                                            ? "font-medium text-orange-700 dark:text-orange-400"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        Catatan: &ldquo;{rec.notes}&rdquo;
                                      </div>
                                    )}
                                    {(rec.approved_at ||
                                      rec.rejected_at ||
                                      rec.revision_requested_at) && (
                                      <div className="mt-1 text-[10px] text-muted-foreground">
                                        {rec.approved_at &&
                                          `Disetujui: ${formatDate(rec.approved_at)}`}
                                        {rec.rejected_at &&
                                          `Ditolak: ${formatDate(rec.rejected_at)}`}
                                        {rec.revision_requested_at &&
                                          `Revisi diminta: ${formatDate(rec.revision_requested_at)}`}
                                      </div>
                                    )}
                                  </div>
                                  {rec.status && (
                                    <Badge
                                      variant="outline"
                                      className={`ml-3 text-xs capitalize ${getBadgeClass(rec.status)}`}
                                    >
                                      {rec.status}
                                    </Badge>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Group 2: Diketahui (SUPERIOR) */}
                      {superiorRecipients.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                            Diketahui ({superiorRecipients.length})
                          </h4>
                          <div className="space-y-3">
                            {superiorRecipients.map((rec) => {
                              const isCurrentUser =
                                rec.recipient_user_id === currentUserId

                              return (
                                <div
                                  key={rec.id}
                                  className="flex items-center justify-between rounded-lg border border-border p-3"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {rec.sequence}. {rec.name ?? "Approver"}
                                      </span>
                                      {isCurrentUser && (
                                        <Badge
                                          variant="outline"
                                          className="px-1.5 py-0 text-[10px]"
                                        >
                                          Anda
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {rec.position ?? "-"} •{" "}
                                      {rec.department ?? "-"}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Group 3: Tembusan (CC) */}
                      {ccRecipients.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                            Tembusan ({ccRecipients.length})
                          </h4>
                          <div className="space-y-3">
                            {ccRecipients.map((rec) => {
                              const isCurrentUser =
                                rec.recipient_user_id === currentUserId

                              return (
                                <div
                                  key={rec.id}
                                  className="flex items-center justify-between rounded-lg border border-border p-3"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {rec.sequence}. {rec.name ?? "Approver"}
                                      </span>
                                      {isCurrentUser && (
                                        <Badge
                                          variant="outline"
                                          className="px-1.5 py-0 text-[10px]"
                                        >
                                          Anda
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {rec.position ?? "-"} •{" "}
                                      {rec.department ?? "-"}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
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

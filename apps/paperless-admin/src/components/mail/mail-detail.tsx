import {
  FileText,
  Calendar,
  X,
  User,
  Edit,
  Send,
  Loader2,
  Circle,
  CheckCircle2,
  XCircle,
  Eye,
  FilePlus,
  MessageSquare,
  Users,
  UserCheck,
  Copy,
} from "lucide-react"
import { AttachmentItem } from "./attachment-item"
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
import type {
  AllMailProps,
  MailTemplateType,
  Recipient,
} from "@workspace/types/mail"
import { useUser } from "@/hooks/queries/use-user"
import { DocumentPreview } from "@workspace/ui/components/editor"

import { ApproveDialog } from "./dialog/approve-dialog"
import { CancelDialog } from "./dialog/cancel-dialog"
import {
  EditRecipientDialog,
  type UpdateRecipientsBody,
} from "./dialog/edit-recipient-dialog"

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

  if (
    currentUserRecipient.recipient_type !== "to" &&
    currentUserRecipient.recipient_type !== "superior"
  ) {
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
      (r.recipient_type === "to" || r.recipient_type === "superior") &&
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

const getLogActionLabel = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATED":
      return "Dibuat"
    case "READ":
      return "Dibaca"
    case "SENT":
      return "Dikirim"
    case "REVISION":
      return "Revisi Diminta"
    case "APPROVED":
      return "Disetujui"
    case "REJECTED":
      return "Ditolak"
    default:
      return action
  }
}

const getLogIcon = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATED":
      return FilePlus
    case "READ":
      return Eye
    case "SENT":
      return Send
    case "REVISION":
      return MessageSquare
    case "APPROVED":
      return CheckCircle2
    case "REJECTED":
      return XCircle
    default:
      return Circle
  }
}

const getLogColor = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATED":
      return "text-blue-600 dark:text-blue-400"
    case "READ":
      return "text-gray-600 dark:text-gray-400"
    case "SENT":
      return "text-blue-600 dark:text-blue-400"
    case "REVISION":
      return "text-orange-600 dark:text-orange-400"
    case "APPROVED":
      return "text-emerald-600 dark:text-emerald-400"
    case "REJECTED":
      return "text-rose-600 dark:text-rose-400"
    default:
      return "text-muted-foreground"
  }
}

export const getBadgeClass = (status?: string) => {
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

function StatusBadge({
  status,
  className = "",
}: {
  status?: string
  className?: string
}) {
  if (!status) return null
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium capitalize ${getBadgeClass(status)} ${className}`}
    >
      {status}
    </Badge>
  )
}

/** Satu baris penerima (approver / tembusan), dipakai ulang di tiap grup. */
function RecipientRow({
  rec,
  currentUserId,
  logs,
  showCancelAction = false,
  showApproveOnBehalfAction = false,
  onCancelRecipient,
  onApproveOnBehalf,
  mailId,
}: {
  rec: Recipient
  currentUserId: string
  logs: AllMailProps["logs"]
  showCancelAction?: boolean
  showApproveOnBehalfAction?: boolean
  onCancelRecipient?: () => void
  onApproveOnBehalf?: () => void
  mailId: string
}) {
  const isCurrentUser = rec.recipient_user_id === currentUserId
  const isActiveApprover =
    isCurrentUser && rec.status?.toLowerCase() === "pending"

  const revisionLogs = (logs || []).filter(
    (log) =>
      log.action.toUpperCase() === "REVISION" &&
      log.performed_by.id === rec.recipient_user_id
  )

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
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
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              Anda
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {rec.position ?? "-"} • {rec.department ?? "-"}
        </div>
        {rec.notes && (
          <div
            className={`mt-1 text-xs italic ${
              rec.status?.toLowerCase() === "revision"
                ? "font-medium text-orange-700 dark:text-orange-400"
                : "text-muted-foreground"
            }`}
          >
            Catatan: &ldquo;{rec.notes}&rdquo;
          </div>
        )}
        {revisionLogs.map((log) => (
          <div
            key={log.id}
            className="mt-1 text-xs font-medium text-orange-700 italic dark:text-orange-400"
          >
            Catatan Revisi: &ldquo;{log.notes}&rdquo;
          </div>
        ))}
        {(rec.approved_at || rec.rejected_at || rec.revision_requested_at) && (
          <div className="mt-1 text-[10px] text-muted-foreground">
            {rec.approved_at && `Disetujui: ${formatDate(rec.approved_at)}`}
            {rec.rejected_at && `Ditolak: ${formatDate(rec.rejected_at)}`}
            {rec.revision_requested_at &&
              `Revisi diminta: ${formatDate(rec.revision_requested_at)}`}
          </div>
        )}
      </div>
      <div className="ml-3 flex items-center gap-2">
        <StatusBadge status={rec.status} />
        {showCancelAction && onCancelRecipient && (
          <CancelDialog mailId={mailId} />
        )}
        {showApproveOnBehalfAction && onApproveOnBehalf && (
          <ApproveDialog mailId={mailId} />
        )}
      </div>
    </div>
  )
}

/** Grup penerima (Kepada / Diketahui / Tembusan) dengan header yang menjelaskan perannya. */
function RecipientGroup({
  label,
  icon: Icon,
  recipients,
  currentUserId,
  logs,
  cancelRecipientId,
  approveOnBehalfId,
  onCancelRecipient,
  onApproveOnBehalf,
  mailId,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  recipients: Recipient[]
  currentUserId: string
  logs: AllMailProps["logs"]
  cancelRecipientId?: string
  approveOnBehalfId?: string
  onCancelRecipient?: (recipientId: string) => void
  onApproveOnBehalf?: (recipientId: string) => void
  mailId: string
}) {
  if (recipients.length === 0) return null
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        {label}
        <span className="font-normal text-muted-foreground">
          ({recipients.length})
        </span>
      </div>
      <div className="space-y-3">
        {recipients.map((rec) => (
          <RecipientRow
            key={rec.id}
            rec={rec}
            currentUserId={currentUserId}
            logs={logs}
            showCancelAction={rec.id === cancelRecipientId}
            showApproveOnBehalfAction={rec.id === approveOnBehalfId}
            onCancelRecipient={() => onCancelRecipient?.(rec.id)}
            onApproveOnBehalf={() => onApproveOnBehalf?.(rec.id)}
            mailId={mailId}
          />
        ))}
      </div>
    </div>
  )
}

export type EditableRecipient = {
  user_id: string
  user_label?: string
  recipient_type: "superior" | "cc" | "to"
  sequence: number
}

export interface MailDetailProps {
  detail?: AllMailProps
  isLoading: boolean
  isSendingMail?: boolean
  isRevisingMail?: boolean
  isApprovingMail?: boolean
  isRejectingMail?: boolean
  isCancelingRecipient?: boolean
  isApprovingOnBehalf?: boolean
  isEditingRecipients?: boolean
  onApprove?: () => void
  onReject?: () => void
  onCancelRecipient?: (recipientId: string) => void
  onApproveOnBehalf?: (recipientId: string) => void
  onEditRecipients?: (payload: {
    recipients: Array<{
      user_id: string
      recipient_type: "to" | "cc"
      sequence: number
    }>
  }) => Promise<void>
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
  isEditingRecipients = false,
  onApprove,
  onReject,
  onEditRecipients,
  onEdit,
  onSend,
  onRevise,
  onClose,
  showCloseButton = false,
}: MailDetailProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Memuat detail surat...
      </div>
    )
  }

  if (!detail) return null

  const req = detail.request_data
  const senderName = detail.sent_by?.name ?? "Pengirim Tidak Diketahui"
  const senderUserId = detail.sent_by.hris_user_id

  const resolveTitle = () => {
    switch (req.type as MailTemplateType) {
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
      case "non_template":
        return (req as any).description || "Memo Internal"
      case "dynamic_template":
        return "Memo Internal"
      default:
        return "Surat Permohonan"
    }
  }

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

  const approvers =
    detail.recipients?.filter(
      (r) => r.recipient_type === "to" || r.recipient_type === "superior"
    ) || []

  const approvedCount =
    approvers.filter((r) => r.status === "approved").length || 0
  const totalApprovers = approvers.length || 0

  const isEditable =
    detail.status.toLowerCase() === "pending" ||
    detail.status.toLowerCase() === "draft" ||
    detail.status.toLowerCase() === "revision"

  const isSendable = detail.status.toLowerCase() === "draft"
  const isSendMail = detail.status.toLowerCase() === "sent"

  const { data: userData } = useUser()
  const currentUserId = userData.hris_user_id || ""
  const isCurrentUser = senderUserId === currentUserId

  const approverStatus = getApproverStatus(
    detail.recipients || [],
    currentUserId
  )
  const canShowApprovalButtons = isSendMail && approverStatus.canApprove
  const canShowRecipientActions = !["approved", "rejected"].includes(
    detail.status.toLowerCase()
  )
  const orderedRecipients = [...(detail.recipients || [])].sort(
    (a, b) => a.sequence - b.sequence
  )
  const lastActionRecipient = [...orderedRecipients]
    .reverse()
    .find((recipient) =>
      ["approved", "revision"].includes(recipient.status.toLowerCase())
    )
  const firstPendingRecipient = orderedRecipients.find(
    (recipient) =>
      (recipient.recipient_type === "to" ||
        recipient.recipient_type === "superior") &&
      recipient.status.toLowerCase() === "pending"
  )
  const hasRevisionBeforePending = firstPendingRecipient
    ? orderedRecipients.some(
        (recipient) =>
          recipient.sequence < firstPendingRecipient.sequence &&
          recipient.status.toLowerCase() === "revision"
      )
    : false

  const toRecipients = (detail.recipients || [])
    .filter((r) => r.recipient_type === "to")
    .sort((a, b) => a.sequence - b.sequence)

  const superiorRecipients = (detail.recipients || [])
    .filter((r) => r.recipient_type === "superior")
    .sort((a, b) => a.sequence - b.sequence)

  const ccRecipients = (detail.recipients || [])
    .filter((r) => r.recipient_type === "cc")
    .sort((a, b) => a.sequence - b.sequence)
  const editableRecipients = (detail.recipients || []).map((recipient) => ({
    id: recipient.id,
    user_id: recipient.recipient_user_id,
    user_label: recipient.name,
    user_position: recipient.position,
    recipient_type: recipient.recipient_type,
    sequence: recipient.sequence,
    locked: recipient.recipient_type === "superior",
  }))

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 lg:hidden"
              aria-label="Kembali ke daftar surat"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          )}
          <div className="min-w-0 leading-tight">
            <div className="text-sm font-medium">{title}</div>
            <span className="font-mono text-xs text-muted-foreground">
              {detail.document_number}
            </span>
          </div>
        </div>
        <StatusBadge status={detail.status} />
      </div>

      {/* New Layout: Full Width Content First, Then 2-Column Bottom */}
      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-muted/20 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl min-w-0 space-y-5 sm:space-y-6">
          {/* Full Width Section - Isi Surat */}
          {(req.type === "non_template" || req.type === "dynamic_template") &&
            req.content && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Isi Surat</CardTitle>
                </CardHeader>
                <CardContent className="min-w-0 overflow-x-hidden p-0">
                  <DocumentPreview html={req.content} />
                </CardContent>
              </Card>
            )}

          {/* Full Width Section - Detail Permintaan (non-template types) */}
          {req.type !== "non_template" && req.type !== "dynamic_template" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detail Permintaan</CardTitle>
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
          )}

          {/* Full Width Section - Data Formulir */}
          {req.type === "dynamic_template" &&
            req.form_schema &&
            (() => {
              let fields: {
                value: string
                label: string
                is_required?: boolean
              }[] = []
              try {
                fields = JSON.parse(req.form_schema!)
              } catch {
                /* ignore */
              }
              return (
                fields.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Data Formulir</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {fields.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between border-b border-border py-2 last:border-0"
                          >
                            <span className="text-sm text-muted-foreground">
                              {f.label}
                              {f.is_required && (
                                <span className="ml-1 text-destructive">*</span>
                              )}
                            </span>
                            <span className="text-sm font-medium break-all">
                              {f.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )
            })()}

          {/* 2-Column Bottom Section - Summary/Logs + Riwayat/Attachments */}
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            {/* Left Column - Summary & Logs */}
            <div className="min-w-0 space-y-6">
              <Card>
                <CardContent className="space-y-5 pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-11">
                      <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{senderName}</div>
                      <div className="truncate text-sm text-muted-foreground">
                        {detail.sent_by.position || "Staff"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">
                          Jenis Permintaan
                        </div>
                        <div className="text-sm font-medium break-words">
                          {title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">
                          Tanggal Dibuat
                        </div>
                        <div className="text-sm font-medium break-words">
                          {formatDate(detail.created_at.toString())}
                        </div>
                      </div>
                    </div>

                    {totalApprovers > 0 && (
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between">
                            <div className="text-xs text-muted-foreground">
                              Persetujuan
                            </div>
                            <div className="text-xs font-medium">
                              {approvedCount}/{totalApprovers}
                            </div>
                          </div>
                          <div className="mt-1.5 flex gap-1">
                            {approvers.map((a, i) => (
                              <div
                                key={a.id ?? i}
                                className={`h-1.5 flex-1 rounded-full ${
                                  a.status?.toLowerCase() === "approved"
                                    ? "bg-emerald-500"
                                    : a.status?.toLowerCase() === "rejected"
                                      ? "bg-rose-500"
                                      : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 border-t border-border pt-4">
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
                            "Anda hanya sebagai penerima tembusan (CC), tidak dapat melakukan approval."}
                        </p>
                      </div>
                    )}

                    {isCurrentUser && isSendable && onSend && (
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
                            Kirim Surat
                          </>
                        )}
                      </Button>
                    )}

                    {canShowRecipientActions && onEditRecipients && (
                      <EditRecipientDialog
                        initialRecipients={editableRecipients}
                        onSubmit={async (body: UpdateRecipientsBody) => {
                          await onEditRecipients({
                            recipients: body.recipients,
                          })
                        }}
                      />
                    )}
                    {isCurrentUser && isEditable && onEdit && (
                      <Button
                        onClick={onEdit}
                        variant="outline"
                        className="w-full gap-2"
                        size="sm"
                      >
                        <Edit className="size-4" />
                        Ubah Surat
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {Array.isArray(detail.logs) && detail.logs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Riwayat Aktivitas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...detail.logs]
                        .sort(
                          (a, b) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                        )
                        .map((log, index, array) => {
                          const IconComponent = getLogIcon(log.action)
                          const colorClass = getLogColor(log.action)
                          const isLast = index === array.length - 1

                          return (
                            <div key={log.id} className="relative flex gap-3">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-background bg-background ${colorClass}`}
                                >
                                  <IconComponent className="size-3" />
                                </div>
                                {!isLast && (
                                  <div className="w-0.5 flex-1 bg-border" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1 pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">
                                    {getLogActionLabel(log.action)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatDate(log.created_at)}
                                  </span>
                                </div>
                                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                  {log.performed_by.name}
                                  {log.performed_by.position &&
                                    ` • ${log.performed_by.position}`}
                                </div>
                                {log.notes && (
                                  <div
                                    className={`mt-1.5 rounded-md border p-2 text-xs break-words italic ${
                                      log.action.toUpperCase() === "REVISION"
                                        ? "border-orange-500/20 bg-orange-500/5 text-orange-700 dark:text-orange-400"
                                        : "border-border bg-muted/50 text-muted-foreground"
                                    }`}
                                  >
                                    &ldquo;{log.notes}&rdquo;
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Riwayat Persetujuan & Attachments */}
            <div className="min-w-0 space-y-6">
              {Array.isArray(detail.recipients) &&
                detail.recipients.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Riwayat Persetujuan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <RecipientGroup
                          label="Diketahui"
                          icon={Users}
                          recipients={superiorRecipients}
                          currentUserId={currentUserId}
                          logs={detail.logs}
                          cancelRecipientId={
                            canShowRecipientActions
                              ? lastActionRecipient?.id
                              : undefined
                          }
                          approveOnBehalfId={
                            canShowRecipientActions && !hasRevisionBeforePending
                              ? firstPendingRecipient?.id
                              : undefined
                          }
                          mailId={detail.id}
                        />
                        <RecipientGroup
                          label="Kepada"
                          icon={UserCheck}
                          recipients={toRecipients}
                          currentUserId={currentUserId}
                          logs={detail.logs}
                          cancelRecipientId={
                            canShowRecipientActions
                              ? lastActionRecipient?.id
                              : undefined
                          }
                          approveOnBehalfId={
                            canShowRecipientActions && !hasRevisionBeforePending
                              ? firstPendingRecipient?.id
                              : undefined
                          }
                          mailId={detail.id}
                        />
                        <RecipientGroup
                          label="Tembusan"
                          icon={Copy}
                          recipients={ccRecipients}
                          currentUserId={currentUserId}
                          logs={detail.logs}
                          cancelRecipientId={
                            canShowRecipientActions
                              ? lastActionRecipient?.id
                              : undefined
                          }
                          approveOnBehalfId={
                            canShowRecipientActions && !hasRevisionBeforePending
                              ? firstPendingRecipient?.id
                              : undefined
                          }
                          mailId={detail.id}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

              {Array.isArray(detail.attachments) &&
                detail.attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
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
    </div>
  )
}

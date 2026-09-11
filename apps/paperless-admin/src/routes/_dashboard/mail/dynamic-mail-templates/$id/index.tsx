import DynamicTemplateDetail from "@/components/detail/dynamic-template-detail"
import {
  useDeleteDynamicMailTemplateMutation,
  useSubmitForApprovalMutation,
  useApproveDynamicMailTemplateMutation,
  useRejectDynamicMailTemplateMutation,
  useRequestRevisionMutation,
} from "@/hooks/queries/use-dynamic-mail-template"
import { getDynamicMailTemplateById } from "@/server/master"
import {
  createFileRoute,
  useRouter,
  Link,
  useNavigate,
} from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/ui/button"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import {
  ArrowLeft,
  Pencil,
  Trash,
  Send,
  CheckCircle,
  XCircle,
  FileEdit,
} from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { ApprovalStatusBadge } from "@/components/master/dynamic-mail-template/approval-status-badge"
import { ApprovalHistory } from "@/components/master/dynamic-mail-template/approval-history"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"

export const Route = createFileRoute(
  "/_dashboard/mail/dynamic-mail-templates/$id/"
)({
  loader: async ({ params }) => {
    const id = params.id
    const data = await getDynamicMailTemplateById({ data: id })
    return { data }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { data } = Route.useLoaderData()
  const { mutateAsync: deleteMutate } = useDeleteDynamicMailTemplateMutation()
  const { mutateAsync: submitForApproval, isPending: isSubmitting } =
    useSubmitForApprovalMutation()
  const { mutateAsync: approve, isPending: isApproving } =
    useApproveDynamicMailTemplateMutation()
  const { mutateAsync: reject, isPending: isRejecting } =
    useRejectDynamicMailTemplateMutation()
  const { mutateAsync: requestRevision, isPending: isRequestingRevision } =
    useRequestRevisionMutation()

  const navigate = useNavigate()
  const confirm = useConfirm()

  const [revisionModalOpen, setRevisionModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const handleDelete = async () => {
    await confirm({
      title: "Hapus template?",
      description: `Template "${data.name}" akan dihapus permanen.`,
      variant: "destructive",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        try {
          await deleteMutate(data.id)
          toast.success("Template berhasil dihapus")
          navigate({
            to: "/mail/dynamic-mail-templates",
            search: {
              page: 1,
              search: "",
              per_page: 10,
              branch_id: "",
              branch_label: "",
              department_id: "",
              department_label: "",
              position_id: "",
              position_label: "",
              is_active: "",
            },
          })
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Gagal menghapus template"
          )
          throw error
        }
      },
    })
  }

  const handleSubmitForApproval = async () => {
    await confirm({
      title: "Submit untuk Approval?",
      description: "Template akan dikirim untuk proses approval.",
      confirmLabel: "Submit",
      onConfirm: async () => {
        await submitForApproval(data.id)
        router.invalidate()
      },
    })
  }

  const handleApprove = async () => {
    await confirm({
      title: "Approve Template?",
      description: "Template akan di-approve dan dapat digunakan.",
      confirmLabel: "Approve",
      onConfirm: async () => {
        await approve(data.id)
        router.invalidate()
      },
    })
  }

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan wajib diisi")
      return
    }
    await reject({ id: data.id, reason: rejectReason })
    setRejectModalOpen(false)
    setRejectReason("")
    router.invalidate()
  }

  const handleRequestRevision = async (formData: {
    reason: string
    scope_changes?: string[]
  }) => {
    await requestRevision({ id: data.id, data: formData })
    setRevisionModalOpen(false)
    router.invalidate()
  }

  const isDraft = data.approval_status === "draft"
  const isPending = data.approval_status === "pending"
  const isApproved = data.approval_status === "approved"
  const isRejected = data.approval_status === "rejected"

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Kembali
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
            Hapus
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              to="/mail/dynamic-mail-templates/$id/edit"
              params={{ id: data.id }}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Approval Status & Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Status Approval</CardTitle>
            <ApprovalStatusBadge status={data.approval_status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.rejected_reason && isRejected && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm font-medium text-destructive">
                Alasan Ditolak:
              </p>
              <p className="text-sm text-muted-foreground">
                {data.rejected_reason}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(isDraft || isRejected) && (
              <Button
                size="sm"
                onClick={handleSubmitForApproval}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Mengirim..." : "Submit for Approval"}
              </Button>
            )}

            {isPending && (
              <>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={isApproving}
                >
                  <CheckCircle className="h-4 w-4" />
                  {isApproving ? "Memproses..." : "Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={isRejecting}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRevisionModalOpen(true)}
                  disabled={isRequestingRevision}
                >
                  <FileEdit className="h-4 w-4" />
                  Request Revision
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval History */}
      {data.approval_history && data.approval_history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalHistory history={data.approval_history} />
          </CardContent>
        </Card>
      )}

      <DynamicTemplateDetail data={data} />

      {/* Revision Modal */}

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Template</DialogTitle>
            <DialogDescription>
              Berikan alasan mengapa template ini ditolak.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">
              Alasan Penolakan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Jelaskan mengapa template ini ditolak..."
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={isRejecting}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false)
                setRejectReason("")
              }}
              disabled={isRejecting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={isRejecting || !rejectReason.trim()}
            >
              {isRejecting ? "Memproses..." : "Reject Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

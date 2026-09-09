import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useState } from "react"

import {
  MailHeader,
  MailList,
  MailDetail,
  MailEmptyState,
  ApprovalDialog,
  RejectDialog,
  RevisionDialog,
} from "@/components/mail"
import { useMailData } from "@/hooks/queries/use-mail-data"
import { listRequestQuerySchema } from "@/schema/mail/schema"
import {
  AllDraftMailQueryOptions,
  allMailQueryOptions,
  allSentMailQueryOptions,
  useMailDetail,
  useMailList,
  useSendMail,
  useReviseMail,
  useApproveMail,
  useRejectMail,
} from "@/hooks/queries/use-mails"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { AllMailProps } from "@workspace/types/mail"
import type { MailFilterState } from "@/components/mail/MailHeader"
import { toast } from "sonner"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"

export const Route = createFileRoute("/_dashboard/mail/user-mails/")({
  validateSearch: zodValidator(listRequestQuerySchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    let data: LaravelPaginationData<AllMailProps[]>
    if (search.type === "all") {
      data = await queryClient.ensureQueryData(allMailQueryOptions(search))
    } else if (search.type === "sent") {
      data = await queryClient.ensureQueryData(allSentMailQueryOptions(search))
    } else {
      data = await queryClient.ensureQueryData(AllDraftMailQueryOptions(search))
    }
    return { data }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: initialData } = Route.useLoaderData()
  const search = Route.useSearch()

  const isSent = search.type === "sent"

  const {
    data: mailPagination,
    isFetching,
    refetch,
  } = useMailList(search, initialData)

  const mailDataList = mailPagination.data

  const navigate = Route.useNavigate()

  const {
    activeNav,
    setActiveNav,
    selectedId,
    setSelectedId,
    query,
    setQuery,
    refreshing,
    page,
    setPage,
    approvalNote,
    setApprovalNote,
    approvalOpen,
    setApprovalOpen,
    setShowDetail,
    showDetail,
    setRefreshing,
  } = useMailData(search)

  const { data: mailDetail, isLoading: isLoadingDetail } =
    useMailDetail(selectedId)

  const sendMailMutation = useSendMail()
  const reviseMailMutation = useReviseMail()
  const approveMailMutation = useApproveMail()
  const rejectMailMutation = useRejectMail()

  const [revisionOpen, setRevisionOpen] = useState(false)
  const [revisionReason, setRevisionReason] = useState("")
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const confirm = useConfirm()

  const handleClose = () => {
    setSelectedId(null)
    setShowDetail(false)
  }

  const handleNavChange = (nav: "all" | "sent" | "draft") => {
    setActiveNav(nav)
    navigate({
      search: (prev) => ({
        ...prev,
        type: nav,
        page: 1,
      }),
    })
  }

  const handleFiltersChange = (filters: MailFilterState) => {
    navigate({
      search: (prev) => ({
        ...prev,
        request_type: filters.request_type ?? undefined,
        status: filters.status ?? undefined,
        start_date: filters.start_date ?? undefined,
        end_date: filters.end_date ?? undefined,
        sort_by: filters.sort_by,
        sort_dir: filters.sort_dir,
        page: 1,
      }),
    })
  }

  const filters: MailFilterState = {
    request_type: search.request_type,
    status: search.status,
    start_date: search.start_date,
    end_date: search.end_date,
    sort_by: search.sort_by,
    sort_dir: search.sort_dir,
  }

  const handlePageChange = (page: number) => {
    setPage(page)
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch()
    setRefreshing(false)
  }

  const handleMailClick = async (id: string) => {
    setSelectedId(id)
    setShowDetail(true)
  }

  const handleEdit = () => {
    if (selectedId) {
      navigate({
        to: "/mail/user-mails/$mailId/edit",
        params: { mailId: String(selectedId) },
      })
    }
  }

  const handleSend = async () => {
    if (selectedId) {
      const confirmed = await confirm({
        title: "Konfirmasi Kirim Mail",
        description: "Apakah Anda yakin ingin mengirim mail ini?",
      })
      if (confirmed) {
        sendMailMutation.mutate(selectedId, {
          onSuccess: () => {
            handleClose()
            toast.success("Mail dikirim")
          },
        })
      }
    }
  }

  const handleRevise = () => {
    setRevisionOpen(true)
  }

  const submitRevision = () => {
    if (selectedId && revisionReason.trim()) {
      reviseMailMutation.mutate(
        { id: selectedId, reason: revisionReason },
        {
          onSuccess: () => {
            setRevisionOpen(false)
            setRevisionReason("")
            toast.success("Revisi dikirim")
            handleClose()
          },
        }
      )
    }
  }

  const handleApprove = () => {
    setApprovalOpen(true)
  }

  const submitApproval = () => {
    if (selectedId) {
      approveMailMutation.mutate(
        { id: selectedId, notes: approvalNote || undefined },
        {
          onSuccess: () => {
            setApprovalOpen(false)
            setApprovalNote("")
            toast.success("Surat disetujui")
            handleClose()
          },
        }
      )
    }
  }

  const handleReject = () => {
    setRejectOpen(true)
  }

  const submitRejection = () => {
    if (selectedId && rejectReason.trim()) {
      rejectMailMutation.mutate(
        { id: selectedId, reason: rejectReason },
        {
          onSuccess: () => {
            setRejectOpen(false)
            setRejectReason("")
            toast.success("Surat ditolak")
            handleClose()
          },
        }
      )
    }
  }

  const closeApprovalDialog = () => {
    setApprovalOpen(false)
    setApprovalNote("")
  }

  const closeRejectDialog = () => {
    setRejectOpen(false)
    setRejectReason("")
  }

  const closeRevisionDialog = () => {
    setRevisionOpen(false)
    setRevisionReason("")
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <MailHeader
        activeNav={activeNav}
        query={query}
        refreshing={refreshing}
        filters={filters}
        onNavChange={handleNavChange}
        onQueryChange={setQuery}
        onRefresh={handleRefresh}
        onFiltersChange={handleFiltersChange}
        onCompose={() => {}}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch">
        <div
          className={`w-full shrink-0 border-b border-border lg:block lg:w-[360px] lg:border-r lg:border-b-0 xl:w-[400px] ${
            showDetail ? "hidden" : "flex flex-col"
          }`}
        >
          <MailList
            isLoading={isFetching}
            pageCount={mailPagination.last_page}
            pageSize={mailPagination.per_page}
            mails={mailPagination}
            page={page}
            selectedId={selectedId}
            onPageChange={handlePageChange}
            onItemClick={handleMailClick}
          />
        </div>

        <article
          className={`min-w-0 flex-1 lg:block ${showDetail ? "block" : "hidden"}`}
        >
          {selectedId ? (
            <MailDetail
              detail={mailDetail!}
              isLoading={isLoadingDetail}
              isSendingMail={sendMailMutation.isPending}
              isRevisingMail={reviseMailMutation.isPending}
              isApprovingMail={approveMailMutation.isPending}
              isRejectingMail={rejectMailMutation.isPending}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              onSend={handleSend}
              onRevise={handleRevise}
              onClose={handleClose}
              showCloseButton
            />
          ) : (
            <MailEmptyState />
          )}
        </article>
      </div>

      <ApprovalDialog
        open={approvalOpen}
        approvalNote={approvalNote}
        onNoteChange={setApprovalNote}
        onClose={closeApprovalDialog}
        onApprove={submitApproval}
      />

      <RejectDialog
        open={rejectOpen}
        rejectReason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeRejectDialog}
        onSubmit={submitRejection}
      />

      <RevisionDialog
        open={revisionOpen}
        revisionReason={revisionReason}
        onReasonChange={setRevisionReason}
        onClose={closeRevisionDialog}
        onSubmit={submitRevision}
      />
    </main>
  )
}

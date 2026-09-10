import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useState, useEffect } from "react"

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
import { useDebounce } from "@workspace/utils"
import { useUser } from "@/hooks/queries/use-user"
import { isMailReadByUser } from "@/utils/mail-helpers"
import { useQueryClient } from "@tanstack/react-query"

export const Route = createFileRoute("/_dashboard/mail/user-mails/")({
  validateSearch: zodValidator(listRequestQuerySchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    let data: LaravelPaginationData<AllMailProps[]> | undefined
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

  const {
    data: mailPagination,
    isFetching,
    refetch,
  } = useMailList(search, initialData)

  const navigate = Route.useNavigate()
  console.log(initialData)

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

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: debouncedQuery || undefined,
        page: 1,
      }),
    })
  }, [debouncedQuery])

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

  const { data: userData } = useUser()
  const currentUserId = userData.id || ""
  const queryClient = useQueryClient()

  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (mailPagination?.data) {
      const readIds = new Set<string>()
      mailPagination.data.forEach((mail: AllMailProps) => {
        if (isMailReadByUser(mail, currentUserId)) {
          readIds.add(mail.id)
        }
      })
      setLocalReadIds(readIds)
    }
  }, [mailPagination?.data, currentUserId])

  const handleClose = () => {
    setSelectedId(null)
    setShowDetail(false)
  }

  const handleNavChange = (nav: "all" | "sent" | "draft") => {
    setActiveNav(nav)
    navigate({
      search: {
        ...search,
        type: nav,
        page: 1,
      },
    })
  }

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }

  const handleFiltersChange = (filters: MailFilterState) => {
    navigate({
      search: {
        ...search,
        request_type: filters.request_type as
          | "leave_request"
          | "permit_request"
          | "absence_request"
          | "overtime_request"
          | "dynamic_template"
          | undefined,
        status: filters.status as
          | "Draft"
          | "Sent"
          | "Revision"
          | "Approved"
          | "Rejected"
          | undefined,
        start_date: filters.start_date ?? undefined,
        end_date: filters.end_date ?? undefined,
        sort_by: filters.sort_by as
          | "status"
          | "created_at"
          | "document_number"
          | undefined,
        sort_dir: filters.sort_dir as "asc" | "desc" | undefined,
        page: 1,
      },
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
    queryClient.refetchQueries({ queryKey: ["mail-detail", id] })
    setSelectedId(id)
    setShowDetail(true)
    setLocalReadIds((prev) => new Set(prev).add(id))
  }

  const handleEdit = () => {
    if (!selectedId) return
    const listMail = mailPagination?.data?.find(
      (m) => String(m.id) === String(selectedId)
    )
    const type =
      listMail?.request_data.type ??
      (mailDetail?.success ? mailDetail.data.request_data.type : undefined)
    navigate({
      to:
        type === "non_template"
          ? "/mail/user-mails/$mailId/edit-non-template"
          : "/mail/user-mails/$mailId/edit",
      params: { mailId: String(selectedId) },
    })
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
    <main className="flex h-screen flex-col bg-background text-foreground">
      <MailHeader
        activeNav={activeNav}
        query={query}
        refreshing={refreshing}
        filters={filters}
        onNavChange={handleNavChange}
        onQueryChange={handleQueryChange}
        onRefresh={handleRefresh}
        onFiltersChange={handleFiltersChange}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch">
        <div
          className={`min-h-0 w-full border-b border-border lg:flex lg:w-[360px] lg:flex-col lg:border-r lg:border-b-0 xl:w-[400px] ${
            showDetail ? "hidden" : "flex flex-col"
          }`}
        >
          <MailList
            isLoading={isFetching}
            pageCount={mailPagination?.last_page || 1}
            pageSize={mailPagination?.per_page || 10}
            mails={mailPagination!}
            page={page}
            selectedId={selectedId}
            currentUserId={currentUserId}
            localReadIds={localReadIds}
            onPageChange={handlePageChange}
            onItemClick={handleMailClick}
          />
        </div>

        <article
          className={`min-w-0 flex-1 lg:block ${showDetail ? "block" : "hidden"}`}
        >
          {selectedId ? (
            <MailDetail
              detail={mailDetail?.success ? mailDetail.data : null}
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

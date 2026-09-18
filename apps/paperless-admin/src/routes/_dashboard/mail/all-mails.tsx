import { MailDetail } from "@/components/mail/mail-detail"
import MailemptyState from "@/components/mail/mail-empty-state"
import MailHeader, { type MailFilterState } from "@/components/mail/mail-header"
import { MailList } from "@/components/mail/mail-list"
import {
  mailKeys,
  mailListQueryOptions,
  useMailDetail,
  useMailList,
} from "@/hooks/queries/use-mail"
import { useUser } from "@/hooks/queries/use-user"
import { useDebounce } from "@/hooks/use-debounce"
import { useMailData } from "@/hooks/use-mail-data"
import { listRequestQuerySchema } from "@/schema/mail/schema"
import { isMailReadByUser } from "@/utils/mail-helpers"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import type { AllMailProps } from "@workspace/types/mail"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/_dashboard/mail/all-mails")({
  validateSearch: zodValidator(listRequestQuerySchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    const data = await queryClient.ensureQueryData(mailListQueryOptions(search))
    return { data }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const filters: MailFilterState = {
    request_type: search.request_type,
    status: search.status,
    start_date: search.start_date,
    end_date: search.end_date,
    sort_by: search.sort_by,
    sort_dir: search.sort_dir,
  }
  const { data: initialData } = Route.useLoaderData()
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set())
  const { data: userData } = useUser()
  const currentUserId = userData.id || ""
  const {
    selectedId,
    setSelectedId,
    refreshing,
    setRefreshing,
    page,
    setPage,
    showDetail,
    setShowDetail,
  } = useMailData(search)
  const listSearch = { ...search, page }

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

  const {
    data: mailPagination,
    isFetching,
    refetch,
  } = useMailList(listSearch, page === search.page ? initialData! : undefined)

  const handleRefresh = () => {
    setRefreshing(true)
    refetch()
    setRefreshing(false)
  }

  const { data: mailDetail, isLoading: isLoadingDetail } = useMailDetail(
    selectedId!
  )

  const queryClient = useQueryClient()

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

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  const handleMailClick = async (id: string) => {
    queryClient.refetchQueries({ queryKey: mailKeys.detail(id) })
    setSelectedId(id)
    setShowDetail(true)
    setLocalReadIds((prev) => new Set(prev).add(id))
  }

  const handleCancelRecipient = (recipientId: string) => {
    console.log("Batal Aksi", selectedId, recipientId)
  }

  const handleApproveOnBehalf = (recipientId: string) => {
    console.log("Setujui Atas Nama", selectedId, recipientId)
  }

  const handleEditRecipients = (payload: {
    recipients: {
      user_id: string
      recipient_type: "approver" | "cc" | "to"
      sequence: number
    }[]
  }) => {
    console.log("Edit Recipients", selectedId, payload)
  }

  return (
    <main className="flex h-screen flex-col bg-background text-foreground">
      <PageWrapper className="mx-2 flex min-h-0 flex-1 flex-col space-y-6 px-2 py-4 sm:px-2 lg:px-0">
        <MailHeader
          onRefresh={handleRefresh}
          onFiltersChange={handleFiltersChange}
          filterValue={filters}
          refreshing={refreshing}
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
            className={`min-h-0 flex-1 lg:block ${showDetail ? "block" : "hidden"}`}
          >
            {selectedId ? (
              <MailDetail
                detail={mailDetail}
                isLoading={isLoadingDetail}
                onCancelRecipient={handleCancelRecipient}
                onApproveOnBehalf={handleApproveOnBehalf}
                onEditRecipients={handleEditRecipients}
              />
            ) : (
              <MailemptyState />
            )}
          </article>
        </div>
      </PageWrapper>
    </main>
  )
}

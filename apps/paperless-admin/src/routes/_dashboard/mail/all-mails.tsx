import { MailDetail } from "@/components/mail/mail-detail"
import MailemptyState from "@/components/mail/mail-empty-state"
import MailHeader, { type MailFilterState } from "@/components/mail/mail-header"
import { MailList } from "@/components/mail/mail-list"
import {
  mailKeys,
  mailListQueryOptions,
  useEditMailRecipient,
  useMailDetail,
  useMailList,
} from "@/hooks/queries/use-mail"
import { useUser } from "@/hooks/queries/use-user"
import { useMailData } from "@/hooks/use-mail-data"
import { listRequestQuerySchema } from "@/schema/mail/schema"
import { isMailReadByUser } from "@/utils/mail-helpers"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import type { AllMailProps } from "@workspace/types/mail"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { Button } from "@workspace/ui/components/ui/button"
import { useSidebar } from "@workspace/ui/components/ui/sidebar"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
  const { setOpen } = useSidebar()

  useEffect(() => {
    setOpen(false)
  }, [setOpen])
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
    isError: isListError,
    error: listError,
    refetch,
  } = useMailList(listSearch, page === search.page ? initialData! : undefined)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const result = await refetch()
      if (result.isError) toast.error("Gagal memuat ulang daftar surat")
    } finally {
      setRefreshing(false)
    }
  }

  const {
    data: mailDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useMailDetail(selectedId!)

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
    await queryClient.refetchQueries({ queryKey: mailKeys.detail(id) })
    setSelectedId(id)
    setShowDetail(true)
    setLocalReadIds((prev) => new Set(prev).add(id))
  }

  const { mutateAsync: editRecipients } = useEditMailRecipient()

  const handleEditRecipients = async (payload: {
    recipients: {
      user_id: string
      recipient_type: "cc" | "to"
      sequence: number
    }[]
  }) => {
    await editRecipients({ id: selectedId!, body: payload.recipients })
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      <PageWrapper className="mx-2 flex min-h-0 flex-1 flex-col space-y-2 px-2 py-2 sm:px-2 lg:px-0">
        <MailHeader
          onRefresh={handleRefresh}
          onFiltersChange={handleFiltersChange}
          filterValue={filters}
          searchValue={search.search}
          refreshing={refreshing}
        />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch">
          <div
            className={`min-h-0 w-full border-b border-border lg:flex lg:w-[360px] lg:flex-col lg:border-r lg:border-b-0 xl:w-[400px] ${
              showDetail ? "hidden" : "flex flex-col"
            }`}
          >
            {isListError ? (
              <div role="alert" className="m-auto space-y-3 p-6 text-center">
                <p className="text-sm text-destructive">
                  {listError.message || "Gagal memuat daftar surat"}
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Coba Lagi
                </Button>
              </div>
            ) : (
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
            )}
          </div>
          <article
            className={`min-h-0 flex-1 lg:block ${showDetail ? "block" : "hidden"}`}
          >
            {selectedId && isDetailError ? (
              <div role="alert" className="m-auto space-y-3 p-6 text-center">
                <p className="text-sm text-destructive">
                  {detailError.message || "Gagal memuat detail surat"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchDetail()}
                >
                  Coba Lagi
                </Button>
              </div>
            ) : selectedId ? (
              <MailDetail
                detail={mailDetail ?? undefined}
                isLoading={isLoadingDetail}
                showCloseButton
                onClose={() => setShowDetail(false)}
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

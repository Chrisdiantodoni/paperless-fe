import { MailDetail } from "@/components/mail/mail-detail"
import MailemptyState from "@/components/mail/mail-empty-state"
import MailHeader from "@/components/mail/mail-header"
import type { MailFilterState } from "@/components/mail/mail-header"
import { MailList } from "@/components/mail/mail-list"
import {
  mailKeys,
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
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/_dashboard/mail/all-mails")({
  validateSearch: zodValidator(listRequestQuerySchema),
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  const { setOpen } = useSidebar()
  const hasCollapsedSidebar = useRef(false)

  useEffect(() => {
    if (hasCollapsedSidebar.current) return
    hasCollapsedSidebar.current = true
    setOpen(false)
  }, [setOpen])
  const navigate = Route.useNavigate()

  const filters: MailFilterState = {
    request_type: search.request_type,
    status: search.status,
    branch_id: search.branch_id,
    category_mail_id: search.category_mail_id,
    department_id: search.department_id,
    position_id: search.position_id,
    start_date: search.start_date,
    end_date: search.end_date,
    sort_by: search.sort_by,
    sort_dir: search.sort_dir,
  }
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set())
  const { data: userData } = useUser()
  const currentUserIds = useMemo(
    () => [userData.id, userData.hris_user_id].filter(Boolean),
    [userData.hris_user_id, userData.id]
  )
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

  const handleFiltersChange = (nextFilters: MailFilterState) => {
    navigate({
      search: {
        ...search,
        request_type: nextFilters.request_type as
          | "leave_request"
          | "permit_request"
          | "absence_request"
          | "overtime_request"
          | "dynamic_template"
          | undefined,
        status: nextFilters.status as
          | "Draft"
          | "Sent"
          | "Revision"
          | "Approved"
          | "Rejected"
          | undefined,
        branch_id: nextFilters.branch_id || undefined,
        category_mail_id: nextFilters.category_mail_id || undefined,
        department_id: nextFilters.department_id || undefined,
        position_id: nextFilters.position_id || undefined,
        start_date: nextFilters.start_date ?? undefined,
        end_date: nextFilters.end_date ?? undefined,
        sort_by: nextFilters.sort_by as
          | "status"
          | "created_at"
          | "document_number"
          | undefined,
        sort_dir: nextFilters.sort_dir as "asc" | "desc" | undefined,
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
  } = useMailList(listSearch)

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
        if (isMailReadByUser(mail, currentUserIds)) {
          readIds.add(mail.id)
        }
      })
      setLocalReadIds(readIds)
    }
  }, [mailPagination?.data, currentUserIds])

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
      <PageWrapper className="mx-2 flex min-h-0 flex-1 flex-col px-2 py-2 sm:px-2 lg:px-0">
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
                currentUserIds={currentUserIds}
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

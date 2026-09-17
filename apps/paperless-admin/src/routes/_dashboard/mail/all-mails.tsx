import MailemptyState from "@/components/mail/mail-empty-state"
import MailHeader, { type MailFilterState } from "@/components/mail/mail-header"
import { MailList } from "@/components/mail/mail-list"
import { mailListQueryOptions, useMailList } from "@/hooks/queries/use-mail"
import { useDebounce } from "@/hooks/use-debounce"
import { useMailData } from "@/hooks/use-mail-data"
import { listRequestQuerySchema } from "@/schema/mail/schema"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
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

  const {
    data: mailPagination,
    isFetching,
    refetch,
  } = useMailList(search, initialData!)

  return (
    <main className="flex h-screen flex-col bg-background text-foreground">
      <PageWrapper className="shrink-0 space-y-6">
        <MailHeader filterValue={filters} refreshing={refreshing} />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch">
          <div
            className={`min-h-0 w-full border-b border-border lg:flex lg:w-[360px] lg:flex-col lg:border-r lg:border-b-0 xl:w-[400px] ${
              showDetail ? "hidden" : "flex flex-col"
            }`}
          >
            <MailList />
          </div>
          <article
            className={`min-h-0 flex-1 lg:block ${showDetail ? "block" : "hidden"}`}
          >
            {selectedId ? <div>selectedId</div> : <MailemptyState />}
          </article>
        </div>
      </PageWrapper>
    </main>
  )
}

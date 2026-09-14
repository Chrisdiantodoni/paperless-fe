import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { subordinateSearchSchema } from "@/schema/list.schema"
import {
  subordinateQueryOptions,
  useSubordinates,
} from "@/hooks/queries/use-subordinates"
import { columns } from "@/components/table/subordinate-column"
import type { SubordinateRow } from "@/components/table/subordinate-column"
import { DataTable } from "@workspace/ui/components/ui/data-table"
import { DataTablePagination } from "@workspace/ui/components/ui/data-table-pagination"
import { Search } from "lucide-react"
import { Input } from "@workspace/ui/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"

export const Route = createFileRoute("/_dashboard/subordinates/")({
  component: RouteComponent,
  validateSearch: zodValidator(subordinateSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    const data = await queryClient.ensureQueryData(
      subordinateQueryOptions(search)
    )
    return { data }
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { data: initialData } = Route.useLoaderData()
  const search = Route.useSearch()
  const [searchInput, setSearchInput] = useState(search.search || "")
  const debouncedSearch = useDebounce(searchInput, 500)

  useEffect(() => {
    if (debouncedSearch === (search.search || "")) return

    navigate({
      search: (prev) => ({ ...prev, search: debouncedSearch, page: 1 }),
    })
  }, [debouncedSearch, navigate, search.search])

  const { data, isFetching } = useSubordinates(search, initialData)
  const pagination = data ?? initialData

  const rows = useMemo(
    () =>
      pagination?.data.map(
        (d): SubordinateRow => ({
          ...d,
          current_page: pagination.current_page,
          per_page: pagination.per_page,
        })
      ) ?? [],
    [pagination]
  )

  if (!pagination) return null

  return (
    <PageWrapper className="space-y-6">
      <PageHeader
        title="List Bawahan"
        description="Lihat dan kelola daftar bawahan Anda"
      />

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau NIP..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <DataTable columns={columns} data={rows} isFetching={isFetching} />
      </div>

      <DataTablePagination
        pagination={pagination}
        isFetching={isFetching}
        onPageChange={(page) =>
          navigate({ search: (prev) => ({ ...prev, page }) })
        }
      />
    </PageWrapper>
  )
}

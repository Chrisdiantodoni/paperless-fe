import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { subordinateSearchSchema } from "@/schema/list.schema"
import { subordinateQueryOptions } from "@/hooks/queries/use-subordinates"
import { useSubordinates } from "@/hooks/queries/use-subordinates"
import {
  columns,
  type SubordinateRow,
} from "@/components/table/subordinate-column"
import { DataTable } from "@workspace/ui/components/ui/data-table"
import { DataTablePagination } from "@workspace/ui/components/ui/data-table-pagination"
import { Button } from "@workspace/ui/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@workspace/ui/components/ui/input"
import { useMemo, useState } from "react"

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

  const { data, isFetching } = useSubordinates(search, initialData)

  const rows = useMemo(
    () =>
      data.data.map(
        (d): SubordinateRow => ({
          ...d,
          current_page: data.current_page,
          per_page: data.per_page,
        })
      ),
    [data]
  )

  const handleSearch = () => {
    navigate({
      search: (prev) => ({ ...prev, search: searchInput, page: 1 }),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="container mx-auto space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-normal tracking-tight">List Bawahan</h1>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau NIP..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8"
          />
        </div>
        <Button onClick={handleSearch} size="sm">
          Cari
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <DataTable columns={columns} data={rows} isFetching={isFetching} />
      </div>

      <DataTablePagination
        pagination={data}
        isFetching={isFetching}
        onPageChange={(page) =>
          navigate({ search: (prev) => ({ ...prev, page }) })
        }
      />
    </div>
  )
}


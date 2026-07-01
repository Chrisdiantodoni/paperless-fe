import { DataTable } from "@/components/data-table"
import { SearchInput } from "@/components/search-input"
import { getDepartments } from "@/server/master"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { columns } from "./-column/department-column"
import type { DepartmentRow } from "./-column/department-column"
import { departmentSearchSchema } from "@/schema/department.schema"
import { zodValidator } from "@tanstack/zod-adapter"
import { useMemo } from "react"
import type z from "zod"
import { DataTablePagination } from "@/components/data-table-pagination"
import { DepartmentCombobox } from "@/components/select/select-departments"

type DepartmentSearch = z.infer<typeof departmentSearchSchema>

const departmentsQueryOptions = (search: DepartmentSearch) =>
  queryOptions({
    queryKey: ["departments", search.status, search.page, search.search],
    queryFn: () => getDepartments({ data: search }),
  })

export const Route = createFileRoute("/_dashboard/master/departments")({
  component: RouteComponent,
  validateSearch: zodValidator(departmentSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    await queryClient.ensureQueryData(departmentsQueryOptions(search))
  },
  pendingMs: 2000,
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  const { search: searchQuery, status } = search
  const { data, isFetching } = useSuspenseQuery(departmentsQueryOptions(search))

  const rows = useMemo(
    () =>
      data.data.map(
        (d): DepartmentRow => ({
          ...d,
          current_page: data.current_page,
          per_page: data.per_page,
        })
      ),
    [data]
  )

  const handleStatusChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: value as DepartmentSearch["status"],
        page: 1,
      }),
    })
  }
  return (
    <div className="container mx-auto space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight">
          List Departemen
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <SearchInput
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(q) => {
              navigate({
                search: (prev) => ({ ...prev, search: q, status, page: 1 }),
              })
            }}
          />
        </div>

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <DepartmentCombobox
          value={searchQuery}
          onChange={(value) => {
            navigate({
              search: (prev) => ({ ...prev, search: value, status, page: 1 }),
            })
          }}
        />
      </div>
      <div className="border">
        <DataTable columns={columns} data={rows} isFetching={isFetching} />
      </div>
      <DataTablePagination
        currentPage={data.current_page}
        lastPage={data.last_page}
        total={data.total}
        isFetching={isFetching}
        onPageChange={(page) =>
          navigate({ search: (prev) => ({ ...prev, page }) })
        }
      />
    </div>
  )
}

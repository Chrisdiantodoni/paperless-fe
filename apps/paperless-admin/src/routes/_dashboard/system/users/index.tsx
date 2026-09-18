import {
  useAdminUsers,
  adminUsersQueryOptions,
} from "@/hooks/queries/use-admin-users"
import { createFileRoute, Link } from "@tanstack/react-router"
import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { DataTable } from "@workspace/ui/components/ui/data-table"
import { DataTablePagination } from "@workspace/ui/components/ui/data-table-pagination"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { useMemo, useState } from "react"
import { columns, type AdminUserRow } from "../-column/user-column"

export const Route = createFileRoute("/_dashboard/system/users/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
    search: String(search.search ?? ""),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps }) => ({
    data: await queryClient.ensureQueryData(adminUsersQueryOptions(deps)),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const { data, isFetching } = useAdminUsers(search, Route.useLoaderData().data)
  const [value, setValue] = useState(search.search)

  const rows = useMemo(
    () =>
      data?.data?.map(
        (d): AdminUserRow => ({
          ...d,
          current_page: data.current_page,
          per_page: data.per_page,
        })
      ) ?? [],
    [data]
  )
  return (
    <PageWrapper className="space-y-4 p-2">
      <PageHeader title="Users" />
      <Input
        placeholder="Cari user..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          navigate({ search: { search: e.target.value, page: 1 } })
        }}
      />
      <DataTable columns={columns} data={rows} isFetching={isFetching} />
      <DataTablePagination
        pagination={data}
        isFetching={isFetching}
        onPageChange={(page) => navigate({ search: { ...search, page } })}
      />
    </PageWrapper>
  )
}

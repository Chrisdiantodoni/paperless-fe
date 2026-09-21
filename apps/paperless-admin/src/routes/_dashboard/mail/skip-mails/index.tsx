import { SearchInput } from "@/components/search-input"
import { useMailList } from "@/hooks/queries/use-mail"
import {
  skipMailListQueryOptions,
  useSkipMailList,
} from "@/hooks/queries/use-skip-mail"
import { listRequestSkipMailSchema } from "@/schema/mail/schema"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useAppForm } from "@workspace/forms/src/forms"
import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { Button } from "@workspace/ui/components/ui/button"

import { Plus, RotateCcw, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { columns, type SkipperRow } from "../-column/skip-mail-column"
import { DataTable } from "@workspace/ui/components/ui/data-table"
import { DataTablePagination } from "@workspace/ui/components/ui/data-table-pagination"
// Ganti dengan hook query asli Anda, misal:
// import { useSkipMails } from "@/hooks/queries/use-skip-mails"

export const Route = createFileRoute("/_dashboard/mail/skip-mails/")({
  component: RouteComponent,
  validateSearch: zodValidator(listRequestSkipMailSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    const data = await queryClient.ensureQueryData(
      skipMailListQueryOptions(search)
    )
    return { data }
  },
})

interface FilterValues {
  skipper_id: string
  date_from: string
  date_to: string
  reason: string
}

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const { data: initialData } = Route.useLoaderData()

  const { search: searchQuery } = search

  // State filter yang aktif untuk request data tabel
  const [filters, setFilters] = useState<FilterValues>({
    skipper_id: "",
    date_from: "",
    date_to: "",
    reason: "",
  })

  // Contoh pemanggilan hook fetching:
  // const { data: mailList, isLoading, isFetching } = useSkipMails(filters)
  const isLoading = false
  const mailList: any[] = [] // placeholder data hasil fetch

  const form = useAppForm({
    defaultValues: {
      skipper_id: "",
      date_from: "",
      date_to: "",
      reason: "",
    },
    onSubmit: async ({ value }) => {
      // Perbarui parameter query tabel
      setFilters(value)
    },
  })

  const handleReset = () => {
    form.reset()
    setFilters({
      skipper_id: "",
      date_from: "",
      date_to: "",
      reason: "",
    })
  }

  const { data, isFetching } = useSkipMailList(search, initialData)

  const rows = useMemo(
    () =>
      data?.data.map(
        (d): SkipperRow => ({
          ...d,
          current_page: data.current_page,
          per_page: data.per_page,
        })
      ) ?? [],
    [data]
  )

  return (
    <PageWrapper className="space-y-4 p-2">
      <PageHeader
        title="Skip Mail"
        description="Filter dan kelola daftar surat yang dilewati oleh staf"
        actions={
          <Button asChild size={"sm"}>
            <Link to="/mail/skip-mails/create">
              <Plus className="h-4 w-4" />
              Buat Skip Mail
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col justify-between gap-2 lg:flex-row">
        <SearchInput
          placeholder="Cari skip mail..."
          value={searchQuery}
          onChange={(q) => {
            navigate({
              search: (prev) => ({
                ...prev,
                search: q,
                page: 1,
              }),
            })
          }}
        />
      </div>
      <div className="border">
        <DataTable columns={columns} data={rows} isFetching={isFetching} />
      </div>
      {data && (
        <DataTablePagination
          pagination={data}
          isFetching={isFetching}
          onPageChange={(page) =>
            navigate({ search: (prev) => ({ ...prev, page }) })
          }
        />
      )}
    </PageWrapper>
  )
}

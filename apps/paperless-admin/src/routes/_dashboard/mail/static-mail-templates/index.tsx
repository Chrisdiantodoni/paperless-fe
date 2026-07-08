import { SearchInput } from "@/components/search-input"
import {
  staticMailTemplateQueryOptions,
  useStaticMailTemplate,
} from "@/hooks/queries/use-static-mail-template"
import { staticMailTemplateSearchSchema } from "@/schema/list.schema"
import { createFileRoute, Link } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useEffect, useMemo, useState } from "react"
import type { SelectValue as ComboboxValue } from "@workspace/types"
import type { StaticMailTemplateRow } from "../-column/static-mail-column"
import { columns } from "../-column/static-mail-column"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { DepartmentCombobox } from "@/components/select/select-departments"
import { PositionCombobox } from "@/components/select/select-position"
import { BranchCombobox } from "@/components/select/select-branch"
import { Button } from "@workspace/ui/components/ui/button"
import { DataTable } from "@workspace/ui/components/ui/data-table"
import { DataTablePagination } from "@workspace/ui/components/ui/data-table-pagination"

import { Plus } from "lucide-react"

export const Route = createFileRoute("/_dashboard/mail/static-mail-templates/")(
  {
    component: RouteComponent,
    validateSearch: zodValidator(staticMailTemplateSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient }, deps: search }) => {
      await queryClient.ensureQueryData(staticMailTemplateQueryOptions(search))
    },
    pendingMs: 500,
  }
)

function RouteComponent() {
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const {
    search: searchQuery,
    is_active,
    department,
    branch,
    position,
  } = search

  const [branchValue, setBranchValue] = useState<string | ComboboxValue>(branch)
  const [departmentValue, setDepartmentValue] = useState<
    string | ComboboxValue
  >(department)
  const [positionValue, setPositionValue] = useState<string | ComboboxValue>(
    position
  )
  const [isActiveValue, setIsActiveValue] = useState(is_active)

  // sync balik kalau search berubah dari luar (back/forward, reset, dsb)
  useEffect(() => setBranchValue(branch), [branch])
  useEffect(() => setDepartmentValue(department), [department])
  useEffect(() => setPositionValue(position), [position])
  useEffect(() => setIsActiveValue(is_active), [is_active])

  const { data, isFetching } = useStaticMailTemplate(search)

  const rows = useMemo(
    () =>
      data.data.map(
        (d): StaticMailTemplateRow => ({
          ...d,
          current_page: data.current_page,
          per_page: data.per_page,
        })
      ),
    [data]
  )

  return (
    <div className="container mx-auto space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight">
          List Template Statis
        </h1>
        <Button asChild>
          <Link to="/mail/static-mail-templates/create">
            <Plus className="h-4 w-4" />
            Tambah Template
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative w-full">
          <SearchInput
            placeholder="Search template..."
            value={searchQuery}
            onChange={(q) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  search: q,
                  page: 1,
                  is_active:
                    prev.is_active === true || prev.is_active === false
                      ? prev.is_active
                      : "all",
                }),
              })
            }}
          />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
          <Select
            value={
              isActiveValue === true
                ? "true"
                : isActiveValue === false
                  ? "false"
                  : "all"
            }
            onValueChange={(value) => {
              setIsActiveValue(value == "true" ? true : false)
              navigate({
                search: (prev) => ({
                  ...prev,
                  is_active: value,
                  page: 1,
                }),
              })
            }}
          >
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Aktif</SelectItem>
              <SelectItem value="false">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
          <BranchCombobox
            value={branchValue}
            onChange={(val) => {
              setBranchValue(val)
              navigate({
                search: (prev) => ({ ...prev, branch: val.value, page: 1 }),
              })
            }}
          />
          <DepartmentCombobox
            value={departmentValue}
            onChange={(val) => {
              setDepartmentValue(val)
              navigate({
                search: (prev) => ({ ...prev, department: val.value, page: 1 }),
              })
            }}
          />
          <PositionCombobox
            value={positionValue}
            onChange={(val) => {
              setPositionValue(val)
              navigate({
                search: (prev) => ({ ...prev, position: val.value, page: 1 }),
              })
            }}
          />
        </div>
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

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
      const data = await queryClient.ensureQueryData(
        staticMailTemplateQueryOptions(search)
      )
      return { data }
    },
  }
)

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { data: initialData } = Route.useLoaderData()
  const search = Route.useSearch()
  const {
    search: searchQuery,
    is_active,
    department_id,
    branch_id,
    position_id,
    department_label,
    branch_label,
    position_label,
  } = search

  const [branchValue, setBranchValue] = useState<string | ComboboxValue>({
    value: branch_id,
    label: branch_label,
  })
  const [departmentValue, setDepartmentValue] = useState<
    string | ComboboxValue
  >(department_id)
  const [positionValue, setPositionValue] = useState<string | ComboboxValue>(
    position_id
  )
  const [isActiveValue, setIsActiveValue] = useState(is_active)

  // sync balik kalau search berubah dari luar (back/forward, reset, dsb)
  useEffect(() => {
    setBranchValue({ value: branch_id, label: branch_label })
  }, [branch_id, branch_label])
  useEffect(() => {
    setPositionValue({ value: position_id, label: position_label })
  }, [position_id, position_label])
  useEffect(() => {
    setDepartmentValue({ value: department_id, label: department_label })
  }, [department_id, department_label])
  useEffect(() => setIsActiveValue(is_active), [is_active])

  const { data, isFetching } = useStaticMailTemplate(search, initialData)

  const rows = useMemo(
    () =>
      data?.data?.map(
        (d): StaticMailTemplateRow => ({
          ...d,
          current_page: data.current_page,
          per_page: data.per_page,
        })
      ) ?? [],
    [data]
  )

  return (
    <div className="container mx-auto space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-normal tracking-tight">
          List Template Statis
        </h1>
        <Button asChild size={"sm"}>
          <Link to="/mail/static-mail-templates/create">
            <Plus className="h-4 w-4" />
            Tambah Template
          </Link>
        </Button>
      </div>
      <div className="flex flex-col justify-between gap-2 lg:flex-row">
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

        <div className="flex flex-wrap gap-2">
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
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Aktif</SelectItem>
              <SelectItem value="false">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full sm:w-[160px] lg:w-[200px]">
            <BranchCombobox
              value={branchValue}
              onChange={(val) => {
                setBranchValue(val)
                navigate({
                  search: (prev) => ({
                    ...prev,
                    branch_id: val.value,
                    branch_label: val.label,
                    page: 1,
                  }),
                })
              }}
            />
          </div>
          <div className="w-full sm:w-[160px] lg:w-[200px]">
            <DepartmentCombobox
              value={departmentValue}
              onChange={(val) => {
                setDepartmentValue(val)
                navigate({
                  search: (prev) => ({
                    ...prev,
                    department_id: val.value,
                    department_label: val.label,
                    page: 1,
                  }),
                })
              }}
            />
          </div>
          <div className="w-full sm:w-[160px] lg:w-[200px]">
            <PositionCombobox
              value={positionValue}
              onChange={(val) => {
                setPositionValue(val)
                navigate({
                  search: (prev) => ({
                    ...prev,
                    position_id: val.value,
                    position_label: val.label,
                    page: 1,
                  }),
                })
              }}
            />
          </div>
        </div>
      </div>

      <div className="border">
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

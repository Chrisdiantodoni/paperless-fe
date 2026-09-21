import { StaticMailTemplateForm } from "@/components/forms/static-mail-template"
import { getBranches, getDepartments, getPositions } from "@/server/master"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute(
  "/_dashboard/mail/static-mail-templates/create"
)({
  loader: async () => {
    const [resBranches, resDepartments, resPositions] = await Promise.all([
      getBranches({ data: { is_paginate: false } }),
      getDepartments({ data: { is_paginate: false } }),
      getPositions({ data: { is_paginate: false } }),
    ])
    return {
      branches: Array.isArray(resBranches) ? resBranches : resBranches.data,
      departments: Array.isArray(resDepartments)
        ? resDepartments
        : resDepartments.data,
      positions: Array.isArray(resPositions) ? resPositions : resPositions.data,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { branches, departments, positions } = Route.useLoaderData()
  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* Page Header dengan Tombol Back */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Kembali ke daftar template"
          onClick={() =>
            navigate({
              to: "/mail/static-mail-templates",
              search: {
                page: 1,
                search: "",
                per_page: 10,
                branch_id: "",
                branch_label: "",
                department_id: "",
                department_label: "",
                position_id: "",
                position_label: "",
                is_active: "",
              },
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Buat Template Surat
          </h1>
          <p className="text-sm text-muted-foreground">
            Tambahkan template surat statis baru ke dalam sistem.
          </p>
        </div>
      </div>

      {/* Form Wrapper */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Template</CardTitle>
          <CardDescription>
            Lengkapi pengaturan form dan peruntukan template di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaticMailTemplateForm
            branches={branches}
            departments={departments}
            positions={positions}
          />
        </CardContent>
      </Card>
    </div>
  )
}

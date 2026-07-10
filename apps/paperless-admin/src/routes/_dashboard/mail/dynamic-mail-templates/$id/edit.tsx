import { DynamicMailTemplateForm } from "@/components/forms/dynamic-mail-template"
import type { DynamicMailTemplateForm as DynamicMailTemplateFormSchema } from "@/schema/master/schema"
import {
  getBranches,
  getDepartments,
  getDynamicMailTemplateById,
  getPositions,
} from "@/server/master"
import { createFileRoute, useRouter } from "@tanstack/react-router"
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
  "/_dashboard/mail/dynamic-mail-templates/$id/edit"
)({
  loader: async ({ params }) => {
    const id = params.id

    const [resBranches, resDepartments, resPositions, resDynamicMailTemplate] =
      await Promise.all([
        getBranches({ data: { is_paginate: false } }),
        getDepartments({ data: { is_paginate: false } }),
        getPositions({ data: { is_paginate: false } }),
        getDynamicMailTemplateById({ data: id }),
      ])
    return {
      branches: Array.isArray(resBranches) ? resBranches : resBranches.data,
      departments: Array.isArray(resDepartments)
        ? resDepartments
        : resDepartments.data,
      positions: Array.isArray(resPositions) ? resPositions : resPositions.data,
      resDynamicMailTemplate,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { branches, departments, positions, resDynamicMailTemplate } =
    Route.useLoaderData()

  const initialValues: DynamicMailTemplateFormSchema = {
    ...resDynamicMailTemplate,
    content: resDynamicMailTemplate.content ?? "",
    form_schema: resDynamicMailTemplate.form_schema,
    description: resDynamicMailTemplate.description ?? "",
    department: {
      label: resDynamicMailTemplate.department,
      value: resDynamicMailTemplate.department_id,
    },
    branches: resDynamicMailTemplate.branches.map((item) => ({
      label: item.name,
      value: item.id,
    })),
    departments: resDynamicMailTemplate.departments.map((item) => ({
      label: item.name,
      value: item.id,
    })),
    positions: resDynamicMailTemplate.positions.map((item) => ({
      label: item.name,
      value: item.id,
    })),
    recipients_cc: resDynamicMailTemplate.recipients
      .filter((filter) => filter.recipient_type == "cc")
      .map((rec) => ({
        user_id: { value: rec.user_id, label: rec.name },
        recipient_type: "cc",
        sequence: rec.sequence,
      })),
    recipients: resDynamicMailTemplate.recipients
      .filter((filter) => filter.recipient_type == "to")
      .map((rec) => ({
        user_id: { value: rec.user_id, label: rec.name },
        recipient_type: "to",
        sequence: rec.sequence,
      })),
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Template Surat
          </h1>
          <p className="text-sm text-muted-foreground">
            Update template surat dinamis.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detail Template</CardTitle>
          <CardDescription>
            Lengkapi pengaturan form dan peruntukan template di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicMailTemplateForm
            branches={branches}
            departments={departments}
            positions={positions}
            initialValues={initialValues}
          />
        </CardContent>
      </Card>
    </div>
  )
}

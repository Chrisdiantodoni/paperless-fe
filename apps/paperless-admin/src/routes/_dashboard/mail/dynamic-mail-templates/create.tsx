import { useStore } from "@tanstack/react-form"
import { useAppForm } from "@workspace/forms/src/forms"
import { dynamicMailTemplateValidator } from "@/schema/master/schema"
import type { FieldDefinition } from "@/schema/master/schema"
import { FIELD_REGISTRY_LIST } from "@/components/registry/field-registry"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { ArrowLeft, Trash } from "lucide-react"
import { getBranches, getDepartments, getPositions } from "@/server/master"
import { DynamicMailTemplateForm } from "@/components/forms/dynamic-mail-template"

export const Route = createFileRoute(
  "/_dashboard/mail/dynamic-mail-templates/create"
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
  const router = useRouter()
  const { branches, departments, positions } = Route.useLoaderData()

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
            Buat Template Surat
          </h1>
          <p className="text-sm text-muted-foreground">
            Tambahkan template surat dinamis baru ke dalam sistem.
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
          />
        </CardContent>
      </Card>
    </div>
  )
}

// <form
//    onSubmit={(e) => {
//      e.preventDefault()
//      void form.handleSubmit()
//    }}
//  >
//    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//      {/* LEFT: Static fields + builder */}
//      <div className="space-y-6 lg:col-span-2">
//        <Card>
//          <CardHeader>
//            <CardTitle>Informasi Template</CardTitle>
//            <CardDescription>Data dasar template.</CardDescription>
//          </CardHeader>
//          <CardContent className="space-y-4">
//            <form.AppField name="name">
//              {(field) => (
//                <field.TextField label="Nama Template" required />
//              )}
//            </form.AppField>
//            <form.AppField name="code">
//              {(field) => <field.TextField label="Kode" required />}
//            </form.AppField>
//            <form.AppField name="description">
//              {(field) => <field.TextareaField label="Deskripsi" />}
//            </form.AppField>
//            <form.AppField name="content">
//              {(field) => <field.TextareaField label="Konten Email" />}
//            </form.AppField>
//          </CardContent>
//        </Card>

//        {/* DYNAMIC FIELD BUILDER */}
//        <Card>
//          <CardHeader>
//            <div className="flex items-center justify-between">
//              <div>
//                <CardTitle>Form Fields</CardTitle>
//                <CardDescription>
//                  Tambahkan field yang akan muncul di form template ini.
//                </CardDescription>
//              </div>
//              <div className="flex items-center gap-2">
//                <select
//                  className="rounded-lg border px-3 py-1.5 text-sm"
//                  onChange={(e) => {
//                    if (e.target.value) {
//                      addField(e.target.value)
//                      e.target.value = ""
//                    }
//                  }}
//                  defaultValue=""
//                >
//                  <option value="" disabled>
//                    + Tambah Field
//                  </option>
//                  {FIELD_REGISTRY_LIST.map((f) => (
//                    <option key={f.type} value={f.type}>
//                      {f.label}
//                    </option>
//                  ))}
//                </select>
//              </div>
//            </div>
//          </CardHeader>
//          <CardContent>
//            {fieldDefs.length === 0 ? (
//              <p className="py-4 text-center text-sm text-muted-foreground">
//                Belum ada field. Tambahkan dari dropdown di atas.
//              </p>
//            ) : (
//              <div className="space-y-3">
//                {fieldDefs.map((f, i) => (
//                  <div
//                    key={i}
//                    className="space-y-3 rounded-lg border bg-muted/30 p-3"
//                  >
//                    <div className="flex items-center justify-between">
//                      <div className="flex items-center gap-2">
//                        <span className="text-xs text-muted-foreground">
//                          #{i + 1}
//                        </span>
//                        <span className="text-sm font-medium">
//                          {f.label || "(no label)"}
//                        </span>
//                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
//                          {f.type}
//                        </span>
//                      </div>
//                      <Button
//                        variant="ghost"
//                        size="icon"
//                        type="button"
//                        onClick={() => removeField(i)}
//                      >
//                        <Trash className="h-3.5 w-3.5" />
//                      </Button>
//                    </div>

//                    <div className="grid grid-cols-3 gap-2">
//                      <div>
//                        <label className="mb-1 block text-xs text-muted-foreground">
//                          Field Name
//                        </label>
//                        <form.AppField name={`form_schema[${i}].name`}>
//                          {(field) => (
//                            <field.TextField
//                              label=""
//                              placeholder="e.g. department_id"
//                            />
//                          )}
//                        </form.AppField>
//                      </div>
//                      <div>
//                        <label className="mb-1 block text-xs text-muted-foreground">
//                          Label
//                        </label>
//                        <form.AppField name={`form_schema[${i}].label`}>
//                          {(field) => (
//                            <field.TextField
//                              label=""
//                              placeholder="e.g. Departemen"
//                            />
//                          )}
//                        </form.AppField>
//                      </div>
//                      <div className="flex items-end pb-2">
//                        <form.AppField
//                          name={`form_schema[${i}].is_required`}
//                        >
//                          {(field) => (
//                            <field.CheckboxField label="Required" />
//                          )}
//                        </form.AppField>
//                      </div>
//                    </div>

//                    {FIELD_REGISTRY_LIST.find((r) => r.type === f.type)
//                      ?.supportsDeps &&
//                      fieldDefs.length > 1 && (
//                        <div>
//                          <label className="mb-1 block text-xs text-muted-foreground">
//                            Depends On
//                          </label>
//                          <form.AppField
//                            name={`form_schema[${i}].dependsOn`}
//                          >
//                            {(field) => {
//                              const otherFields = fieldDefs.filter(
//                                (_, idx) => idx !== i
//                              )
//                              const selected = (field.state.value ??
//                                []) as string[]
//                              return (
//                                <div className="flex flex-wrap gap-1.5">
//                                  {otherFields.map((df) => {
//                                    const isSelected = selected.includes(
//                                      df.name
//                                    )
//                                    return (
//                                      <Badge
//                                        key={df.name}
//                                        variant={
//                                          isSelected ? "default" : "outline"
//                                        }
//                                        className="cursor-pointer text-xs"
//                                        onClick={() => {
//                                          field.handleChange(
//                                            isSelected
//                                              ? selected.filter(
//                                                  (v) => v !== df.name
//                                                )
//                                              : [...selected, df.name]
//                                          )
//                                        }}
//                                      >
//                                        {df.label || df.name}
//                                      </Badge>
//                                    )
//                                  })}
//                                </div>
//                              )
//                            }}
//                          </form.AppField>
//                        </div>
//                      )}
//                  </div>
//                ))}
//              </div>
//            )}
//          </CardContent>
//        </Card>
//      </div>

//      {/* RIGHT: Preview */}
//      <div className="lg:col-span-1">
//        <div className="sticky top-6 space-y-6">
//          <Card>
//            <CardHeader>
//              <CardTitle className="text-sm">Preview Form</CardTitle>
//            </CardHeader>
//            <CardContent>
//              {fieldDefs.length === 0 ? (
//                <p className="text-sm text-muted-foreground">
//                  Tambahkan field untuk melihat preview.
//                </p>
//              ) : (
//                <DynamicFormRenderer schema={fieldDefs} form={form} />
//              )}
//            </CardContent>
//          </Card>

//          <Button type="submit" className="w-full">
//            Simpan Template
//          </Button>
//        </div>
//      </div>
//    </div>
//  </form>

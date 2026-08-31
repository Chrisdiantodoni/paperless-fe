import {
  dynamicMailTemplateSchema,
  dynamicMailTemplateValidator,
  emptyDynamicMailTemplateValues,
  emptyStaticMailTemplateValues,
  type DynamicMailTemplateForm,
  type FieldDefinition,
  type RecipientItem,
} from "@/schema/master/schema"
import { useNavigate } from "@tanstack/react-router"
import { useAppForm } from "@workspace/forms/src/forms"
import type { Branch, Department, Position } from "@workspace/types/master"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldDescription,
  Field,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { useMemo } from "react"
import type { TemplateFormFieldsProps } from "./static-mail-template"
import { Label } from "@workspace/ui/components/ui/label"
import { DepartmentCombobox } from "../select/select-departments"
import type { SelectValue } from "@workspace/types"
import { Repeater } from "@workspace/forms/src/fields"
import { StaffCombobox } from "../select/select-staff"
import { DynamicFormRenderer } from "./dynamic-form-renderer"
import { FIELD_REGISTRY_LIST } from "../registry/field-registry"
import { useStore } from "@tanstack/react-form"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Button } from "@workspace/ui/components/ui/button"
import { Trash } from "lucide-react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { useParams } from "@tanstack/react-router"
import {
  createDynamicMailTemplate,
  updateDynamicMailTemplate,
} from "@/server/master"
import { toast } from "sonner"

interface DynamicMailTemplateFormProps {
  branches: Branch[]
  departments: Department[]
  positions: Position[]
  initialValues?: DynamicMailTemplateForm
}

const emptyRecipient: RecipientItem = {
  user_id: { value: "", label: "" },
  recipient_type: "to",
  sequence: 1,
}

const emptyCcRecipient: RecipientItem = {
  user_id: { value: "", label: "" },
  recipient_type: "cc",
  sequence: 1,
}

interface FieldOptions {
  branchOptions: { value: string; label: string; regions: string }[]
  departmentOptions: { value: string; label: string }[]
  positionOptions: { value: string; label: string }[]
}

const TemplateFormFields = ({
  form,
  options,
  addField,
  removeField,
}: TemplateFormFieldsProps & {
  addField: (type: string) => void
  removeField: (index: number) => void
}) => {
  const { branchOptions, departmentOptions, positionOptions } = options
  const fieldDefs = useStore(form.store, (s) => s.values.form_schema)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Utama</CardTitle>
            <CardDescription>
              Detail informasi utama dari template email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <form.AppField name="name">
                {(field: any) => (
                  <field.TextField label="Nama Template" required />
                )}
              </form.AppField>
              <form.AppField name="code">
                {(field: any) => (
                  <field.TextField label="Kode Template" required />
                )}
              </form.AppField>
              <form.Field name="department">
                {(field: any) => {
                  const errors = field.state.meta.errors
                  console.log(errors)
                  const showError =
                    field.state.meta.isTouched && errors.length > 0
                  return (
                    <div className="flex w-full flex-col space-y-2">
                      <Label required>Kategori / Dept</Label>
                      <div className="flex w-full flex-col">
                        <DepartmentCombobox
                          value={field.state.value as SelectValue}
                          onChange={field.handleChange}
                          onBlur={field.handleBlur}
                          invalid={showError}
                          error={
                            showError
                              ? String(errors[0].message ?? "")
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  )
                }}
              </form.Field>
              <div className="col-span-3">
                <hr />
                <FieldGroup className="mt-2">
                  <FieldSet>
                    <FieldLegend>Custom Form Input</FieldLegend>
                    <FieldDescription>Form kustom dinamis</FieldDescription>
                  </FieldSet>
                  <hr />
                  <div className="flex flex-wrap gap-2">
                    {FIELD_REGISTRY_LIST.map((f) => (
                      <Button
                        type="button"
                        onClick={() => {
                          addField(f.type)
                        }}
                      >
                        {f.label}
                      </Button>
                    ))}
                  </div>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      {fieldDefs.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          Belum ada field. Tambahkan dari dropdown di atas.
                        </p>
                      ) : (
                        <div className="w-full space-y-3">
                          {fieldDefs.map((f, i) => (
                            <div
                              key={i}
                              className="space-y-3 rounded-lg border bg-muted/30 p-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    #{i + 1}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {f.label || "(no label)"}
                                  </span>
                                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                    {f.type}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => removeField(i)}
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="mb-1 block text-xs text-muted-foreground">
                                    Field Name
                                  </label>
                                  <form.AppField
                                    name={`form_schema[${i}].name`}
                                  >
                                    {(field) => (
                                      <field.TextField
                                        label=""
                                        placeholder="e.g. department_id"
                                      />
                                    )}
                                  </form.AppField>
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs text-muted-foreground">
                                    Label
                                  </label>
                                  <form.AppField
                                    name={`form_schema[${i}].label`}
                                  >
                                    {(field) => (
                                      <field.TextField
                                        label=""
                                        placeholder="e.g. Departemen"
                                      />
                                    )}
                                  </form.AppField>
                                </div>
                                <div className="flex items-end pb-2">
                                  <form.AppField
                                    name={`form_schema[${i}].is_required`}
                                  >
                                    {(field) => (
                                      <field.CheckboxField label="Required" />
                                    )}
                                  </form.AppField>
                                </div>
                              </div>

                              {FIELD_REGISTRY_LIST.find(
                                (r) => r.type === f.type
                              )?.supportsDeps &&
                                fieldDefs.length > 1 && (
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">
                                      Depends On
                                    </label>
                                    <form.AppField
                                      name={`form_schema[${i}].dependsOn`}
                                    >
                                      {(field) => {
                                        const otherFields = fieldDefs.filter(
                                          (_, idx) => idx !== i
                                        )
                                        const selected = (field.state.value ??
                                          []) as string[]
                                        return (
                                          <div className="flex flex-wrap gap-1.5">
                                            {otherFields.map((df) => {
                                              const isSelected =
                                                selected.includes(df.name)
                                              return (
                                                <Badge
                                                  key={df.name}
                                                  variant={
                                                    isSelected
                                                      ? "default"
                                                      : "outline"
                                                  }
                                                  className="cursor-pointer text-xs"
                                                  onClick={() => {
                                                    field.handleChange(
                                                      isSelected
                                                        ? selected.filter(
                                                            (v) => v !== df.name
                                                          )
                                                        : [...selected, df.name]
                                                    )
                                                  }}
                                                >
                                                  {df.label || df.name}
                                                </Badge>
                                              )
                                            })}
                                          </div>
                                        )
                                      }}
                                    </form.AppField>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldGroup>
              </div>
              <div className="col-span-3">
                <form.AppField name="description">
                  {(field: any) => (
                    <field.TextareaField label="Deskripsi" rows={3} />
                  )}
                </form.AppField>
              </div>
              <div className="col-span-3">
                <form.AppField name="content">
                  {(field: any) => (
                    <field.RichTextEditorField
                      label="Content"
                      outputFormat="html"
                    />
                  )}
                </form.AppField>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Distribusi</CardTitle>
            <CardDescription>
              Tentukan cakupan wilayah atau divisi yang menggunakan template
              ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <form.AppField name="branches">
                {(field: any) => (
                  <field.CheckboxGroupField
                    label="Cabang"
                    options={branchOptions}
                  />
                )}
              </form.AppField>
              <form.AppField name="departments">
                {(field: any) => (
                  <field.CheckboxGroupField
                    label="Departemen"
                    options={departmentOptions}
                  />
                )}
              </form.AppField>
              <div className="col-span-2">
                <form.AppField name="positions">
                  {(field: any) => (
                    <field.CheckboxGroupField
                      label="Posisi"
                      options={positionOptions}
                    />
                  )}
                </form.AppField>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Penerima Email</CardTitle>
            <CardDescription>
              Daftar user yang akan menerima email (To/CC).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Kepada (To)
              </label>
              <Repeater<RecipientItem>
                form={form}
                name="recipients"
                label="Penerima"
                defaultItem={() => ({ ...emptyRecipient })}
                renderItem={(index) => (
                  <form.Field name={`recipients[${index}].user_id`}>
                    {(field: any) => {
                      const errors = field.state.meta.errors
                      const showError =
                        field.state.meta.isTouched && errors.length > 0
                      return (
                        <div className="flex flex-col space-y-2">
                          <StaffCombobox
                            value={field.state.value}
                            onChange={field.handleChange}
                            onBlur={field.handleBlur}
                            invalid={showError}
                            error={
                              showError
                                ? String(errors?.[0].message ?? "")
                                : undefined
                            }
                          />
                        </div>
                      )
                    }}
                  </form.Field>
                )}
              />
            </div>

            <hr className="border-border" />

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Tembusan (CC)
              </label>
              <Repeater<RecipientItem>
                form={form}
                name="recipients_cc"
                label="Tembusan"
                defaultItem={() => ({ ...emptyCcRecipient })}
                renderItem={(index) => (
                  <form.Field name={`recipients_cc[${index}].user_id`}>
                    {(field: any) => {
                      const errors = field.state.meta.errors
                      const showError =
                        field.state.meta.isTouched && errors.length > 0
                      return (
                        <div className="flex flex-col space-y-2">
                          <StaffCombobox
                            value={field.state.value}
                            onChange={field.handleChange}
                            onBlur={field.handleBlur}
                            invalid={showError}
                            error={
                              showError
                                ? String(errors?.[0].message ?? "")
                                : undefined
                            }
                          />
                        </div>
                      )
                    }}
                  </form.Field>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const DEPS_BY_TYPE: Record<string, string[]> = {
  position: ["department_id"],
  staff: ["department_id", "branch_id", "position_id"],
}

function inferDependsOn(type: string, existingNames: string[]): string[] {
  const candidates = DEPS_BY_TYPE[type] ?? []
  return candidates.filter((name) => existingNames.includes(name))
}

export function DynamicMailTemplateForm({
  branches,
  departments,
  positions,
  initialValues,
}: DynamicMailTemplateFormProps) {
  const navigate = useNavigate()

  const confirm = useConfirm()

  const options = useMemo<FieldOptions>(
    () => ({
      branchOptions: branches.map((b) => ({
        value: b.id,
        label: b.name_branch,
        region: b.area.name_area,
      })),
      departmentOptions: departments.map((d) => ({
        value: d.id,
        label: d.name,
        dept_category: d.branch_category,
      })),
      positionOptions: positions.map((p) => ({
        value: p.id,
        label: p.name,
        category: p.position_type,
      })),
    }),
    [branches, departments, positions]
  )

  const { id } = useParams({ strict: false })

  const form = useAppForm({
    defaultValues: {
      ...emptyDynamicMailTemplateValues,
      ...initialValues,
    },
    validators: {
      onSubmit: dynamicMailTemplateSchema,
    },
    onSubmit: async ({ value }) => {
      await confirm({
        title: "Simpan template email?",
        description: "Pastikan data yang dimasukkan sudah benar.",
        confirmLabel: "Simpan",
        onConfirm: async () => {
          try {
            const response =
              initialValues && id
                ? await updateDynamicMailTemplate({
                    data: {
                      form: value,
                      id: id, // TypeScript aman karena 'id' sudah dijamin ada oleh kondisi (initialValues && id)
                    },
                  })
                : await createDynamicMailTemplate({
                    data: value,
                  })
            toast.success("Template email berhasil disimpan")
            navigate({
              to: "/mail/dynamic-mail-templates/$id",
              params: { id: response.id },
            })
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Gagal menyimpan template email"
            )
            throw error
          }
        },
      })
    },
  })
  const fieldDefs = useStore(form.store, (s) => s.values.form_schema)

  const addField = (type: string) => {
    const entry = FIELD_REGISTRY_LIST.find((f) => f.type === type)
    if (!entry) return

    const existingNames = fieldDefs.map((f) => f.name)

    const dependsOn = inferDependsOn(type, existingNames)

    form.pushFieldValue("form_schema", {
      type: type as FieldDefinition["type"],
      name: `${type}_${fieldDefs.length + 1}`,
      label: entry.label,
      is_required: false,
      ...(dependsOn.length > 0 ? { dependsOn } : {}),
    })
  }

  const removeField = (index: number) => {
    form.removeFieldValue("form_schema", index)
  }

  return (
    <form
      className="flow-root"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <TemplateFormFields
        form={form}
        options={options}
        addField={addField}
        removeField={removeField}
      />

      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <form.AppForm>
          <form.SubmitButton type="submit" label="Simpan Template" />
        </form.AppForm>
      </div>
    </form>
  )
}

function recipientLabel(r: RecipientItem) {
  return r.user_id.label || r.user_id.value || "—"
}

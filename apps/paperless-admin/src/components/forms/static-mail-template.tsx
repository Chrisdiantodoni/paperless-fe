import { memo, useMemo } from "react"
import type {
  RecipientItem,
  StaticMailTemplateFormSchema,
} from "@/schema/master/schema"
import { toast } from "sonner"
import type { Branch, Department, Position } from "@workspace/types/master"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { useStore } from "@tanstack/react-form"
import { useAppForm } from "@workspace/forms/src/forms"
import {
  emptyStaticMailTemplateValues,
  staticMailTemplateFormSchema,
} from "@/schema/master/schema"
import { Repeater } from "@workspace/forms/src/fields"
import { DepartmentCombobox } from "../select/select-departments"
import { StaffCombobox } from "../select/select-staff"
import { Label } from "@workspace/ui/components/ui/label"
import {
  createStaticMailTemplate,
  updateStaticMailTemplate,
} from "@/server/master"
import type { SelectValue } from "@workspace/types"
import { useNavigate, useParams } from "@tanstack/react-router"
import { GroupedSelectPreview } from "../grouped-select-preview"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormApi = any

interface StaticMailTemplateFormProps {
  branches: Branch[]
  departments: Department[]
  positions: Position[]
  initialValues?: StaticMailTemplateFormSchema
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

// ---------------------------------------------------------------------------
// Preview — extracted into a separate component so that form field
// interactions (checkbox toggles, text input) only re-render THIS component,
// not the entire field tree.
// ---------------------------------------------------------------------------

interface EmailPreviewProps {
  form: FormApi
  options: FieldOptions
}

const EmailPreview = memo(function EmailPreview({
  form,
  options,
}: EmailPreviewProps) {
  const name: string = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) => state.values.name
  )
  const description: string = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) =>
      state.values.description ?? ""
  )
  const content: string = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) =>
      state.values.content ?? ""
  )
  const department = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) =>
      state.values.department_id
  )
  const selectedBranches: SelectValue[] = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) => state.values.branches
  )
  const selectedDepartments: SelectValue[] = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) =>
      state.values.departments
  )
  const selectedPositions: SelectValue[] = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) => state.values.positions
  )
  const toRecipients: RecipientItem[] = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) => state.values.recipients
  )
  const ccRecipients: RecipientItem[] = useStore(
    form.store,
    (state: { values: StaticMailTemplateFormSchema }) =>
      state.values.recipients_cc
  )

  const toLabel = useMemo(
    () => toRecipients.map(recipientLabel).join(", "),
    [toRecipients]
  )
  const ccLabel = useMemo(
    () => ccRecipients.map(recipientLabel).join(", "),
    [ccRecipients]
  )

  return (
    <div className="mt-6 rounded-xl border bg-muted/30">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <h3 className="text-sm font-semibold">Pratinjau Email</h3>
        <span className="rounded-full bg-muted-foreground/15 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          Preview
        </span>
      </div>
      <div className="px-5 py-4">
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex">
            <span className="w-20 shrink-0 text-muted-foreground">From</span>
            <span className="tabular-nums">system@paperless.co.id</span>
          </div>
          <div className="flex">
            <span className="w-20 shrink-0 text-muted-foreground">To</span>
            <span>
              {toRecipients.length > 0 ? (
                toLabel
              ) : (
                <span className="text-muted-foreground italic">
                  Belum ada penerima...
                </span>
              )}
            </span>
          </div>
          <div className="flex">
            <span className="w-20 shrink-0 text-muted-foreground">Cc</span>
            <span>
              {ccRecipients.length > 0 ? (
                ccLabel
              ) : (
                <span className="text-muted-foreground italic">
                  Tidak ada CC
                </span>
              )}
            </span>
          </div>
          <div className="flex border-b pb-3">
            <span className="w-20 shrink-0 text-muted-foreground">Subject</span>
            <span className="font-medium">
              {name || (
                <span className="text-muted-foreground italic">
                  Tanpa subjek
                </span>
              )}
            </span>
          </div>
          <div className="flex border-b pb-3">
            <span className="w-20 shrink-0 text-muted-foreground">Dept</span>
            <span>
              {department.label || (
                <span className="text-muted-foreground italic">
                  Belum dipilih
                </span>
              )}
            </span>
          </div>
          <div className="flex">
            <span className="w-20 shrink-0 text-muted-foreground">Cabang</span>
            <span>
              {selectedBranches.length > 0 ? (
                <GroupedSelectPreview
                  items={selectedBranches}
                  getGroupKey={(item) => {
                    const branch = options.branchOptions.find(
                      (b) => b.value === item.value
                    )
                    return branch?.region ?? "Lainnya"
                  }}
                />
              ) : (
                <span className="text-muted-foreground italic">
                  Belum dipilih
                </span>
              )}
            </span>
          </div>
          <div className="flex">
            <span className="w-20 shrink-0 text-muted-foreground">
              Dept. Dist
            </span>
            <span>
              {selectedDepartments.length > 0 ? (
                <GroupedSelectPreview
                  items={selectedDepartments}
                  getGroupKey={(item) => {
                    const dept = options.departmentOptions.find(
                      (b) => b.value === item.value
                    )
                    return dept?.dept_category ?? "Lainnya"
                  }}
                />
              ) : (
                <span className="text-muted-foreground italic">
                  Belum dipilih
                </span>
              )}
            </span>
          </div>
          <div className="flex border-b pb-3">
            <span className="w-20 shrink-0 text-muted-foreground">Posisi</span>
            <span>
              {selectedPositions.length > 0 ? (
                <GroupedSelectPreview items={selectedPositions} />
              ) : (
                <span className="text-muted-foreground italic">
                  Belum dipilih
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap">
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          {content ? (
            <p>{content}</p>
          ) : (
            <p className="text-muted-foreground italic">
              Konten email belum ditulis...
            </p>
          )}
        </div>
      </div>
    </div>
  )
})

// ---------------------------------------------------------------------------
// Form fields — memoized so that preview re-renders don't cascade into the
// field tree. The `form` object is a stable reference from useAppForm.
// ---------------------------------------------------------------------------

export interface TemplateFormFieldsProps {
  form: FormApi
  options: FieldOptions
}

const TemplateFormFields = memo(function TemplateFormFields({
  form,
  options,
}: TemplateFormFieldsProps) {
  const { branchOptions, departmentOptions, positionOptions } = options

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
              <form.Field name="department_id">
                {(field: any) => {
                  const errors = field.state.meta.errors
                  console.log(errors)
                  const showError =
                    field.state.meta.isTouched && errors.length > 0
                  return (
                    <div className="flex flex-col space-y-2">
                      <Label required>Kategori / Dept</Label>
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
                  )
                }}
              </form.Field>
              <div className="col-span-3">
                <form.AppField name="description">
                  {(field: any) => (
                    <field.TextareaField label="Deskripsi" rows={3} />
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

        <Card>
          <CardHeader>
            <CardTitle>Konten Email</CardTitle>
            <CardDescription>
              Isi dari email yang akan dikirimkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField name="content">
              {(field: any) => (
                <field.TextareaField
                  label="Konten"
                  placeholder="Tulis isi email di sini..."
                  rows={12}
                />
              )}
            </form.AppField>
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
})

// ---------------------------------------------------------------------------
// Container — thin wrapper. Holds useAppForm and delegates to memoized
// children so that field edits don't re-render the entire tree.
// ---------------------------------------------------------------------------

export function StaticMailTemplateForm({
  branches,
  departments,
  positions,
  initialValues,
}: StaticMailTemplateFormProps) {
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
      ...emptyStaticMailTemplateValues,
      ...initialValues,
    },
    validators: {
      onSubmit: staticMailTemplateFormSchema,
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
                ? await updateStaticMailTemplate({
                    data: {
                      form: value,
                      id: id, // TypeScript aman karena 'id' sudah dijamin ada oleh kondisi (initialValues && id)
                    },
                  })
                : await createStaticMailTemplate({
                    data: value,
                  })
            toast.success("Template email berhasil disimpan")
            navigate({
              to: "/mail/static-mail-templates/$id",
              params: { id: response ?? response.data.id },
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

  return (
    <form
      className="flow-root"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <TemplateFormFields form={form} options={options} />

      <EmailPreview form={form} options={options} />

      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <form.AppForm>
          <form.SubmitButton type="submit" label="Simpan Template" />
        </form.AppForm>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

function recipientLabel(r: RecipientItem) {
  return r.user_id.label || r.user_id.value || "—"
}

import { BranchCombobox } from "../select/select-branch"
import { SelectAreaMultiple } from "../select/select-area-multiple"
import { DateTimePicker } from "@workspace/ui/components/ui/date-time-picker"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Button } from "@workspace/ui/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "@tanstack/react-form"

interface JobPostingRequestFormProps {
  form: any
}

function FieldError({ field }: { field: any }) {
  const errors = field.state.meta.errors
  return field.state.meta.isTouched && errors.length > 0 ? (
    <p className="text-sm text-destructive">{errors[0]?.message ?? ""}</p>
  ) : null
}

export function JobPostingRequestForm({ form }: JobPostingRequestFormProps) {
  const qualifications = useStore(
    form.store,
    (state: any) => state.values.job_posting_data?.qualifications ?? []
  )

  const areas = useStore(
    form.store,
    (state: any) => state.values.job_posting_data?.areas ?? []
  )

  const addItem = (name: "qualifications" | "areas") =>
    form.setFieldValue(`job_posting_data.${name}`, [
      ...form.getFieldValue(`job_posting_data.${name}`),
      "",
    ])

  const removeItem = (name: "qualifications" | "areas", index: number) =>
    form.setFieldValue(
      `job_posting_data.${name}`,
      form
        .getFieldValue(`job_posting_data.${name}`)
        .filter((_: string, i: number) => i !== index)
    )

  return (
    <FieldGroup className="gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="job_posting_data.title">
          {(field: any) => (
            <div className="space-y-1.5">
              <Label required>Judul Lowongan</Label>
              <Input
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="Contoh: Staff Administrasi"
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>
        <form.Field name="job_posting_data.employment_type">
          {(field: any) => (
            <div className="space-y-1.5">
              <Label>Jenis Pekerjaan</Label>
              <Select
                value={field.state.value ?? ""}
                onValueChange={field.handleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kontrak">Kontrak</SelectItem>
                  <SelectItem value="magang">Magang</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              <FieldError field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="job_posting_data.branch_id">
        {(field: any) => (
          <div className="space-y-1.5">
            <Label required>Cabang</Label>
            <BranchCombobox
              value={field.state.value}
              onChange={(value) => field.handleChange(value.value)}
            />
            <FieldError field={field} />
          </div>
        )}
      </form.Field>

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="job_posting_data.deadline_at">
          {(field: any) => (
            <DateTimePicker
              mode="date"
              label="Batas Lamaran"
              required
              value={field.state.value || ""}
              onChange={(value) =>
                field.handleChange(value ? `${value}T00:00:00.000Z` : "")
              }
              onBlur={field.handleBlur}
              invalid={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              }
              error={
                field.state.meta.isTouched
                  ? String(field.state.meta.errors[0]?.message ?? "")
                  : undefined
              }
            />
          )}
        </form.Field>
        <form.Field name="job_posting_data.address">
          {(field: any) => (
            <div className="space-y-1.5">
              <Label>Alamat Penempatan</Label>
              <Input
                value={field.state.value ?? ""}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Alamat kantor"
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <form.AppField name="job_posting_data.description">
        {(field: any) => (
          <field.RichTextEditorField
            label="Deskripsi Pekerjaan"
            placeholder="Jelaskan tanggung jawab pekerjaan"
            format="markdown"
          />
        )}
      </form.AppField>

      <form.AppField name="job_posting_data.additional_info">
        {(field: any) => (
          <field.RichTextEditorField
            label="Informasi Tambahan"
            placeholder="Informasi tambahan untuk pelamar"
            format="markdown"
          />
        )}
      </form.AppField>

      <div className="space-y-2">
        <Label required>Area Penempatan</Label>
        <form.Field name="job_posting_data.areas">
          {(field: any) => (
            <>
              <SelectAreaMultiple
                value={field.state.value}
                onChange={field.handleChange}
              />
              <FieldError field={field} />
              <div className="flex flex-wrap gap-2">
                {areas.map((item: string) => (
                  <div
                    key={item}
                    className="rounded bg-muted px-2 py-1 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label required>Kualifikasi</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("qualifications")}
          >
            <Plus className="mr-1 size-4" /> Tambah
          </Button>
        </div>
        {qualifications.map((_: string, index: number) => (
          <div key={`qualification-${index}`} className="flex gap-2">
            <form.Field name={`job_posting_data.qualifications[${index}]`}>
              {(field: any) => (
                <div className="flex-1 space-y-1.5">
                  <Input
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={`Kualifikasi ${index + 1}`}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem("qualifications", index)}
              aria-label={`Hapus Kualifikasi ${index + 1}`}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </FieldGroup>
  )
}

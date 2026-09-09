import { FileText, Paperclip, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { DelegationMultiSelect } from "@/components/select/select-delegation-multi"
import { useRef } from "react"

export interface BasicInfoSectionProps {
  form: any
  departmentId: string
  showDelegations?: boolean
  onFilesChange?: (files: File[]) => void
}

export function BasicInfoSection({
  form,
  departmentId,
  showDelegations = true,
  onFilesChange,
}: BasicInfoSectionProps) {
  const filesRef = useRef<File[]>([])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Informasi Dasar</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <form.Field name="notes">
            {(field: any) => (
              <div className="flex w-full flex-col space-y-1.5">
                <Label>Catatan (Opsional)</Label>
                <Textarea
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tambahkan catatan tambahan..."
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Catatan ini akan terlihat oleh approver
                </p>
              </div>
            )}
          </form.Field>

          <form.AppField name="attachments">
            {(field: any) => {
              const fileCount = field.state.value?.length || 0
              return (
                <div className="flex w-full flex-col space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <Label>
                      Lampiran {fileCount > 0 && `(${fileCount}/5)`}
                    </Label>
                  </div>
                  <field.FileUploadField
                    label=""
                    multiple
                    maxSizeMb={10}
                    accept="image/*,.pdf,.doc,.docx"
                    onFilesChange={(files: File[]) => {
                      filesRef.current = files
                      onFilesChange?.(files)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maksimal 5 file, masing-masing 10MB. Format: gambar, PDF,
                    atau Word
                  </p>
                </div>
              )
            }}
          </form.AppField>

          {showDelegations && (
            <form.Field name="delegations">
              {(field: any) => {
                const errors = field.state.meta.errors
                const showError =
                  field.state.meta.isTouched && errors.length > 0

                return (
                  <div className="flex w-full flex-col space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Label>Delegasi</Label>
                    </div>
                    <DelegationMultiSelect
                      value={field.state.value || []}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      departmentId={departmentId}
                      invalid={showError}
                      error={
                        showError ? (errors[0]?.message ?? "") : undefined
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Pilih staff yang akan menerima delegasi pekerjaan selama
                      Anda tidak hadir
                    </p>
                  </div>
                )
              }}
            </form.Field>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

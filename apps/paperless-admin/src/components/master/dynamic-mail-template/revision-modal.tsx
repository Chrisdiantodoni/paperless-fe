import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import type { RevisionRequestForm } from "~/schema/master/schema"
import { revisionRequestSchema } from "~/schema/master/schema"

interface RevisionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: RevisionRequestForm) => void
  isLoading?: boolean
}

const scopeOptions = [
  { value: "recipients", label: "Penerima Email" },
  { value: "scope", label: "Departemen/Cabang/Posisi" },
  { value: "form_schema", label: "Form Schema" },
  { value: "content", label: "Konten Email" },
]

export function RevisionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: RevisionModalProps) {
  const form = useForm({
    defaultValues: {
      reason: "",
      scope_changes: [] as string[],
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: revisionRequestSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Request Revision</DialogTitle>
          <DialogDescription>
            Berikan alasan mengapa template ini perlu direvisi. Anda juga bisa
            menandai bagian mana yang perlu diubah.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-4 py-4">
            <form.Field name="reason">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    Alasan Revisi <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id={field.name}
                    placeholder="Jelaskan mengapa template ini perlu direvisi..."
                    rows={4}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="scope_changes">
              {(field) => (
                <div className="space-y-3">
                  <Label>Bagian yang Perlu Diubah (Opsional)</Label>
                  <div className="space-y-2">
                    {scopeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={field.state.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const current = field.state.value || []
                            if (checked) {
                              field.handleChange([...current, option.value])
                            } else {
                              field.handleChange(
                                current.filter((v) => v !== option.value)
                              )
                            }
                          }}
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor={option.value}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mengirim..." : "Kirim Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

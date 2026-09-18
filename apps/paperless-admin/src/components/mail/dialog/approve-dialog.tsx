"use client"

import { useApproval } from "@/hooks/queries/use-mail"
import { useAppForm } from "@workspace/forms/src/forms"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { useState } from "react"
import type { FormEvent } from "react"
import { toast } from "sonner"
import z from "zod"

export const approvalBodySchema = z.object({
  action: z.enum(["Approved", "Rejected", "Revision"], {
    message: "Action must be 'Approved', 'Rejected', or 'Revision'",
  }),
  notes: z.string(),
})

export type ApprovalBody = z.infer<typeof approvalBodySchema>

export function ApproveDialog({ mailId }: { mailId: string }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: approve, isPending } = useApproval()

  const form = useAppForm({
    defaultValues: {
      action: "Approved" as ApprovalBody["action"],
      notes: "",
    },
    validators: {
      onSubmit: approvalBodySchema,
    },
    canSubmitWhenInvalid: true,
    onSubmit: async ({ value }) => {
      try {
        await approve({ id: mailId, body: value })
        toast.success("Status surat berhasil diperbarui")
        setOpen(false)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal memperbarui status surat")
      }
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    void form.handleSubmit()
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Setuju</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Status Surat</DialogTitle>
          </DialogHeader>

          <FieldGroup className="gap-2 pt-8 pb-4">
            <form.AppField name="action">
              {(field) => (
                <field.SelectField
                  label="Action"
                  required
                  options={[
                    { value: "Approved", label: "Setuju" },
                    { value: "Rejected", label: "Tolak" },
                    { value: "Revision", label: "Revisi" },
                  ]}
                />
              )}
            </form.AppField>
            <form.AppField name="notes">
              {(field) => (
                <field.TextareaField
                  label="Notes"
                  placeholder="Tulis Notes..."
                  rows={4}
                />
              )}
            </form.AppField>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton
                type="submit"
                label={isPending ? "Menyimpan..." : "Simpan"}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

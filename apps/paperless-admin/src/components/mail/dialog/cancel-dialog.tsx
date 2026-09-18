"use client"

import { useCancel } from "@/hooks/queries/use-mail"
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

export const cancelBodySchema = z.object({
  notes: z.string(),
})

export type CancelBody = z.infer<typeof cancelBodySchema>

export function CancelDialog({ mailId }: { mailId: string }) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: cancel, isPending } = useCancel()

  const form = useAppForm({
    defaultValues: { notes: "" },
    validators: { onSubmit: cancelBodySchema },
    onSubmit: async ({ value }) => {
      try {
        await cancel({ id: mailId, body: value })
        toast.success("Aksi surat berhasil dibatalkan")
        setOpen(false)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal membatalkan aksi surat")
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
    if (!nextOpen) form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">Batal Aksi</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Batal Aksi Surat</DialogTitle>
          </DialogHeader>

          <FieldGroup className="py-4">
            <form.AppField name="notes">
              {(field) => (
                <field.TextareaField
                  label="Catatan"
                  placeholder="Tulis alasan pembatalan..."
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
                label={isPending ? "Membatalkan..." : "Batal Aksi"}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

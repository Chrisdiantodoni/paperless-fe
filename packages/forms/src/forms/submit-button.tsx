"use client"

import { useStore } from "@tanstack/react-form"
import { Button } from "@workspace/ui/components/ui/button"
import { Loader2 } from "lucide-react"
import { useFormContext } from "./form-context"

export function SubmitButton({
  label = "Submit",
  type = "submit",
  onClick,
}: {
  label?: string
  type?: "submit" | "button"
  onClick?: () => void
}) {
  const form = useFormContext()

  const [canSubmit, isSubmitting] = useStore(form.store, (state) => [
    state.canSubmit,
    state.isSubmitting,
  ])

  return (
    <Button
      type={type ? "submit" : undefined}
      disabled={!canSubmit || isSubmitting}
      className="gap-2"
      onClick={onClick}
    >
      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{isSubmitting ? "Simpan..." : label}</span>
    </Button>
  )
}

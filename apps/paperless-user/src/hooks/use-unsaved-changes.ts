import { useEffect, useCallback } from "react"
import { isLoggingOut } from "@/lib/logout-flag"

export interface UseUnsavedChangesOptions {
  isDirty: boolean
  message?: string
  onConfirm?: () => void
}

export function useUnsavedChanges({
  isDirty,
  message = "Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?",
  onConfirm,
}: UseUnsavedChangesOptions) {
  useEffect(() => {
    if (!isDirty) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isLoggingOut()) {
        return
      }

      event.preventDefault()
      event.returnValue = message
      return message
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isDirty, message])

  const confirmNavigation = useCallback(
    (callback: () => void) => {
      if (!isDirty) {
        callback()
        return
      }

      const confirmed = window.confirm(message)
      if (confirmed) {
        if (onConfirm) {
          onConfirm()
        }
        callback()
      }
    },
    [isDirty, message, onConfirm]
  )

  return { confirmNavigation }
}

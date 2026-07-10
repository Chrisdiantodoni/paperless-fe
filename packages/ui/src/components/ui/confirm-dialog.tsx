"use client"

/**
 * Generic, promise-based confirmation dialog. Not tied to forms at all —
 * use it before ANY risky/important action: form submit, delete button,
 * leaving a page with unsaved changes, etc.
 *
 * Setup (once, at the root of your app):
 *
 *   // app/layout.tsx
 *   import { ConfirmProvider } from "@workspace/ui/components/confirm-dialog"
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html>
 *         <body>
 *           <ConfirmProvider>{children}</ConfirmProvider>
 *         </body>
 *       </html>
 *     )
 *   }
 *
 * Usage (anywhere below the provider):
 *
 *   const confirm = useConfirm()
 *
 *   // Simple confirm (backward compatible — no loading)
 *   async function handleDelete() {
 *     const ok = await confirm({
 *       title: "Delete this template?",
 *       description: "This cannot be undone.",
 *       variant: "destructive",
 *       confirmLabel: "Delete",
 *     })
 *     if (!ok) return
 *     // proceed
 *   }
 *
 *   // Confirm with built-in loading spinner (dialog stays open)
 *   async function handleDeleteWithLoading() {
 *     await confirm({
 *       title: "Delete this template?",
 *       description: "This cannot be undone.",
 *       variant: "destructive",
 *       confirmLabel: "Delete",
 *       onConfirm: async () => {
 *         await deleteTemplate(id)
 *         toast.success("Deleted")
 *       },
 *     })
 *   }
 */

import { SpinnerIcon } from "@phosphor-icons/react"
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog"

export interface ConfirmOptions {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** "destructive" styles the confirm button red — use for delete/irreversible actions. */
  variant?: "default" | "destructive"
  /** When provided, the confirm button shows a spinner while this runs.
   *  The dialog stays open and the backdrop cannot be clicked until it completes.
   *  If it throws, the dialog stays open for retry. */
  onConfirm?: () => Promise<void> | void
}

type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  // Holds the Promise's resolve function between "confirm() called" and
  // "user clicked a button" — this is what makes `await confirm(...)` work.
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((opts = {}) => {
    setLoading(false)
    setOptions(opts)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  function settle(result: boolean) {
    setOpen(false)
    resolveRef.current?.(result)
    resolveRef.current = null
  }

  async function handleConfirm() {
    if (!options.onConfirm) {
      settle(true)
      return
    }
    setLoading(true)
    try {
      await options.onConfirm()
      settle(true)
    } catch {
      setLoading(false)
    }
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (loading) return
          if (!next) settle(false)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {options.title ?? "Apakah Anda Yakin?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {options.description ?? "Aksi ini tidak bisa dibatalkan"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => settle(false)} disabled={loading}>
              {options.cancelLabel ?? "Batal"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className={
                options.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {loading ? (
                <>
                  <SpinnerIcon className="size-4 animate-spin" />
                  Proses...
                </>
              ) : (
                (options.confirmLabel ?? "Lanjutkan")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error(
      "useConfirm() must be used inside <ConfirmProvider>. Wrap it around your app root."
    )
  }
  return ctx
}

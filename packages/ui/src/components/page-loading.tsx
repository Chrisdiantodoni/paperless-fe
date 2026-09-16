import { Loader2 } from "lucide-react"

export function PageLoading() {
  return (
    <div className="flex min-h-[min(60vh,32rem)] flex-1 items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Memuat halaman...</span>
    </div>
  )
}

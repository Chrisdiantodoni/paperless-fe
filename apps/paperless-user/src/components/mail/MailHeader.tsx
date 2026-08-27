import {
  RefreshCw,
  Search,
  SlidersHorizontal,
  Inbox,
  Send,
  ChevronDown,
  Plus,
} from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"

export interface MailHeaderProps {
  activeNav: string
  status: string
  query: string
  refreshing: boolean
  onNavChange: (nav: "all" | "sent") => void
  onStatusChange: (status: string) => void
  onQueryChange: (query: string) => void
  onRefresh: () => void
  onCompose: () => void
}

export function MailHeader({
  activeNav,
  status,
  query,
  refreshing,
  onNavChange,
  onStatusChange,
  onQueryChange,
  onRefresh,
  onCompose,
}: MailHeaderProps) {
  const statusCycle = ["Semua", "Menunggu", "Disetujui"]
  const nextStatus =
    statusCycle[(statusCycle.indexOf(status) + 1) % statusCycle.length]

  return (
    <div className="border-border bg-card py-2">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {activeNav === "sent" ? "Terkirim" : "Semua Surat"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola permohonan dan surat-menyurat internal
        </p>
      </div>
      <header className="flex flex-col gap-4 border-b bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Compose button & nav tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onCompose} size="sm" className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Buat</span>
          </Button>
          <div className="mx-1 hidden h-4 w-[1px] bg-border sm:block" />
          <div className="flex items-center gap-1 rounded-md bg-muted/60 p-1">
            <Button
              variant={activeNav === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavChange("all")}
              className="h-8 gap-2 px-3 text-xs font-medium"
            >
              <Inbox className="h-3.5 w-3.5" />
              Semua Surat
            </Button>
            <Button
              variant={activeNav === "sent" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavChange("sent")}
              className="h-8 gap-2 px-3 text-xs font-medium"
            >
              <Send className="h-3.5 w-3.5" />
              Terkirim
            </Button>
          </div>
        </div>
        {/* Right: Search bar & action/filter buttons */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari surat, orang, atau dokumen..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="h-9 w-full bg-muted/40 pr-4 pl-8 text-sm placeholder:text-muted-foreground focus-visible:bg-background"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={refreshing}
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            title="Muat ulang surat"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(nextStatus)}
            className="h-9 shrink-0 gap-1.5 px-3 text-xs font-medium"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{status}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      </header>
    </div>
  )
}

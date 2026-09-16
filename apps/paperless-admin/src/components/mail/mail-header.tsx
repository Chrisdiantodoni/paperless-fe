import { PageHeader } from "@workspace/ui/components/page-header"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Popover, PopoverTrigger } from "@workspace/ui/components/ui/popover"
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface MailHeaderProps {
  onSkipMail?: () => void
  onCancelRecipient?: () => void
}

export default function MailHeader({
  onSkipMail,
  onCancelRecipient,
}: MailHeaderProps) {
  const [open, setOpen] = useState(false)

  // const activeCount =
  //   [
  //     filters.request_type,
  //     filters.status,
  //     filters.sort_by,
  //     filters.sort_dir,
  //   ].filter(Boolean).length + (filters.start_date || filters.end_date ? 1 : 0)

  const activeCount = 0

  const refreshing = false
  return (
    <div className="border-border bg-card py-2">
      <PageHeader title="All Mail" description="Kelola semua surat yang ada" />

      <header className="flex flex-col gap-4 border-b bg-background p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2"></div>
        <div className="flex flex-1 items-center justify-end gap-2 lg:max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari surat, orang, atau dokumen..."
              // value={query}
              // onChange={(e) => onQueryChange(e.target.value)}
              className="h-9 w-full bg-muted/40 pr-4 pl-8 text-sm placeholder:text-muted-foreground focus-visible:bg-background"
            />
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative h-9 shrink-0 gap-1.5 px-3 text-xs font-medium"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                Filter
                {activeCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full px-1 text-[9px]">
                    {activeCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            // onClick={onRefresh}
            // disabled={refreshing}
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            title="Muat ulang surat"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </header>
    </div>
  )
}

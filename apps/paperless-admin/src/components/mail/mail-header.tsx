import { useDebounce } from "@/hooks/use-debounce"
import { useNavigate } from "@tanstack/react-router"
import { PageHeader } from "@workspace/ui/components/page-header"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { getRequestTypeOptions } from "@workspace/utils"
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"

export interface MailFilterState {
  request_type?: string
  status?: string
  start_date?: string
  end_date?: string
  sort_by?: string
  sort_dir?: string
}

interface MailHeaderProps {
  onFiltersChange: (filters: MailFilterState) => void
  filterValue: MailFilterState
  refreshing: boolean
  onRefresh: () => void
}

const REQUEST_TYPES = getRequestTypeOptions()

const STATUS_OPTIONS = [
  { value: "Draft", label: "Draft", dot: "bg-muted" },
  { value: "Sent", label: "Terkirim", dot: "bg-blue-500" },
  { value: "Revision", label: "Revisi", dot: "bg-blue-500" },
  { value: "Approved", label: "Disetujui", dot: "bg-emerald-500" },
  { value: "Rejected", label: "Ditolak", dot: "bg-rose-500" },
]

const SORT_OPTIONS = [
  { value: "created_at", label: "Tanggal Dibuat" },
  { value: "status", label: "Status" },
  { value: "document_number", label: "No. Dokumen" },
]

export default function MailHeader({
  filterValue,
  onFiltersChange,
  refreshing,
  onRefresh,
}: MailHeaderProps) {
  const navigate = useNavigate({ from: "/mail/all-mails" })
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearchValue = useDebounce(search, 500)

  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: debouncedSearchValue || undefined,
        page: 1,
      }),
    })
  }, [debouncedSearchValue])

  const [filters, setFilters] = useState<MailFilterState>(filterValue)

  const applyFilters = (next: MailFilterState) => {
    setFilters(next)
    onFiltersChange(next)
    setOpen(false)
  }
  const resetFilters = () => {
    setFilters({})
    onFiltersChange({})
    setOpen(false)
  }

  const activeCount =
    [
      filters.request_type,
      filters.status,
      filters.sort_by,
      filters.sort_dir,
    ].filter(Boolean).length + (filters.start_date || filters.end_date ? 1 : 0)

  return (
    <div className="border-border bg-card py-2">
      <PageHeader title="All Mail" description="Kelola semua surat yang ada" />

      <header className="flex flex-col gap-4 border-b bg-background p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="hidden lg:block" />
        <div className="flex flex-1 items-center justify-end gap-2 lg:max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari surat, orang, atau dokumen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            <PopoverContent align="end" className="w-72">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Jenis Permohonan
                  </p>
                  <Select
                    value={filters.request_type ?? "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        request_type: value === "all" ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Semua jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua jenis</SelectItem>
                      {REQUEST_TYPES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Status
                  </p>
                  <Select
                    value={filters.status ?? "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: value === "all" ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Semua status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua status</SelectItem>
                      {STATUS_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <span className="flex items-center gap-2">
                            <span
                              className={`size-2 rounded-full ${item.dot}`}
                            />
                            {item.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Rentang Tanggal
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={filters.start_date ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          start_date: e.target.value || undefined,
                        }))
                      }
                      className="h-8"
                    />
                    <Input
                      type="date"
                      value={filters.end_date ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          end_date: e.target.value || undefined,
                        }))
                      }
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Urutkan
                    </p>
                    <Select
                      value={filters.sort_by ?? "created_at"}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          sort_by: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Arah
                    </p>
                    <Select
                      value={filters.sort_dir ?? "desc"}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          sort_dir: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Terbaru</SelectItem>
                        <SelectItem value="asc">Terlama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-1 flex justify-end gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => applyFilters(filterValue)}>
                    Terapkan
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
        </div>
      </header>
    </div>
  )
}

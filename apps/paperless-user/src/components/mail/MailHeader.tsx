import { RefreshCw, Search, SlidersHorizontal, Inbox, Send, ChevronDown } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'

export interface MailHeaderProps {
  activeNav: string
  status: string
  query: string
  refreshing: boolean
  onNavChange: (nav: string) => void
  onStatusChange: (status: string) => void
  onQueryChange: (query: string) => void
  onRefresh: () => void
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
}: MailHeaderProps) {
  const statusCycle = ['All', 'Pending', 'Approved']
  const nextStatus = statusCycle[(statusCycle.indexOf(status) + 1) % statusCycle.length]

  return (
    <div className="border-b border-border bg-card px-5 py-5 lg:px-8">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {activeNav === 'sent' ? 'Sent' : 'All mail'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage requests and internal correspondence
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={activeNav === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onNavChange('all')}
            className="gap-2"
          >
            <Inbox className="h-4 w-4" />
            All mail
          </Button>
          <Button
            variant={activeNav === 'sent' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onNavChange('sent')}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Sent
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          <div className="relative flex items-center gap-1 rounded-lg bg-muted p-1">
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search mail, people, or documents"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(nextStatus)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {status}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

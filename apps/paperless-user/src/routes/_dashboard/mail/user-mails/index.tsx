import { createFileRoute } from "@tanstack/react-router"
import { useSidebar } from "@workspace/ui/components/ui/sidebar"
import { useEffect } from "react"

import {
  MailHeader,
  MailList,
  MailDetail,
  ApprovalDialog,
} from "@/components/mail"
import { useMailData } from "@/hooks/queries/use-mail-data"

export const Route = createFileRoute("/_dashboard/mail/user-mails/")({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    mails,
    activeNav,
    setActiveNav,
    selectedId,
    setSelectedId,
    query,
    setQuery,
    status,
    setStatus,
    selected,
    setSelected,
    refreshing,
    refresh,
    page,
    setPage,
    approvalNote,
    setApprovalNote,
    approvalOpen,
    setApprovalOpen,
    approvalStatus,
    setApprovalStatus,
    filtered,
    visibleMails,
    pageCount,
    pageSize,
  } = useMailData()

  const { open: sidebarOpen } = useSidebar()

  const current = mails.find((mail) => mail.id === selectedId) ?? mails[0]
  const displayedStatus = approvalStatus[current.id] ?? current.status

  useEffect(() => {
    if (filtered.length > 0 && !filtered.find((mail) => mail.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filtered, selectedId, setSelectedId])

  const handleSelectAll = () => {
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((mail) => mail.id)
    )
  }

  const toggle = (id: number) =>
    setSelected((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    )

  const moveSelection = (direction: -1 | 1) => {
    const index = filtered.findIndex((mail) => mail.id === selectedId)
    const nextIndex = index + direction
    if (nextIndex >= 0 && nextIndex < filtered.length) {
      const next = filtered[nextIndex]
      setSelectedId(next.id)
      setPage(
        Math.floor(
          filtered.findIndex((mail) => mail.id === next.id) / pageSize
        ) + 1
      )
    }
  }

  const submitApproval = (nextStatus: "Approved" | "Rejected") => {
    setApprovalStatus((items) => ({ ...items, [current.id]: nextStatus }))
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <MailHeader
        activeNav={activeNav}
        status={status}
        query={query}
        refreshing={refreshing}
        onNavChange={setActiveNav}
        onStatusChange={setStatus}
        onQueryChange={setQuery}
        onRefresh={refresh}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch">
        <div className="w-full shrink-0 border-r border-border lg:w-[52%] xl:w-[48%]">
          <MailList
            visibleMails={visibleMails}
            filtered={filtered}
            page={page}
            pageSize={pageSize}
            pageCount={pageCount}
            selected={selected}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onToggle={toggle}
            onSelectAll={handleSelectAll}
            onPageChange={setPage}
          />
        </div>

        <article className="hidden min-w-0 flex-1 lg:block">
          <MailDetail
            current={current}
            displayedStatus={displayedStatus}
            filtered={filtered}
            selectedId={selectedId}
            onOpenApproval={() => setApprovalOpen(true)}
            onMoveSelection={moveSelection}
          />
        </article>
      </div>

      <ApprovalDialog
        open={approvalOpen}
        approvalNote={approvalNote}
        onNoteChange={setApprovalNote}
        onClose={() => setApprovalOpen(false)}
        onApprove={() => {
          submitApproval("Approved")
          setApprovalOpen(false)
        }}
        onReject={() => {
          submitApproval("Rejected")
          setApprovalOpen(false)
        }}
      />
    </main>
  )
}

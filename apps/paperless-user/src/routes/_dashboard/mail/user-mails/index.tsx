import { createFileRoute } from "@tanstack/react-router"

import {
  MailHeader,
  MailList,
  MailDetail,
  MailEmptyState,
  ApprovalDialog,
} from "@/components/mail"
import { useMailData } from "@/hooks/queries/use-mail-data"

export const Route = createFileRoute("/_dashboard/mail/user-mails/")({
  component: RouteComponent,
})

function RouteComponent() {
  const {
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
    filtered,
    visibleMails,
    pageCount,
    pageSize,
    showDetail,
    setShowDetail,
    current,
    displayedStatus,
    submitApproval,
  } = useMailData()

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

  const handleClose = () => {
    setSelectedId(null)
    setShowDetail(false)
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
        <div
          className={`w-full shrink-0 border-b border-border lg:block lg:w-[360px] lg:border-b-0 lg:border-r xl:w-[400px] ${
            showDetail ? "hidden" : "flex flex-col"
          }`}
        >
          <MailList
            visibleMails={visibleMails}
            filtered={filtered}
            page={page}
            pageSize={pageSize}
            pageCount={pageCount}
            selected={selected}
            selectedId={selectedId}
            onToggle={toggle}
            onSelectAll={handleSelectAll}
            onPageChange={setPage}
            onItemClick={(id) => {
              setSelectedId(id)
              setShowDetail(true)
            }}
          />
        </div>

        <article
          className={`min-w-0 flex-1 lg:block ${showDetail ? "block" : "hidden"}`}
        >
          {current ? (
            <MailDetail
              current={current}
              displayedStatus={displayedStatus}
              filtered={filtered}
              selectedId={selectedId}
              onOpenApproval={() => setApprovalOpen(true)}
              onMoveSelection={moveSelection}
              onClose={handleClose}
              showCloseButton
            />
          ) : (
            <MailEmptyState />
          )}
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

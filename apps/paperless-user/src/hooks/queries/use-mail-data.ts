import type { ListRequestQueryMail } from "@/schema/mail/schema"
import { useMemo, useState } from "react"

export interface Mail {
  id: number
  document: string
  subject: string
  sender: string
  initials: string
  department: string
  branch: string
  date: string
  status: string
  leave: string
  reason: string
  attachments: number
  unread: boolean
}

export function useMailData(search: ListRequestQueryMail) {
  const [activeNav, setActiveNav] = useState(search.type)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [approvalStatus, setApprovalStatus] = useState<
    Record<number, "Approved" | "Rejected">
  >({})
  const [approvalNote, setApprovalNote] = useState("")
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const current = selectedId

  const submitApproval = (nextStatus: "Approved" | "Rejected") => {
    if (!current) return
    setApprovalStatus((items) => ({ ...items, [current.id]: nextStatus }))
  }

  return {
    activeNav,
    setActiveNav,
    selectedId,
    setSelectedId,
    query,
    setQuery,
    status,
    setStatus,
    page,
    setPage,
    approvalStatus,
    setApprovalStatus,
    approvalNote,
    setApprovalNote,
    approvalOpen,
    setApprovalOpen,
    refreshing,
    setRefreshing,
    showDetail,
    setShowDetail,
    current,
    submitApproval,
  }
}

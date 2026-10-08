import type { ListRequestQueryMail } from "@/schema/mail/schema"
import { useState } from "react"

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
  const [query, setQuery] = useState(search.search ?? "")
  const [approvalNote, setApprovalNote] = useState("")
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  return {
    activeNav,
    setActiveNav,
    selectedId,
    setSelectedId,
    query,
    setQuery,
    approvalNote,
    setApprovalNote,
    approvalOpen,
    setApprovalOpen,
    refreshing,
    setRefreshing,
    showDetail,
    setShowDetail,
  }
}

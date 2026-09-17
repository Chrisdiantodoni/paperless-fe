import type { ListRequestQueryMail } from "@/schema/mail/schema"
import { useState } from "react"

export const useMailData = (search: ListRequestQueryMail) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [approvalStatus, setApprovalStatus] = useState<
    Record<number, "Approved" | "Rejected">
  >({})
  const [refreshing, setRefreshing] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const current = selectedId

  return {
    selectedId,
    setSelectedId,
    status,
    setStatus,
    page,
    setPage,
    approvalStatus,
    setApprovalStatus,
    refreshing,
    setRefreshing,
    showDetail,
    setShowDetail,
    current,
  }
}

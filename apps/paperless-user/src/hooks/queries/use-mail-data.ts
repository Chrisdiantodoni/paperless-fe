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

export function useMailData() {
  const mails: Mail[] = [
    {
      id: 1,
      document: "LR-2024-0148",
      subject: "Annual leave request",
      sender: "Nadia Putri",
      initials: "NP",
      department: "Product Design",
      branch: "Jakarta HQ",
      date: "Today, 10:42",
      status: "Pending",
      leave: "Annual leave · 12–16 Aug 2024",
      reason: "Family holiday",
      attachments: 2,
      unread: true,
    },
    {
      id: 2,
      document: "LR-2024-0147",
      subject: "Sick leave request",
      sender: "Rizky Aditya",
      initials: "RA",
      department: "Engineering",
      branch: "Bandung",
      date: "Today, 09:18",
      status: "Approved",
      leave: "Sick leave · 8 Aug 2024",
      reason: "Medical appointment",
      attachments: 1,
      unread: false,
    },
    {
      id: 3,
      document: "LR-2024-0146",
      subject: "Annual leave request",
      sender: "Maya Sari",
      initials: "MS",
      department: "Marketing",
      branch: "Jakarta HQ",
      date: "Yesterday",
      status: "Pending",
      leave: "Annual leave · 19–23 Aug 2024",
      reason: "Personal travel",
      attachments: 0,
      unread: true,
    },
    {
      id: 4,
      document: "LR-2024-0145",
      subject: "Work from home request",
      sender: "Dimas Wibowo",
      initials: "DW",
      department: "Finance",
      branch: "Surabaya",
      date: "Aug 6, 2024",
      status: "Rejected",
      leave: "Remote work · 9 Aug 2024",
      reason: "Home maintenance",
      attachments: 0,
      unread: false,
    },
    {
      id: 5,
      document: "LR-2024-0144",
      subject: "Annual leave request",
      sender: "Sarah Lim",
      initials: "SL",
      department: "People Ops",
      branch: "Singapore",
      date: "Aug 5, 2024",
      status: "Approved",
      leave: "Annual leave · 26–30 Aug 2024",
      reason: "Rest and recharge",
      attachments: 1,
      unread: false,
    },
  ]

  const [activeNav, setActiveNav] = useState("All mail")
  const [selectedId, setSelectedId] = useState(1)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [selected, setSelected] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [approvalStatus, setApprovalStatus] = useState<
    Record<number, "Approved" | "Rejected">
  >({})
  const [approvalNote, setApprovalNote] = useState("")
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const pageSize = 3

  const filtered = useMemo(
    () =>
      mails.filter((mail) => {
        const haystack =
          `${mail.subject} ${mail.sender} ${mail.document} ${mail.department}`.toLowerCase()
        return (
          haystack.includes(query.toLowerCase()) &&
          (status === "All" || mail.status === status) &&
          (activeNav !== "Sent" || mail.id > 3)
        )
      }),
    [query, status, activeNav]
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleMails = filtered.slice((page - 1) * pageSize, page * pageSize)
  const current = mails.find((mail) => mail.id === selectedId) ?? mails[0]
  const displayedStatus = approvalStatus[current.id] ?? current.status

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
      setPage(Math.floor(nextIndex / pageSize) + 1)
    }
  }

  const submitApproval = (nextStatus: "Approved" | "Rejected") => {
    setApprovalStatus((items) => ({ ...items, [current.id]: nextStatus }))
  }

  const refresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 600)
  }

  return {
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
    filtered,
    pageCount,
    visibleMails,
    current,
    displayedStatus,
    toggle,
    moveSelection,
    submitApproval,
    refresh,
  }
}

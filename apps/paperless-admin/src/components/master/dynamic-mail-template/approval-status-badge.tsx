import { Badge } from "@workspace/ui/components/ui/badge"

interface ApprovalStatusBadgeProps {
  status: "draft" | "pending" | "approved" | "rejected"
}

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "secondary" as const,
  },
  pending: {
    label: "Menunggu Approval",
    variant: "outline" as const,
  },
  approved: {
    label: "Approved",
    variant: "default" as const,
  },
  rejected: {
    label: "Ditolak",
    variant: "destructive" as const,
  },
}

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant={config?.variant ?? "default"}>
      {config?.label ?? status}
    </Badge>
  )
}

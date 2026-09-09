import { Calendar, FileText, Paperclip, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { formatDateRange, formatSingleDate } from "@/lib/date-utils"

export interface SummaryCardProps {
  templateLabel: string
  departmentLabel: string
  startDate?: string
  endDate?: string
  singleDate?: string
  duration?: string
  delegations?: Array<{ label?: string; value: string }>
  attachmentCount?: number
  status?: "draft" | "ready"
}

export function SummaryCard({
  templateLabel,
  departmentLabel,
  startDate,
  endDate,
  singleDate,
  duration,
  delegations = [],
  attachmentCount = 0,
  status = "draft",
}: SummaryCardProps) {
  const isReady = status === "ready"

  const dateDisplay = startDate && endDate
    ? formatDateRange(startDate, endDate)
    : singleDate
      ? formatSingleDate(singleDate)
      : "-"

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">Ringkasan</CardTitle>
          <Badge variant={isReady ? "default" : "secondary"} className="text-xs">
            {isReady ? "Siap Kirim" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Template</p>
            <p className="mt-1 font-medium">{templateLabel}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Departemen
            </p>
            <p className="mt-1">{departmentLabel}</p>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Tanggal</span>
            </div>
            <p className="mt-1">{dateDisplay}</p>
          </div>

          {duration && (
            <div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-medium">Durasi</span>
              </div>
              <p className="mt-1">{duration}</p>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Delegasi</span>
            </div>
            <p className="mt-1">
              {delegations.length > 0
                ? `${delegations.length} staff`
                : "Tidak ada"}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Paperclip className="h-4 w-4" />
              <span className="text-xs font-medium">Lampiran</span>
            </div>
            <p className="mt-1">{attachmentCount} file</p>
          </div>
        </div>

        {delegations.length > 0 && (
          <div className="border-t pt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Staff Delegasi:
            </p>
            <div className="space-y-1">
              {delegations.slice(0, 3).map((delegation, index) => (
                <p key={index} className="text-sm">
                  {delegation.label || delegation.value}
                </p>
              ))}
              {delegations.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{delegations.length - 3} lainnya
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

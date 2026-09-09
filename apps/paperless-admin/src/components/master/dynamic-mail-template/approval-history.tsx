import type { ApprovalHistoryItem } from "@workspace/types"
import { formatDate } from "@workspace/utils"
import { Card, CardContent } from "@workspace/ui/components/card"
import { ApprovalStatusBadge } from "./approval-status-badge"

interface ApprovalHistoryProps {
  history: ApprovalHistoryItem[]
}

const scopeLabels: Record<string, string> = {
  recipients: "Penerima Email",
  scope: "Departemen/Cabang/Posisi",
  form_schema: "Form Schema",
  content: "Konten Email",
}

export function ApprovalHistory({ history }: ApprovalHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Belum ada history approval
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((item, index) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <ApprovalStatusBadge status={item.status} />
                  <span className="text-sm text-muted-foreground">
                    #{history.length - index}
                  </span>
                </div>

                {item.reason && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Alasan:</p>
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                  </div>
                )}

                {item.scope_changes && item.scope_changes.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Perubahan yang Diminta:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {item.scope_changes.map((scope) => (
                        <li key={scope}>
                          {scopeLabels[scope] || scope}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <span>
                    <strong>Oleh:</strong> {item.created_by_name}
                  </span>
                  <span>
                    <strong>Tanggal:</strong> {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

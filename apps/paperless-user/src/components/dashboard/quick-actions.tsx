import type { Icon } from "@phosphor-icons/react"
import { Envelope, PlusCircle } from "@phosphor-icons/react"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Link } from "@tanstack/react-router"

interface QuickAction {
  icon: Icon
  label: string
  to: string
}

const actions: QuickAction[] = [
  { icon: PlusCircle, label: "Buat Surat Baru", to: "/mail/user-mails/create" },
  { icon: Envelope, label: "Lihat Semua Surat", to: "/mail/user-mails" },
]

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Aksi Cepat</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link key={action.to + action.label} to={action.to}>
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <action.icon
                  className="h-4 w-4 flex-shrink-0"
                  weight="duotone"
                />
                <span className="text-sm font-medium">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

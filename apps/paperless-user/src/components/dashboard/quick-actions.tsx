import type { Icon } from "@phosphor-icons/react"
import {
  Archive,
  Envelope,
  PaperPlaneRight,
  PlusCircle,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Link } from "@tanstack/react-router"

interface QuickAction {
  icon: Icon
  label: string
  to: string
}

const actions: QuickAction[] = [
  { icon: PlusCircle, label: "Buat Surat Baru", to: "/mail/user-mails/create" },
  { icon: Envelope, label: "Lihat Surat Masuk", to: "/mail/user-mails" },
  {
    icon: PaperPlaneRight,
    label: "Lihat Surat Keluar",
    to: "/mail/user-mails",
  },
  { icon: Archive, label: "Arsip Surat", to: "/mail/user-mails" },
]

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.to + action.label} to={action.to}>
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <action.icon className="h-4 w-4 flex-shrink-0" weight="duotone" />
                <span className="text-sm font-medium">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { useDashboardSummary } from "@/hooks/useDashboard"
import { createFileRoute } from "@tanstack/react-router"
import { FileText, ClipboardCheck, Clock4, AlertCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: RouteComponent,
})

type Variant = "default" | "info" | "success" | "warning"

const variantStyles: Record<Variant, string> = {
  default: "bg-muted/40",
  info: "bg-status-info/10",
  success: "bg-status-success/10",
  warning: "bg-status-warning/10",
}

const iconColors: Record<Variant, string> = {
  default: "text-slate-600 dark:text-slate-400",
  info: "text-blue-600 dark:text-blue-400",
  success: "text-green-600 dark:text-green-400",
  warning: "text-amber-600 dark:text-amber-400",
}

const iconBgColors: Record<Variant, string> = {
  default:
    "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700",
  info: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900",
  success:
    "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900",
  warning:
    "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900",
}

function RouteComponent() {
  const { data: summary } = useDashboardSummary()

  const stats = [
    {
      title: "Urgent",
      value: summary.inbox.urgent,
      icon: FileText,
      variant: "warning" as Variant,
    },
    {
      title: "Disetujui",
      value: summary.inbox.approved,
      icon: ClipboardCheck,
      variant: "success" as Variant,
    },
    {
      title: "Revisi & Ditolak",
      value: summary.inbox.revision_and_rejected,
      icon: AlertCircle,
      variant: "info" as Variant,
    },
    {
      title: "Draft",
      value: summary.outbox.draft,
      icon: Clock4,
      variant: "default" as Variant,
    },
  ]

  return (
    <PageWrapper className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Ringkasan sistem paperless office"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className={cn(
                "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                variantStyles[stat.variant]
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div
                    className={cn("rounded-xl p-3", iconBgColors[stat.variant])}
                  >
                    <Icon className={cn("h-6 w-6", iconColors[stat.variant])} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </PageWrapper>
  )
}

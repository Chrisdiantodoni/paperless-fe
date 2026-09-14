import type { Icon } from "@phosphor-icons/react"
import * as PhosphorIcons from "@phosphor-icons/react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Skeleton } from "@workspace/ui/components/ui/skeleton"
import { cn } from "@workspace/ui/lib/utils"

type Variant = "default" | "info" | "success" | "warning"

interface StatsCardProps {
  title: string
  value?: number
  icon: keyof typeof PhosphorIcons
  variant?: Variant
  badgeCount?: number
  isLoading?: boolean
}

const variantStyles: Record<Variant, string> = {
  default: "bg-muted/40",
  info: "bg-status-info/10",
  success: "bg-status-success/10",
  warning: "bg-status-warning/10",
}

const iconColors: Record<Variant, string> = {
  default: "text-status-neutral",
  info: "text-status-info",
  success: "text-status-success",
  warning: "text-status-warning",
}

const iconBgColors: Record<Variant, string> = {
  default: "bg-muted",
  info: "bg-status-info/15",
  success: "bg-status-success/15",
  warning: "bg-status-warning/15",
}

export function StatsCard({
  title,
  value,
  icon,
  variant = "default",
  badgeCount,
  isLoading,
}: StatsCardProps) {
  const IconComponent = PhosphorIcons[icon] as Icon

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        variantStyles[variant],
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{value ?? 0}</p>
            )}
          </div>
          <div className="relative">
            <div className={cn("rounded-xl p-3", iconBgColors[variant])}>
              <IconComponent
                className={cn("h-6 w-6", iconColors[variant])}
                weight="duotone"
              />
            </div>
            {badgeCount !== undefined && badgeCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 min-w-5 px-1 text-xs"
              >
                {badgeCount}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { StatsCard } from "@/components/dashboard/stats-card"
import { useDashboardStats } from "@/hooks/queries/use-dashboard-stats"
import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  return (
    <PageWrapper className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview surat dan aktivitas Anda"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Urgent"
          value={stats?.inbox.urgent}
          icon="Warning"
          variant="warning"
          badgeCount={stats?.inbox.urgent}
          isLoading={isLoading}
        />
        <StatsCard
          title="Disetujui"
          value={stats?.inbox.approved}
          icon="CheckCircle"
          variant="success"
          isLoading={isLoading}
        />
        <StatsCard
          title="Revisi & Ditolak"
          value={stats?.inbox.revision_and_rejected}
          icon="XCircle"
          variant="info"
          isLoading={isLoading}
        />
        <StatsCard
          title="Draft"
          value={stats?.outbox.draft}
          icon="Clock"
          variant="default"
          isLoading={isLoading}
        />
      </div>

      <QuickActions />
    </PageWrapper>
  )
}

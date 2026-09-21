import { Link, createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { Button } from "@workspace/ui/components/ui/button"

export const Route = createFileRoute("/_dashboard/system/roles")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageWrapper className="space-y-6">
      <PageHeader
        title="Peran & Izin"
        description="Pengelolaan peran belum tersedia di portal admin."
      />
      <Button asChild variant="outline">
        <Link to="/system/users" search={{ page: 1, search: "" }}>
          Kelola pengguna
        </Link>
      </Button>
    </PageWrapper>
  )
}

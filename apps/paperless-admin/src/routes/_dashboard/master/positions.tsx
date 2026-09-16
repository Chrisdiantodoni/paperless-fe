import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/master/positions")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageWrapper>
      <PageHeader title="Positions" />
    </PageWrapper>
  )
}

import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { createFileRoute } from "@tanstack/react-router"
import { getArea } from "@/server/master"

export const Route = createFileRoute("/_dashboard/master/areas")({
  loader: async () => {
    const res = await getArea()
    return res
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: value } = Route.useLoaderData()

  return (
    <PageWrapper>
      <PageHeader title="Areas" />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </PageWrapper>
  )
}

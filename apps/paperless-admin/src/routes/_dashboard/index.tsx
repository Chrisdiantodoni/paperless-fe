import { PageHeader } from "@workspace/ui/components/page-header"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/")({
  beforeLoad: ({ context }) => {
    // Ambil data 'user' yang sebenarnya dari context, bukan seluruh context
    return {
      user: context.user,
    }
  },
  loader: ({ context }) => ({ user: context.user }),
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return (
    <PageWrapper>
      <PageHeader title="Dashboard" />
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </PageWrapper>
  )
}

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

  return <div>{JSON.stringify(user)}</div>
}

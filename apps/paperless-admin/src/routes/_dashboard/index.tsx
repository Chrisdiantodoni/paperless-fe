import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/")({
  beforeLoad: async ({ context }) => {
    const user = await context
    return { user }
  },
  loader: ({ context }) => ({ user: context.user }),
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return <div>{JSON.stringify(user)}</div>
}

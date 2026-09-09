import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return <div>{JSON.stringify(user)}</div>
}

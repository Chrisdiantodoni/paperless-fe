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

  return <div>{JSON.stringify(value)}</div>
}

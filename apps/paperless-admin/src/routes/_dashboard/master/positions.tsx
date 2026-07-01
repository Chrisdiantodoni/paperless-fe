import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/master/positions")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/master/positions"!</div>
}

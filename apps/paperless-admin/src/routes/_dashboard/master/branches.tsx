import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/master/branches")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/master/branch"!</div>
}

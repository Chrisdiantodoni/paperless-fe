import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/master/departments")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/master/departments"!</div>
}

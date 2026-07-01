import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/master/staffs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/master/staffs"!</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/system/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/system/users"!</div>
}

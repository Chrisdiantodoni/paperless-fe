import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/system/roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/system/roles"!</div>
}

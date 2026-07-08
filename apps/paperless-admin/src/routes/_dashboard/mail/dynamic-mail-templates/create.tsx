import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_dashboard/mail/dynamic-mail-templates/create',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/mail/dynamic-mail-templates/create"!</div>
}

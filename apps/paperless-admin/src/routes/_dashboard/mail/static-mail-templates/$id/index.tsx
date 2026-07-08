import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_dashboard/mail/static-mail-templates/$id/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/mail/static-mail-template/id/"!</div>
}

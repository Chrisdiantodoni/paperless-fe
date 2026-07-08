import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/mail/dynamic-mail-templates/')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_dashboard/mail/dynamic-mail-template/"!</div>
}

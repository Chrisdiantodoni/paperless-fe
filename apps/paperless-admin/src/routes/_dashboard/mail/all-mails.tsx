import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/mail/all-mails')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/mail/all-mails"!</div>
}

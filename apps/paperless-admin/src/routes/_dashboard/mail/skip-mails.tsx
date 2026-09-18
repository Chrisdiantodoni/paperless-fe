import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/mail/skip-mails')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/mail/skip-mails"!</div>
}

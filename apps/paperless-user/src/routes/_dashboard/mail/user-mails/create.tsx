import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/mail/user-mails/create")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/mail/user-mails/create"!</div>
}

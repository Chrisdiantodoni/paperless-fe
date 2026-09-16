import MailHeader from "@/components/mail/mail-header"
import { createFileRoute } from "@tanstack/react-router"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"

export const Route = createFileRoute("/_dashboard/mail/all-mails")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex h-screen flex-col bg-background text-foreground">
      <PageWrapper className="shrink-0 space-y-6">
        <MailHeader />
      </PageWrapper>
    </main>
  )
}

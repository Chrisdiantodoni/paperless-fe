import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { DevTicketForm } from "@workspace/ui/components/auth/dev-ticket-form"
import { verifySSOTicket } from "@/server/auth"

export const Route = createFileRoute("/auth/dev-ticket")({
  component: DevTicketPage,
  beforeLoad: async () => {
    if (!import.meta.env.DEV) {
      throw redirect({ to: "/dashboard" })
    }
  },
})

function DevTicketPage() {
  const navigate = useNavigate()

  const handleSubmitTicket = async (ticket: string): Promise<string | null> => {
    try {
      await verifySSOTicket({ data: { ticket } })
      navigate({ to: "/dashboard" })
      return null
    } catch (error) {
      return error instanceof Error ? error.message : "Ticket tidak valid."
    }
  }

  return <DevTicketForm onSubmitTicket={handleSubmitTicket} />
}

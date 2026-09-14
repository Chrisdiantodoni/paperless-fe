import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { DevTicketForm } from "@workspace/ui/components/auth/dev-ticket-form"
import { verifySSOTicket } from "@/server/auth"
import sso from "@/services/API/sso"

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

  const handleLogin = async (username: string, password: string): Promise<string> => {
    const portalId = import.meta.env.VITE_PORTAL_ID
    if (!portalId) {
      throw new Error("VITE_PORTAL_ID tidak ditemukan dalam environment variables.")
    }

    const { token } = await sso.login(username, password)
    const { ticket } = await sso.generateTicket(portalId, token)
    return ticket
  }

  return <DevTicketForm onSubmitTicket={handleSubmitTicket} onLogin={handleLogin} />
}

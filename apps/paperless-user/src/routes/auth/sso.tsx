// app/routes/auth/sso.tsx
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Loader2 } from "lucide-react"
import { ssoMiddleware } from "@/middlewares/sso"
import { verifySSOTicket } from "@/server/auth"

export const Route = createFileRoute("/auth/sso")({
  component: SSOCallbackComponent,
  server: {
    middleware: [ssoMiddleware],
  },
  beforeLoad: async ({ context }) => {
    if (context.user?.id) {
      throw redirect({ to: "/dashboard" })
    }
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      ticket: search.ticket as string,
    }
  },
})

function SSOCallbackComponent() {
  const { ticket } = Route.useSearch()
  const navigate = useNavigate()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    const startRedirect = () => {
      let count = 3
      interval = setInterval(() => {
        count -= 1
        if (count <= 0) {
          clearInterval(interval)
          window.location.href = `${import.meta.env.VITE_PORTAL_URL}`
        }
      }, 1000)
    }

    if (!ticket) {
      startRedirect()
      return () => clearInterval(interval)
    }

    const fetchSSO = async () => {
      try {
        const result = await verifySSOTicket({ data: { ticket } })
        if (result.data.token) {
          console.log(result.data.token)
          navigate({ to: "/" })
        } else {
          startRedirect()
        }
      } catch {
        startRedirect()
      }
    }

    fetchSSO()
    return () => clearInterval(interval)
  }, [ticket, navigate])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">
            {ticket ? "Memverifikasi sesi" : "Sesi tidak valid"}
          </CardTitle>
          <CardDescription>
            {ticket
              ? "Harap tunggu sebentar..."
              : "Mengalihkan ke portal..."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

// app/routes/auth/sso.tsx
import { verifySSOTicket } from "@/server/auth"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Loader2 } from "lucide-react"
import { ssoMiddleware } from "@/middlewares/sso"

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
  const [countdown, setCountdown] = useState(3)
  const [redirecting, setRedirecting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    const startRedirect = () => {
      setRedirecting(true)
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            window.location.href = `${import.meta.env.VITE_PORTAL_URL}`
          }
          return prev - 1
        })
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
          // startRedirect()
        }
      } catch {
        // startRedirect()
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
            {redirecting ? "Sesi tidak valid" : "Memverifikasi sesi"}
          </CardTitle>
          <CardDescription>
            {redirecting
              ? `Mengalihkan ke portal dalam ${countdown} detik...`
              : "Harap tunggu sebentar..."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

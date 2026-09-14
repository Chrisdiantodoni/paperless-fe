"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { KeyRound, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

interface DevTicketFormProps {
  title?: string
  description?: string
  onSubmitTicket: (ticket: string) => Promise<string | null>
  onLogin?: (username: string, password: string) => Promise<string>
}

export function DevTicketForm({
  title = "Development Session",
  description = "Login dengan username dan password.",
  onSubmitTicket,
  onLogin,
}: DevTicketFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [ticket, setTicket] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [step, setStep] = useState<"login" | "ticket">("login")

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim() || loggingIn || !onLogin) return
    setLoggingIn(true)
    setError(null)
    try {
      const generatedTicket = await onLogin(username.trim(), password.trim())
      setTicket(generatedTicket)
      setStep("ticket")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal login."
      )
    } finally {
      setLoggingIn(false)
    }
  }

  const handleSubmitTicket = async (e: FormEvent) => {
    e.preventDefault()
    if (!ticket.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const err = await onSubmitTicket(ticket.trim())
      if (err) setError(err)
    } catch {
      setError("Terjadi kesalahan. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loggingIn && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Logging in...</p>
        </div>
      )}
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <KeyRound className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loggingIn}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loggingIn}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loggingIn || !username.trim() || !password.trim()}
                >
                  {loggingIn && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dev-ticket">Ticket</Label>
                  <Input
                    id="dev-ticket"
                    type="text"
                    autoComplete="off"
                    placeholder="Ticket SSO..."
                    value={ticket}
                    onChange={(e) => setTicket(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStep("login")
                      setTicket("")
                      setPassword("")
                      setError(null)
                    }}
                    disabled={loading}
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading || !ticket.trim()}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Masuk
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

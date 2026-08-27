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
  /** Returns an error message, or null on success */
  onSubmitTicket: (ticket: string) => Promise<string | null>
}

export function DevTicketForm({
  title = "Development Session",
  description = "Masukkan ticket untuk membuat session pada mode development.",
  onSubmitTicket,
}: DevTicketFormProps) {
  const [ticket, setTicket] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dev-ticket">Ticket</Label>
              <Input
                id="dev-ticket"
                type="text"
                autoComplete="off"
                placeholder="Paste ticket SSO..."
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

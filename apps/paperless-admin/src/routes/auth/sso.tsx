// app/routes/auth/sso.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { verifySSOTicket } from "../../functions/sso"
import sso from "@/services/API/sso"

export const Route = createFileRoute("/auth/sso")({
  component: SSOCallbackComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      ticket: (search.ticket as string) || undefined,
    }
  },
})

function SSOCallbackComponent() {
  const { ticket } = Route.useSearch()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!ticket) {
      navigate({ to: "/auth/login", search: { error: "missing_ticket" } })
      return
    }

    const performHandshake = async () => {
      // 3. Panggil Server Function (berjalan di server-side TanStack)
      const result = await sso.verifyTicket(ticket)
      if (result.data.token) {
        // 4. Simpan token ke Cookie agar bisa dibaca saat SSR di page lain
        document.cookie = `paperless_token=${result.data.token}; path=/; max-age=86400; Secure; SameSite=Strict`

        // 5. Lempar ke Dashboard utama Paperless
        navigate({ to: "/" })
      }
    }

    performHandshake()
  }, [ticket, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="max-w-sm rounded-xl bg-white p-8 text-center shadow-md">
        {errorMessage ? (
          <>
            <div className="mb-2 text-xl font-semibold text-red-500">
              Autentikasi Gagal
            </div>
            <p className="text-sm text-slate-500">{errorMessage}</p>
            <p className="mt-4 text-xs text-slate-400">
              Mengalihkan Anda kembali ke halaman login...
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <h2 className="text-xl font-semibold text-slate-800">
              Menyelaraskan Sesi...
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Mohon tunggu, kami sedang menghubungkan Anda ke sistem Paperless
              Alfa Scorpii.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

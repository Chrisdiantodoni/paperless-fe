import { useAdminUser } from "@/hooks/queries/use-admin-users"
import { createFileRoute, Link } from "@tanstack/react-router"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { ArrowLeft, Pencil } from "lucide-react"

export const Route = createFileRoute("/_dashboard/system/users/$id/")({ component: RouteComponent })

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isLoading } = useAdminUser(id)
  if (isLoading || !data) return <PageWrapper>Memuat user...</PageWrapper>
  return <PageWrapper className="max-w-4xl space-y-4 p-2">
    <div className="flex items-center justify-between"><Button asChild variant="outline" size="icon"><Link to="/system/users" search={{ page: 1, search: "" }}><ArrowLeft /></Link></Button><Button asChild><Link to="/system/users/$id/edit" params={{ id }} search={{ page: 1, search: "" }}><Pencil /> Edit permissions</Link></Button></div>
    <Card><CardHeader><CardTitle>{data.staff.fullname}</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div>Username: {data.user_account.username}</div><div>Status: {data.user_account.is_active ? "Aktif" : "Tidak aktif"}</div><div>Posisi: {data.staff.position ?? "-"}</div><div>Cabang: {data.staff.branch ?? "-"}</div><div className="sm:col-span-2">Permissions: {data.permissions.length ? data.permissions.join(", ") : "Tidak ada"}</div></CardContent></Card>
  </PageWrapper>
}

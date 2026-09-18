import {
  useAdminPermissions,
  useAdminUser,
  useUpdateAdminUser,
} from "@/hooks/queries/use-admin-users"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/_dashboard/system/users/$id/edit")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: user } = useAdminUser(id)
  const { data: permissions } = useAdminPermissions(1)
  const update = useUpdateAdminUser()
  const [selected, setSelected] = useState<string[]>([])
  useEffect(() => setSelected(user?.permissions ?? []), [user])
  if (!user) return <PageWrapper>Memuat user...</PageWrapper>
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    )
  const save = async () => {
    try {
      await update.mutateAsync({
        id,
        permissions: selected.length ? selected : null,
      })
      toast.success("Permissions user berhasil diperbarui")
      navigate({
        to: "/system/users/$id",
        params: { id },
        search: { page: 1, search: "" },
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui permissions"
      )
    }
  }
  return (
    <PageWrapper className="max-w-3xl space-y-4 p-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            navigate({
              to: "/system/users/$id",
              params: { id },
              search: { page: 1, search: "" },
            })
          }
        >
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Permissions</h1>
          <p className="text-sm text-muted-foreground">{user.staff.fullname}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permissions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {permissions?.map((permission) => (
            <label key={permission.id} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(permission.name)}
                onCheckedChange={() => toggle(permission.name)}
              />
              {permission.name}
            </label>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={save} disabled={update.isPending}>
          {update.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </PageWrapper>
  )
}

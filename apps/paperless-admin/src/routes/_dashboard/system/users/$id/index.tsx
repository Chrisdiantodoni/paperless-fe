import {
  useAdminPermissions,
  useAdminUser,
} from "@/hooks/queries/use-admin-users"
import { createFileRoute, Link } from "@tanstack/react-router"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Skeleton } from "@workspace/ui/components/ui/skeleton"
import {
  ArrowLeft,
  Building2,
  Briefcase,
  CheckCircle2,
  KeyRound,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react"
import { useMemo } from "react"
import {
  formatPermissionPart,
  groupPermissions,
  permissionLabel,
} from "@/lib/permissions"

export const Route = createFileRoute("/_dashboard/system/users/$id/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isLoading, isError, error } = useAdminUser(id)
  const {
    data: permissionPage,
    isLoading: isLoadingPermissions,
    isError: isPermissionsError,
  } = useAdminPermissions(1)

  const userPermissions = useMemo(
    () => data?.permissions ?? [],
    [data?.permissions]
  )
  const groupedPermissions = useMemo(
    () => groupPermissions(userPermissions),
    [userPermissions]
  )

  const totalAvailable = permissionPage?.length ?? 0
  const coveragePercent =
    totalAvailable > 0
      ? Math.round((userPermissions.length / totalAvailable) * 100)
      : 0

  if (isLoading || isLoadingPermissions) {
    return (
      <PageWrapper className="max-w-4xl space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </PageWrapper>
    )
  }

  if (isError || isPermissionsError || !data) {
    return (
      <PageWrapper className="max-w-4xl p-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <ShieldAlert className="mb-2 h-10 w-10 text-destructive" />
          <h2 className="text-base font-semibold text-destructive">
            Gagal Memuat Detail User
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat memuat data user dan permissions"}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/system/users" search={{ page: 1, search: "" }}>
              Kembali ke Daftar User
            </Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="max-w-4xl space-y-6 p-4 md:p-6">
      {/* Action Bar / Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="icon" aria-label="Kembali">
          <Link to="/system/users" search={{ page: 1, search: "" }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <Button asChild>
          <Link
            to="/system/users/$id/edit"
            params={{ id }}
            search={{ page: 1, search: "" }}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Hak Akses
          </Link>
        </Button>
      </div>

      {/* User Information Card */}
      <Card className="overflow-hidden border-border/70 shadow-xs">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">
                {data.staff?.fullname ?? "Detail Pengguna"}
              </CardTitle>
              <CardDescription className="text-xs">
                Informasi identitas akun dan penempatan tugas
              </CardDescription>
            </div>
            <Badge
              variant={data.user_account.is_active ? "default" : "secondary"}
              className="w-fit gap-1 text-xs font-normal"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  data.user_account.is_active
                    ? "bg-emerald-400"
                    : "bg-muted-foreground"
                }`}
              />
              {data.user_account.is_active ? "Aktif" : "Non-Aktif"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 p-4 text-sm sm:grid-cols-2 sm:p-6 md:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg border bg-card/40 p-3">
            <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Username</p>
              <p className="font-semibold text-foreground">
                {data.user_account.username}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-card/40 p-3">
            <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Posisi</p>
              <p className="font-medium text-foreground">
                {data.staff?.position || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-card/40 p-3">
            <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Cabang</p>
              <p className="font-medium text-foreground">
                {data.staff?.branch || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Breakdown Card */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-3 border-b bg-muted/20 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">
                Hak Akses User
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Modul dan fungsi yang dapat diakses oleh user ini
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-2.5 py-1 text-xs">
              <KeyRound className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <strong className="text-foreground">
                {userPermissions.length}
              </strong>
              <span className="mx-1 text-muted-foreground">/</span>
              {totalAvailable} Hak Akses ({coveragePercent}%)
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {groupedPermissions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {groupedPermissions.map(([group, names]) => (
                <div
                  key={group}
                  className="rounded-xl border bg-card/60 p-4 transition-all hover:shadow-xs"
                >
                  <div className="mb-3 flex items-center justify-between border-b pb-2">
                    <h3 className="text-sm font-semibold tracking-wide">
                      {formatPermissionPart(group)}
                    </h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {names.length} aktif
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {names.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {permissionLabel(name)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Belum ada hak akses
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                User ini saat ini tidak memiliki permission aktif.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link
                  to="/system/users/$id/edit"
                  params={{ id }}
                  search={{ page: 1, search: "" }}
                >
                  Tambahkan Hak Akses
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Badge } from "@workspace/ui/components/ui/badge"
import { PageWrapper } from "@workspace/ui/components/page-wrapper"
import { Skeleton } from "@workspace/ui/components/ui/skeleton"
import { ArrowLeft, Check, Loader2, ShieldCheck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  formatPermissionPart,
  groupPermissions,
  permissionLabel,
} from "@/lib/permissions"

export const Route = createFileRoute("/_dashboard/system/users/$id/edit")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const { data: user, isLoading: isLoadingUser } = useAdminUser(id)
  const { data: permissions, isLoading: isLoadingPermissions } =
    useAdminPermissions(1)
  const update = useUpdateAdminUser()

  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (user?.permissions) {
      setSelected(user.permissions)
    }
  }, [user?.permissions])

  const availablePermissions = permissions ?? []
  const allPermissionNames = useMemo(
    () => availablePermissions.map((p) => p.name),
    [availablePermissions]
  )

  const groupedPermissions = useMemo(
    () => groupPermissions(allPermissionNames),
    [allPermissionNames]
  )

  const toggle = (name: string) => {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    )
  }

  const setGroup = (names: string[], checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current)
      names.forEach((name) => (checked ? next.add(name) : next.delete(name)))
      return Array.from(next)
    })
  }

  const isAllChecked =
    allPermissionNames.length > 0 &&
    allPermissionNames.every((name) => selected.includes(name))

  const isAllIndeterminate =
    !isAllChecked && allPermissionNames.some((name) => selected.includes(name))

  const handleNavigateBack = () => {
    navigate({
      to: "/system/users/$id",
      params: { id },
      search: { page: 1, search: "" },
    })
  }

  const save = async () => {
    try {
      await update.mutateAsync({
        id,
        permissions: selected,
      })
      toast.success("Hak akses berhasil diperbarui")
      handleNavigateBack()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memperbarui hak akses"
      )
    }
  }

  if (isLoadingUser || isLoadingPermissions) {
    return (
      <PageWrapper className="max-w-4xl space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </PageWrapper>
    )
  }

  if (!user) {
    return (
      <PageWrapper className="p-6 text-center">
        <p className="text-muted-foreground">User tidak ditemukan.</p>
        <Button variant="outline" className="mt-4" onClick={handleNavigateBack}>
          Kembali
        </Button>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="max-w-4xl space-y-6 p-4 pb-24 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            type="button"
            className="shrink-0"
            onClick={handleNavigateBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Edit Hak Akses
            </h1>
            <p className="text-sm text-muted-foreground">
              Mengatur izin untuk staf{" "}
              <span className="font-semibold text-foreground">
                {user.staff?.fullname ?? "User"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>
            Total aktif:{" "}
            <strong className="text-foreground">{selected.length}</strong> /{" "}
            {allPermissionNames.length}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-3 border-b bg-muted/20 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Daftar Modul & Izin
            </CardTitle>
            <CardDescription className="text-xs">
              Centang modul yang diizinkan untuk diakses user ini
            </CardDescription>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium shadow-xs transition-colors hover:bg-muted">
            <Checkbox
              checked={isAllIndeterminate ? "indeterminate" : isAllChecked}
              onCheckedChange={(checked) =>
                setGroup(allPermissionNames, checked === true)
              }
            />
            <span>Pilih Semua Hak Akses</span>
          </label>
        </CardHeader>

        <CardContent className="space-y-6 p-4 sm:p-6">
          {groupedPermissions.map(([group, names]) => {
            const groupSelectedCount = names.filter((name) =>
              selected.includes(name)
            ).length
            const isGroupAllSelected =
              names.length > 0 && groupSelectedCount === names.length
            const isGroupPartial = groupSelectedCount > 0 && !isGroupAllSelected

            return (
              <div
                key={group}
                className="overflow-hidden rounded-xl border bg-card/60 transition-all hover:shadow-xs"
              >
                {/* Group Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold tracking-wide">
                      {formatPermissionPart(group)}
                    </h2>
                    <Badge
                      variant={groupSelectedCount > 0 ? "default" : "secondary"}
                      className="text-[11px] font-normal"
                    >
                      {groupSelectedCount} / {names.length}
                    </Badge>
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                    <Checkbox
                      checked={
                        isGroupPartial ? "indeterminate" : isGroupAllSelected
                      }
                      onCheckedChange={(checked) =>
                        setGroup(names, checked === true)
                      }
                    />
                    <span>Pilih grup ini</span>
                  </label>
                </div>

                {/* Permissions Grid */}
                <div className="grid gap-2.5 p-3 sm:grid-cols-2 md:grid-cols-3">
                  {names.map((name) => {
                    const isChecked = selected.includes(name)

                    return (
                      <label
                        key={name}
                        className={`group relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-xs font-medium transition-all ${
                          isChecked
                            ? "border-primary/50 bg-primary/5 text-foreground shadow-2xs"
                            : "border-border/60 bg-background/50 text-muted-foreground hover:border-border hover:bg-muted/30"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(name)}
                          className="shrink-0"
                        />
                        <span className="line-clamp-2 flex-1 leading-snug">
                          {permissionLabel(name)}
                        </span>
                        {isChecked && (
                          <Check className="h-3.5 w-3.5 text-primary opacity-60 group-hover:opacity-100" />
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Floating Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {selected.length}
            </span>{" "}
            izin terpilih
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleNavigateBack}
              disabled={update.isPending}
            >
              Batal
            </Button>
            <Button onClick={save} disabled={update.isPending}>
              {update.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

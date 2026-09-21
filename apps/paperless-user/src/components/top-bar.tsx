"use client"

import { AnimatedThemeToggler } from "@workspace/ui/components/ui/animated-theme-toggler"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import { Button } from "@workspace/ui/components/ui/button"
import {
  BellIcon,
  SignOutIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  BuildingsIcon,
  IdentificationCardIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar"
import type { UserData } from "@workspace/types/user.type"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import type { NavPrimaryprops } from "@workspace/types/utilities"
import * as PhosphorIcons from "@phosphor-icons/react"
import { Link, useLocation } from "@tanstack/react-router"
import { logout } from "@/server/auth"
import { setLoggingOut } from "@/lib/logout-flag"
import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/queries/use-notifications"
import { useUser } from "@/hooks/queries/use-user"
import { Loader2 } from "lucide-react"
import { ListIcon } from "@phosphor-icons/react"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"

interface TopBarProps {
  user?: UserData
  sidebar: NavPrimaryprops["items"]
}

export function TopBar({ user, sidebar }: TopBarProps) {
  const { pathname } = useLocation()
  const { data } = useUser()
  const notificationsQuery = useNotifications()
  const markRead = useMarkNotificationAsRead()
  const markAllRead = useMarkAllNotificationsAsRead()
  const deleteNotification = useDeleteNotification()
  const deleteAllNotifications = useDeleteAllNotifications()
  const confirm = useConfirm()
  const notifications =
    notificationsQuery.data?.pages.flatMap((page) => page.data) ?? []
  const unreadCount = Number(data.unread_count ?? 0)

  const groupedNotifications = notifications.reduce<
    Record<string, typeof notifications>
  >((groups, notification) => {
    const date = new Date(notification.created_at)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const key =
      date.toDateString() === today.toDateString()
        ? "Hari Ini"
        : date.toDateString() === yesterday.toDateString()
          ? "Kemarin"
          : date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
    ;(groups[key] ??= []).push(notification)
    return groups
  }, {})

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    window.location.href = import.meta.env.VITE_PORTAL_URL || "/"
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2">
          {/*<SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mt-1 mr-2 data-[orientation=vertical]:h-5"
          />*/}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              P
            </span>
            <span className="hidden text-sm font-semibold sm:inline">
              Paperless
            </span>
          </Link>
          <nav
            className="hidden min-w-0 items-center gap-1 lg:flex"
            aria-label="Navigasi utama"
          >
            {sidebar.map((item) => {
              if (
                item.header ||
                !item.title ||
                (!item.url && !item.children?.length)
              )
                return null
              const Icon = item.icon
                ? (PhosphorIcons[
                    item.icon as keyof typeof PhosphorIcons
                  ] as React.ElementType)
                : null

              if (item.children?.length) {
                const childIsActive = item.children.some((child) =>
                  pathname.startsWith(child.url)
                )

                return (
                  <DropdownMenu key={item.title}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`relative h-9 gap-1 px-3 ${childIsActive ? "bg-accent font-semibold text-accent-foreground after:absolute after:right-2 after:bottom-0 after:left-2 after:h-0.5 after:rounded-full after:bg-primary" : ""}`}
                      >
                        {Icon && <Icon size={16} />}
                        {item.title}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.title} asChild>
                          <Link
                            to={child.url}
                            activeOptions={child.activeOptions}
                          >
                            {child.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              const isActive = item.url
                ? pathname === item.url || pathname.startsWith(`${item.url}/`)
                : false

              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  size="sm"
                  className={`relative h-9 px-3 ${isActive ? "bg-accent font-semibold text-accent-foreground after:absolute after:right-2 after:bottom-0 after:left-2 after:h-0.5 after:rounded-full after:bg-primary" : ""}`}
                  asChild
                >
                  <Link
                    to={item.url ?? "/dashboard"}
                    activeOptions={item.activeOptions}
                  >
                    {Icon && <Icon size={16} />}
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </nav>
          <div className="flex min-w-0 items-center gap-1 lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Buka navigasi utama"
                >
                  <ListIcon size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Navigasi utama</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sidebar.flatMap((item) =>
                  item.children?.length
                    ? item.children.map((child) => (
                        <DropdownMenuItem key={child.title} asChild>
                          <Link
                            to={child.url}
                            activeOptions={child.activeOptions}
                          >
                            {child.title}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    : item.title && item.url
                      ? [
                          <DropdownMenuItem key={item.title} asChild>
                            <Link
                              to={item.url}
                              activeOptions={item.activeOptions}
                            >
                              {item.title}
                            </Link>
                          </DropdownMenuItem>,
                        ]
                      : []
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DynamicBreadcrumb sidebar={sidebar} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full"
              >
                <BellIcon
                  size={18}
                  weight={unreadCount > 0 ? "fill" : "regular"}
                />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[9px] leading-none font-bold text-destructive-foreground shadow-sm">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[calc(100vw-2rem)] max-w-96 p-0"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <DropdownMenuLabel className="p-0 font-semibold">
                  Notifikasi
                </DropdownMenuLabel>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      disabled={markAllRead.isPending}
                      onClick={() => markAllRead.mutate()}
                    >
                      {markAllRead.isPending && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      {markAllRead.isPending ? "Menandai..." : "Tandai dibaca"}
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                      disabled={deleteAllNotifications.isPending}
                      onClick={async () => {
                        if (
                          await confirm({
                            title: "Hapus Semua Notifikasi",
                            description:
                              "Semua notifikasi akan dihapus secara permanen.",
                          })
                        )
                          deleteAllNotifications.mutate()
                      }}
                    >
                      Hapus semua
                    </Button>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator className="m-0" />
              <div className="max-h-96 overflow-y-auto">
                {notificationsQuery.isPending && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Memuat notifikasi...
                  </div>
                )}
                {notificationsQuery.isError && (
                  <div className="space-y-3 px-4 py-8 text-center text-sm text-muted-foreground">
                    <p>Notifikasi gagal dimuat.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => notificationsQuery.refetch()}
                    >
                      Coba lagi
                    </Button>
                  </div>
                )}
                {!notificationsQuery.isPending &&
                  !notificationsQuery.isError &&
                  notifications.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Belum ada notifikasi
                    </div>
                  )}
                {Object.entries(groupedNotifications).map(
                  ([group, groupNotifications]) => (
                    <div key={group}>
                      <div className="sticky top-0 z-10 border-b bg-background/95 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur">
                        {group}
                      </div>
                      {groupNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`group relative flex gap-3 border-b px-4 py-3 last:border-0 ${notification.isRead ? "" : "bg-muted/40"}`}
                        >
                          {!notification.isRead && (
                            <span
                              className="absolute inset-y-0 left-0 w-0.5 bg-primary"
                              aria-label="Belum dibaca"
                            />
                          )}
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left"
                            onClick={() => {
                              if (!notification.isRead)
                                markRead.mutate(notification.id)
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {notification.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                  {notification.message}
                                </p>
                                <p className="mt-2 text-[11px] text-muted-foreground">
                                  {new Date(
                                    notification.created_at
                                  ).toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          </button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                            aria-label="Hapus notifikasi"
                            disabled={
                              deleteNotification.isPending &&
                              deleteNotification.variables === notification.id
                            }
                            onClick={async (e) => {
                              e.stopPropagation()
                              if (
                                await confirm({
                                  title: "Hapus Notifikasi",
                                  description:
                                    "Notifikasi ini akan dihapus secara permanen.",
                                })
                              )
                                deleteNotification.mutate(notification.id)
                            }}
                          >
                            {deleteNotification.isPending &&
                            deleteNotification.variables === notification.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <TrashIcon size={15} />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )
                )}
                {notificationsQuery.hasNextPage && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      className="w-full text-xs"
                      disabled={notificationsQuery.isFetchingNextPage}
                      onClick={() => notificationsQuery.fetchNextPage()}
                    >
                      {notificationsQuery.isFetchingNextPage
                        ? "Memuat..."
                        : "Muat lebih banyak"}
                    </Button>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <AnimatedThemeToggler
            aria-label="Ganti tema"
            className="h-10 w-10 rounded-full border-none text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            variant="circle"
            duration={500}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-9 items-center gap-2 px-2"
              >
                <Avatar className="h-7 w-7 rounded-md">
                  <AvatarImage
                    src={
                      user?.hris_user?.staff?.details?.photo_path ??
                      "https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=Doni"
                    }
                    alt={user?.hris_user.username}
                  />
                  <AvatarFallback className="rounded-md text-xs">
                    {user?.hris_user.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                  {user?.hris_user.username}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-3 py-3">
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage
                      src={
                        user?.hris_user?.staff?.details?.photo_path ??
                        "https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=Doni"
                      }
                      alt={user?.hris_user.username}
                    />
                    <AvatarFallback className="rounded-md">
                      {user?.hris_user.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold">
                      {user?.hris_user?.staff?.details?.name ??
                        user?.hris_user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.roles.map((role) => role.name).join(", ")}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 px-3 py-2 text-xs">
                {user?.hris_user?.staff?.details?.nik && (
                  <div className="flex items-start gap-2">
                    <IdentificationCardIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground">NIK</p>
                      <p className="font-medium">
                        {user.hris_user.staff.details.nik}
                      </p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.details?.email && (
                  <div className="flex items-start gap-2">
                    <EnvelopeIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium break-all">
                        {user.hris_user.staff.details.email}
                      </p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.details?.phone_number && (
                  <div className="flex items-start gap-2">
                    <PhoneIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {user.hris_user.staff.details.phone_number}
                      </p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.occupation?.name && (
                  <div className="flex items-start gap-2">
                    <BriefcaseIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Jabatan</p>
                      <p className="font-medium">
                        {user.hris_user.staff.occupation.name}
                      </p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.work_unit?.name && (
                  <div className="flex items-start gap-2">
                    <BuildingsIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Unit Kerja</p>
                      <p className="font-medium">
                        {user.hris_user.staff.work_unit.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <SignOutIcon size={16} className="mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

"use client"

import { SidebarTrigger } from "@workspace/ui/components/ui/sidebar"
import { Separator } from "@workspace/ui/components/ui/separator"
import { AnimatedThemeToggler } from "@workspace/ui/components/ui/animated-theme-toggler"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import { Button } from "@workspace/ui/components/ui/button"
import {
  BellIcon,
  UserIcon,
  GearIcon,
  SignOutIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  BuildingsIcon,
  IdentificationCardIcon,
} from "@phosphor-icons/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar"
import type { UserData } from "@workspace/types/user.type"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import type { NavPrimaryprops } from "@workspace/types/utilities"
import { logout } from "@/server/auth"
import { setLoggingOut } from "@/lib/logout-flag"

interface TopBarProps {
  user?: UserData
  sidebar: NavPrimaryprops["items"]
}

export function TopBar({ user, sidebar }: TopBarProps) {
  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    window.location.href = import.meta.env.VITE_PORTAL_URL || "/"
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mt-1 mr-2 data-[orientation=vertical]:h-5"
          />
          <DynamicBreadcrumb sidebar={sidebar} />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <BellIcon size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <AnimatedThemeToggler className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none" />

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
                      {user?.hris_user?.staff?.details?.name ?? user?.hris_user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.roles.map((role) => role.name).join(", ")}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-3 py-2 space-y-2 text-xs">
                {user?.hris_user?.staff?.details?.nik && (
                  <div className="flex items-start gap-2">
                    <IdentificationCardIcon size={14} className="mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">NIK</p>
                      <p className="font-medium">{user.hris_user.staff.details.nik}</p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.details?.email && (
                  <div className="flex items-start gap-2">
                    <EnvelopeIcon size={14} className="mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium break-all">{user.hris_user.staff.details.email}</p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.details?.phone_number && (
                  <div className="flex items-start gap-2">
                    <PhoneIcon size={14} className="mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.hris_user.staff.details.phone_number}</p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.occupation?.name && (
                  <div className="flex items-start gap-2">
                    <BriefcaseIcon size={14} className="mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Jabatan</p>
                      <p className="font-medium">{user.hris_user.staff.occupation.name}</p>
                    </div>
                  </div>
                )}
                {user?.hris_user?.staff?.work_unit?.name && (
                  <div className="flex items-start gap-2">
                    <BuildingsIcon size={14} className="mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-muted-foreground">Unit Kerja</p>
                      <p className="font-medium">{user.hris_user.staff.work_unit.name}</p>
                    </div>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon size={16} className="mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GearIcon size={16} className="mr-2" />
                  Pengaturan
                </DropdownMenuItem>
              </DropdownMenuGroup>
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

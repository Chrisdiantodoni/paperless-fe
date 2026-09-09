"use client"

import { SidebarTrigger } from "@workspace/ui/components/ui/sidebar"
import { Separator } from "@workspace/ui/components/ui/separator"
import { AnimatedThemeToggler } from "@workspace/ui/components/ui/animated-theme-toggler"
import { Input } from "@workspace/ui/components/ui/input"
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
  SparkleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  SignOutIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/ui/avatar"
import type { UserData } from "@workspace/types/user.type"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import type { NavPrimaryprops } from "@workspace/types/utilities"
import { useState } from "react"

interface TopBarProps {
  user?: UserData
  sidebar: NavPrimaryprops["items"]
}

export function TopBar({ user, sidebar }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-md">
                    <AvatarImage
                      src={
                        user?.hris_user?.staff?.details?.photo_path ??
                        "https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=Doni"
                      }
                      alt={user?.hris_user.username}
                    />
                    <AvatarFallback className="rounded-md">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.hris_user.username}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.roles.map((role) => role.name).join(", ")}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <SparkleIcon size={16} className="mr-2" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <CheckCircleIcon size={16} className="mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon size={16} className="mr-2" />
                  Billing
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutIcon size={16} className="mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

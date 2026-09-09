"use client"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { Mail } from "lucide-react"
import type { UserData } from "@workspace/types/user.type"
import type { NavPrimaryprops } from "@workspace/types/utilities"

export function AppSidebar({
  user,
  sidebar,
}: {
  user?: UserData
  sidebar: NavPrimaryprops["items"]
}) {
  const sidebarItems = sidebar.map((item) => ({
    ...item,
    activeOptions: { exact: false },
  }))

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"} asChild>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Mail className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium">Paperless</span>
                  <span className="text-xs">Alfa Scorpii Apps</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <TeamSwitcher teams={data.teams} />*/}
      </SidebarHeader>
      <SidebarContent>
        <NavMain sidebar={sidebarItems} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@workspace/ui/components/ui/sidebar"
import * as PhosphorIcons from "@phosphor-icons/react"
import type { NavPrimaryprops } from "@workspace/types/utilities"
import { Link, useLocation } from "@tanstack/react-router"
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr"

export function NavMain({ sidebar }: { sidebar: NavPrimaryprops["items"] }) {
  const location = useLocation()
  const { state, isMobile, setOpen } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1">
        {sidebar.map((item, index) => {
          const Icon = item.icon
            ? (PhosphorIcons[
                item.icon as keyof typeof PhosphorIcons
              ] as React.ElementType)
            : null

          // 1. Render Group Header
          if (item.header) {
            return (
              <SidebarGroupLabel
                key={`header-${item.header}-${index}`}
                className="my-1"
              >
                {item.header}
              </SidebarGroupLabel>
            )
          }

          // Cek apakah ada sub-item yang sedang aktif agar otomatis terbuka saat load
          const isSubItemActive = item.children?.some((sub) =>
            location.pathname.startsWith(sub.url)
          )

          // 2. Render Menu Beranak (Collapsible)
          if (item.children && item.children.length > 0) {
            return (
              <SidebarMenuItem key={item.url ?? item.title ?? `menu-${index}`}>
                <Collapsible
                  defaultOpen={isSubItemActive}
                  className="group/collapsible w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      size="sm"
                      onClick={() => {
                        if (!isMobile && state === "collapsed") setOpen(true)
                      }}
                    >
                      {Icon && <Icon size={18} />}
                      <span>{item.title}</span>
                      <CaretRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.url ?? subItem.title}>
                          <SidebarMenuSubButton asChild size="sm">
                            <Link
                              to={subItem.url}
                              activeProps={{
                                "data-active": true,
                              }}
                              activeOptions={subItem.activeOptions}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )
          }

          // 3. Render Single Menu Biasa
          return (
            <SidebarMenuItem key={item.url ?? item.title ?? index}>
              <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                <Link
                  to={item.url}
                  activeProps={{
                    "data-active": true,
                  }}
                  activeOptions={item.activeOptions}
                >
                  {Icon && <Icon size={18} />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/ui/sidebar"
import * as PhosphorIcons from "@phosphor-icons/react"
import type { NavPrimaryprops } from "@workspace/types/utilities"
import { Link } from "@tanstack/react-router"
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr"
import { Fragment } from "react"

export function NavMain({ sidebar }: { sidebar: NavPrimaryprops["items"] }) {
  return (
    <SidebarGroup>
      {sidebar.map((item) => {
        const Icon = item.icon
          ? (PhosphorIcons[
              item.icon as keyof typeof PhosphorIcons
            ] as React.ElementType)
          : null
        return (
          <Fragment key={item.header ?? item.title}>
            {item.header ? (
              <SidebarGroupLabel className="my-1">
                {item.header}
              </SidebarGroupLabel>
            ) : item.children && item.children.length > 0 ? (
              <SidebarMenu>
                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible my-1"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} size={"sm"}>
                        {Icon && <Icon size={18} />}
                        <span>{item.title}</span>
                        <CaretRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                activeProps={{
                                  "data-active": true,
                                }}
                                to={subItem.url}
                                activeOptions={subItem.activeOptions}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            ) : (
              <SidebarGroupContent className="my-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild size={"sm"}>
                      <Link
                        activeProps={{
                          "data-active": true,
                        }}
                        to={item.url}
                        activeOptions={item.activeOptions}
                      >
                        {Icon && <Icon size={18} />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </Fragment>
        )
      })}
    </SidebarGroup>
  )
}

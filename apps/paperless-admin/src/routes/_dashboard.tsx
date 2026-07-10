import { AppSidebar } from "@/components/app-sidebar"
import { authMiddleware } from "@/middlewares/auth"
import { userQueryOptions } from "@/hooks/queries/use-user"
import { sidebarQueryOptions } from "@/hooks/queries/use-sidebar"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Separator } from "@workspace/ui/components/ui/separator"

import {
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import { ModeToggle } from "@/components/mode-toggle"

export const Route = createFileRoute("/_dashboard")({
  server: {
    middleware: [authMiddleware],
  },
  beforeLoad: async ({ context, location }) => {
    if (location.pathname === "/" || location.pathname === "") {
      throw redirect({
        to: "/dashboard",
      })
    }
    const { queryClient } = context
    const [user, sidebar] = await Promise.all([
      queryClient.ensureQueryData(userQueryOptions()),
      queryClient.ensureQueryData(sidebarQueryOptions()),
    ])
    return { user, sidebar }
  },
  loader: ({ context }) => ({ user: context.user, sidebar: context.sidebar }),
  component: RouteComponent,
})
// 213032

function RouteComponent() {
  const { user, sidebar } = Route.useLoaderData()
  return (
    <>
      <AppSidebar user={user} sidebar={sidebar} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full justify-between px-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mt-1 mr-2 data-[orientation=vertical]:h-5"
              />
              <DynamicBreadcrumb sidebar={sidebar} />
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  )
}

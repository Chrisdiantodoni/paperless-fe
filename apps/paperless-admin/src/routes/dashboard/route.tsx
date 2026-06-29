import { AppSidebar } from "@/components/app-sidebar"
import { authMiddleware } from "@/middlewares/auth"
import { getCurrentUser } from "@/server/auth"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Separator } from "@workspace/ui/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/ui/sidebar"

export const Route = createFileRoute("/dashboard")({
  server: {
    middleware: [authMiddleware],
  },
  beforeLoad: async () => {
    const user = await getCurrentUser()
    return { user }
  },
  loader: ({ context }) => ({ user: context.user }),
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  return (
    <>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  )
}

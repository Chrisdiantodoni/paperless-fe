import { authMiddleware } from "@/middlewares/auth"
import { userQueryOptions } from "@/hooks/queries/use-user"
import { sidebarQueryOptions } from "@/hooks/queries/use-sidebar"
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router"
import {
  SidebarInset,
  useSidebar,
} from "@workspace/ui/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { useEffect } from "react"

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

  const { pathname } = useLocation()
  const { setOpen, open } = useSidebar()

  console.log(pathname)

  useEffect(() => {
    if (pathname === "/mail/user-mails") {
      if (open) setOpen(false)
    } else {
      if (!open) setOpen(true)
    }
  }, [pathname, open, setOpen])
  return (
    <>
      <AppSidebar user={user} sidebar={sidebar} />
      <SidebarInset>
        <TopBar user={user} sidebar={sidebar} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  )
}

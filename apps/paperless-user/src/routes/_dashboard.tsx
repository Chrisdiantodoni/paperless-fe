import { authMiddleware } from "@/middlewares/auth"
import { userQueryOptions } from "@/hooks/queries/use-user"
import { sidebarQueryOptions } from "@/hooks/queries/use-sidebar"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { TopBar } from "@/components/top-bar"
import { SidebarProvider } from "@workspace/ui/components/ui/sidebar"

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
    const { queryClient, user } = context
    queryClient.setQueryData(userQueryOptions().queryKey, user)
    const sidebar = await queryClient.ensureQueryData(sidebarQueryOptions())
    return { user, sidebar }
  },
  loader: ({ context }) => ({ user: context.user, sidebar: context.sidebar }),
  component: RouteComponent,
})
function RouteComponent() {
  const { user, sidebar } = Route.useLoaderData()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background text-[16px] leading-relaxed">
        <TopBar user={user} sidebar={sidebar} />
        <main className="flex w-full flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

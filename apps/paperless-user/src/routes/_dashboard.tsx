import { authMiddleware } from "@/middlewares/auth"
import { userQueryOptions } from "@/hooks/queries/use-user"
import { sidebarQueryOptions } from "@/hooks/queries/use-sidebar"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { TopBar } from "@/components/top-bar"

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
function RouteComponent() {
  const { user, sidebar } = Route.useLoaderData()

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-[16px] leading-relaxed">
      <TopBar user={user} sidebar={sidebar} />
      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}

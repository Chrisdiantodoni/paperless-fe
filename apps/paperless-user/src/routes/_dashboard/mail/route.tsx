import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/mail")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

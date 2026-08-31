import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/ui/button"
import { Plus } from "lucide-react"

export const Route = createFileRoute("/_dashboard/subordinates/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-normal tracking-tight">List Bawahan</h1>
        {/* <Button asChild size={"sm"}>
        <Link to="/mail/dynamic-mail-templates/create">
          <Plus className="h-4 w-4" />
          Tambah Template
        </Link>
      </Button> */}
      </div>
    </div>
  )
}

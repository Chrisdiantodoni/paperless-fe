import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { formatRupiah } from "@workspace/utils"
import { GalleryVerticalEnd } from "lucide-react"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div>Test</div>
    </div>
  )
}

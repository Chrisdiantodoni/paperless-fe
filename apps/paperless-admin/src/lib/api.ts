import { setupApi } from "@workspace/api-client"
import { cn } from "@workspace/ui/lib/utils"

export const api = setupApi(
  import.meta.env.VITE_BASE_URL,
  import.meta.env.VITE_PORTAL_URL
)

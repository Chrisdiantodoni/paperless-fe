import { api } from "@/services/api"
import { createServerFn } from "@tanstack/react-start"
import type { IDashboardResponse } from "@workspace/types"

export const getDashboardSummary = createServerFn({ method: "GET" }).handler(
  async () => {
    const response = await api.get<IDashboardResponse>("/dashboard")
    return response.data.data
  }
)

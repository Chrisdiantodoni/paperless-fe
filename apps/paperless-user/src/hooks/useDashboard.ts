import { getDashboardSummary } from "@/server/dashboard"
import { dashboardKeys } from "@/keys/dashboardKeys"
import { useQuery } from "@tanstack/react-query"

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => getDashboardSummary(),
  })
}

import { getDashboardSummary } from "@/server/dashboard"
import { dashboardKeys } from "@/keys/dashboardKeys"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useDashboardSummary() {
  return useSuspenseQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => getDashboardSummary(),
  })
}

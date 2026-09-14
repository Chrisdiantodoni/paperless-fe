import { useQuery } from "@tanstack/react-query"
import type { IDashboardData } from "@workspace/types"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async (): Promise<IDashboardData> => {
      return {
        inbox: {
          urgent: 1,
          approved: 6,
          revision_and_rejected: 0,
        },
        outbox: {
          draft: 3,
        },
      }
    },
  })
}

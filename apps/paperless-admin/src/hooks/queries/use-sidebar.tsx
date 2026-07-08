import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { utilityKeys } from "@/keys/utilityKeys"
import { getSidebar } from "@/server/utilities"

export const sidebarQueryOptions = () =>
  queryOptions({
    queryKey: utilityKeys.sidebar(),
    queryFn: () => getSidebar(),
  })

export function useSidebar() {
  return useSuspenseQuery(sidebarQueryOptions())
}

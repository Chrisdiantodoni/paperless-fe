import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import type z from "zod"
import type { positionSearchSchema } from "@/schema/list.schema"
import { positionKeys } from "@/keys/positionKeys"
import { getPositions } from "@/server/master"

type PositionSearch = z.infer<typeof positionSearchSchema>

export const positionsQueryOptions = (search: PositionSearch) =>
  queryOptions({
    queryKey: positionKeys.list(search),
    queryFn: () => getPositions({ data: search }),
  })

export function usePositions(search: PositionSearch) {
  return useSuspenseQuery(positionsQueryOptions(search))
}

export function usePositionSearch(
  searchQuery: string,
  isDropdownOpen: boolean
) {
  return useQuery({
    queryKey: positionKeys.search(searchQuery),
    queryFn: () => getPositions({ data: { search: searchQuery } as any }),
    enabled: isDropdownOpen || searchQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

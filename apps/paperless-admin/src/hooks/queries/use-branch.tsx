import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import type z from "zod"
import type { branchSearchSchema } from "@/schema/list.schema"
import { branchKeys } from "@/keys/branchKeys"
import { getBranches } from "@/server/master"

type BranchSearch = z.infer<typeof branchSearchSchema>

export const branchesQueryOptions = (search: BranchSearch) =>
  queryOptions({
    queryKey: branchKeys.list(search),
    queryFn: () => getBranches({ data: search }),
  })

export function useBranches(search: BranchSearch) {
  return useSuspenseQuery(branchesQueryOptions(search))
}

export function useBranchSearch(
  searchQuery: string,
  isDropdownOpen: boolean
) {
  return useQuery({
    queryKey: branchKeys.search(searchQuery),
    queryFn: () => getBranches({ data: { search: searchQuery } as any }),
    enabled: isDropdownOpen || searchQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

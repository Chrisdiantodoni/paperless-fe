import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import type z from "zod"
import type { departmentSearchSchema } from "@/schema/list.schema"
import { departmentKeys } from "@/keys/departmentKeys"
import { getDepartments } from "@/server/master"

type DepartmentSearch = z.infer<typeof departmentSearchSchema>

export const departmentsQueryOptions = (search: DepartmentSearch) =>
  queryOptions({
    queryKey: departmentKeys.list(search),
    queryFn: () => getDepartments({ data: search }),
  })

export function useDepartments(search: DepartmentSearch) {
  return useSuspenseQuery(departmentsQueryOptions(search))
}

export function useDepartmentSearch(
  searchQuery: string,
  isDropdownOpen: boolean
) {
  return useQuery({
    queryKey: departmentKeys.search(searchQuery),
    queryFn: () => getDepartments({ data: { search: searchQuery } }),
    enabled: isDropdownOpen || searchQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

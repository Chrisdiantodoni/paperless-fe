import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import type z from "zod"
import type { departmentSearchSchema } from "@/schema/list.schema"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { Department } from "@workspace/types/master"
import { departmentKeys } from "@/keys/departmentKeys"
import { getDepartments } from "@/server/master"

type DepartmentSearch = z.infer<typeof departmentSearchSchema>

export const departmentsQueryOptions = (
  search: DepartmentSearch,
  initialData?: LaravelPaginationData<Department[]>
) =>
  queryOptions({
    queryKey: departmentKeys.list(search),
    queryFn: () => getDepartments({ data: search }),
    initialData,
  })

export function useDepartments(
  search: DepartmentSearch,
  initialData?: LaravelPaginationData<Department[]>
) {
  return useSuspenseQuery(departmentsQueryOptions(search, initialData))
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

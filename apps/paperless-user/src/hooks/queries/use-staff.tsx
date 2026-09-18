import { staffKeys } from "@/keys/staffKeys"
import type { StaffSearch } from "@/schema/list.schema"
import { getOvertimeDropdownStaffs, getStaff } from "@/server/master"
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"

export const staffQueryOptions = (search: StaffSearch) =>
  queryOptions({
    queryKey: staffKeys.list(search),
    queryFn: () => getStaff({ data: search }),
  })

export function useStaffs(search: StaffSearch) {
  return useSuspenseQuery(staffQueryOptions(search))
}

export function useOvertimeStaffSearch(
  searchQuery: string,
  isDropdownOpen: boolean
) {
  return useQuery({
    queryKey: ["overtime-staff-search", searchQuery],
    queryFn: () =>
      getOvertimeDropdownStaffs({
        data: {
          search: searchQuery,
          branch_id: "",
          department_id: "",
          position_id: "",
        },
      }),
    enabled: isDropdownOpen || searchQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

export function useStaffSearch(
  searchQuery: string,
  isDropdownOpen: boolean,
  deps?: {
    departmentId?: string
    branchId?: string
    positionId?: string
  }
) {
  return useQuery({
    queryKey: staffKeys.search(searchQuery, deps),
    queryFn: () =>
      getStaff({
        data: {
          search: searchQuery,
          department_id: deps?.departmentId,
          branch_id: deps?.branchId,
          position_id: deps?.positionId,
        } as any,
      }),
    enabled: isDropdownOpen || searchQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

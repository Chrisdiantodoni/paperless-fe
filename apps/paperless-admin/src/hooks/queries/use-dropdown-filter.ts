import {
  getBranchesWithDropdown,
  getCategoryMailWithDropdown,
  getDepartmentsMailWithDropdown,
  getPositionMailWithDropdown,
} from "@/server/master"
import { useQuery } from "@tanstack/react-query"

export type DropdownFilterType =
  | "branch"
  | "categoryMail"
  | "department"
  | "position"

const queries = {
  branch: getBranchesWithDropdown,
  categoryMail: getCategoryMailWithDropdown,
  department: getDepartmentsMailWithDropdown,
  position: getPositionMailWithDropdown,
}

export function useDropdownFilter(type: DropdownFilterType, search: string) {
  return useQuery({
    queryKey: ["mail-filter-dropdown", type, search],
    queryFn: () => queries[type]({ data: { search: search || undefined } }),
    staleTime: 5 * 60 * 1000,
  })
}

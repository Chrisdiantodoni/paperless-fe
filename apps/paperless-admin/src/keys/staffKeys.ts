import type { StaffSearch } from "@/schema/list.schema"

export const staffKeys = {
  all: ["staffs"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (search: StaffSearch) => [...staffKeys.lists(), search] as const,
  details: () => [...staffKeys.all, "detail"] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  search: (
    query: string,
    deps?: {
      departmentId?: string
      branchId?: string
      positionId?: string
    }
  ) => [...staffKeys.all, "search", query, deps] as const,
}

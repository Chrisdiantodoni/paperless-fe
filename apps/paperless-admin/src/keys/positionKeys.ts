import type { PositionSearch } from "@/schema/list.schema"

export const positionKeys = {
  all: ["positions"] as const,
  lists: () => [...positionKeys.all, "list"] as const,
  list: (search: PositionSearch) =>
    [...positionKeys.lists(), search] as const,
  details: () => [...positionKeys.all, "detail"] as const,
  detail: (id: string) => [...positionKeys.details(), id] as const,
  search: (query: string, departmentId?: string) =>
    [...positionKeys.all, "search", query, departmentId] as const,
}

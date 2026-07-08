import type { DepartmentSearch } from "@/schema/list.schema"

export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (search: DepartmentSearch) =>
    [...departmentKeys.lists(), search] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
  search: (query: string) => [...departmentKeys.all, "search", query] as const,
}

import type { BranchSearch } from "@/schema/list.schema"

export const branchKeys = {
  all: ["branches"] as const,
  lists: () => [...branchKeys.all, "list"] as const,
  list: (search: BranchSearch) => [...branchKeys.lists(), search] as const,
  details: () => [...branchKeys.all, "detail"] as const,
  detail: (id: string) => [...branchKeys.details(), id] as const,
  search: (query: string) => [...branchKeys.all, "search", query] as const,
}

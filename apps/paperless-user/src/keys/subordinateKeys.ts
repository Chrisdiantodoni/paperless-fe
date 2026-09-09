import type { SubordinateSearch } from "@/schema/list.schema"

export const subordinateKeys = {
  all: ["subordinates"] as const,
  lists: () => [...subordinateKeys.all, "list"] as const,
  list: (search?: SubordinateSearch) =>
    [...subordinateKeys.lists(), search] as const,
  details: () => [...subordinateKeys.all, "detail"] as const,
  detail: (id: string) => [...subordinateKeys.details(), id] as const,
}

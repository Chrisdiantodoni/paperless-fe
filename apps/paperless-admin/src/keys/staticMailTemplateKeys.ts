import type { StaticMailTemplateSearch } from "@/schema/list.schema"

export const staticMailTemplateKeys = {
  all: ["static-mail-templates"] as const,
  lists: () => [...staticMailTemplateKeys.all, "list"] as const,
  list: (search: StaticMailTemplateSearch) => {
    return [...staticMailTemplateKeys.lists(), search] as const
  },
  details: () => [...staticMailTemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...staticMailTemplateKeys.details(), id] as const,
  search: (query: string) =>
    [...staticMailTemplateKeys.all, "search", query] as const,
}

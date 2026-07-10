import type { DynamicMailTemplateSearch } from "@/schema/list.schema"

export const dynamicMailTemplateKeys = {
  all: ["dynamic-mail-templates"] as const,
  lists: () => [...dynamicMailTemplateKeys.all, "list"] as const,
  list: (search?: DynamicMailTemplateSearch) => {
    return [...dynamicMailTemplateKeys.lists(), search] as const
  },
  details: () => [...dynamicMailTemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...dynamicMailTemplateKeys.details(), id] as const,
  search: (query: string) =>
    [...dynamicMailTemplateKeys.all, "search", query] as const,
}

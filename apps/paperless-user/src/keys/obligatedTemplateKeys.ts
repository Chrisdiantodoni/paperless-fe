import type { ObligatedTemplateListSchema } from "@/schema/mail/obligated-template.schema"

export const obligatedTemplateKeys = {
  all: ["obligated-templates"] as const,
  lists: () => [...obligatedTemplateKeys.all, "list"] as const,
  list: (search?: ObligatedTemplateListSchema) => {
    return [...obligatedTemplateKeys.lists(), search] as const
  },
  details: () => [...obligatedTemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...obligatedTemplateKeys.details(), id] as const,
  search: (query: string, deps?: ObligatedTemplateListSchema) =>
    [...obligatedTemplateKeys.all, "search", query, deps] as const,
}

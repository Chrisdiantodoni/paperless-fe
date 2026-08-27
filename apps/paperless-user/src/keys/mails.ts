import type { ListRequestQueryMail } from "@/schema/mail/schema"

export const mailKeys = {
  all: ["all-mails"] as const,
  lists: () => [...mailKeys.all, "list"] as const,
  list: (search: ListRequestQueryMail) =>
    [...mailKeys.lists(), search] as const,
  details: () => [...mailKeys.all, "detail"] as const,
  detail: (id: string) => [...mailKeys.details(), id] as const,
  search: (query: string) => [...mailKeys.all, "search", query] as const,
}

import type {
  ListRequestQueryMail,
  listRequestQuerySchema,
} from "@/schema/mail/schema"
import { getMailDetail, getMailList } from "@/server/mail"
import {
  keepPreviousData,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { AllMailProps } from "@workspace/types/mail"
import type z from "zod"

export const mailKeys = {
  all: ["all-mails"] as const,
  lists: () => [...mailKeys.all, "list"],
  list: (search: ListRequestQueryMail) =>
    [...mailKeys.lists(), search] as const,
  details: () => [...mailKeys.all, "detail"] as const,
  detail: (id: string) => [...mailKeys.details(), id] as const,
  search: (query: string) => [...mailKeys.all, "search", query] as const,
}
export type ListMailQuerySearch = z.infer<typeof listRequestQuerySchema>

export const mailListQueryOptions = (
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) => {
  return queryOptions({
    queryKey: mailKeys.list(search),
    queryFn: async () => {
      const result = await getMailList({ data: search })
      return result.success ? result.data : null
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })
}

export const mailDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: mailKeys.detail(id),
    queryFn: async () => {
      const result = await getMailDetail({ data: id })
      return result.success ? result.data : null
    },
  })
}

export const useMailList = (
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) => {
  return useSuspenseQuery(mailListQueryOptions(search, initialData))
}

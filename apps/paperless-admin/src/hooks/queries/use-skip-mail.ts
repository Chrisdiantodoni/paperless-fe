import type { CreateSkipMail, ListRequestSkipMail } from "@/schema/mail/schema"
import {
  createSkipMail,
  getDetailSkippedMail,
  getListSkippedMails,
} from "@/server/mail"
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { MailSkipProps } from "@workspace/types/mail"

export const skipMailKeys = {
  all: ["skip-mails"] as const,
  lists: () => [...skipMailKeys.all, "list"],
  list: (search: ListRequestSkipMail) =>
    [...skipMailKeys.lists(), search] as const,
  details: () => [...skipMailKeys.all, "detail"] as const,
  detail: (id: string) => [...skipMailKeys.details(), id] as const,
  search: (query: string) => [...skipMailKeys.all, "search", query] as const,
}

export const skipMailListQueryOptions = (
  search: ListRequestSkipMail,
  initialData?: LaravelPaginationData<MailSkipProps[]>
) => {
  return queryOptions({
    queryKey: skipMailKeys.list(search),
    queryFn: async () => {
      const result = await getListSkippedMails({ data: search })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })
}

export const skipMailDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: skipMailKeys.detail(id),
    queryFn: async () => {
      const result = await getDetailSkippedMail({ data: id })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })
}

export const useSkipMailList = (
  search: ListRequestSkipMail,
  initialData?: LaravelPaginationData<MailSkipProps[]>
) => {
  return useQuery(skipMailListQueryOptions(search, initialData))
}

export const useSkipMailDetail = (id: string) => {
  return useQuery(skipMailDetailQueryOptions(id))
}

export const useCreateSkipMail = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateSkipMail) => {
      const result = await createSkipMail({ data })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (_) => {
      qc.invalidateQueries({ queryKey: skipMailKeys.lists() })
    },
  })
}

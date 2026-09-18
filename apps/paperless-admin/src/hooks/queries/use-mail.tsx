import type { ApprovalBody } from "@/components/mail/dialog/approve-dialog"
import type { CancelBody } from "@/components/mail/dialog/cancel-dialog"
import type {
  ListRequestQueryMail,
  listRequestQuerySchema,
} from "@/schema/mail/schema"
import {
  approvalMail,
  cancelMail,
  getMailDetail,
  getMailList,
} from "@/server/mail"
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
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

export function useMailDetail(id: string) {
  return useQuery(mailDetailQueryOptions(id))
}

export const useMailList = (
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) => {
  return useQuery(mailListQueryOptions(search, initialData))
}

export function useApproval() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: ApprovalBody }) => {
      const response = await approvalMail({ data: { id, body } })
      if (!response.success) {
        throw new Error(response.error)
      }
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mailKeys.lists() })
      queryClient.invalidateQueries({ queryKey: mailKeys.detail(variables.id) })
    },
  })
}

export function useCancel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: CancelBody }) => {
      const response = await cancelMail({ data: { id, body } })
      if (!response.success) {
        throw new Error(response.error)
      }
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mailKeys.lists() })
      queryClient.invalidateQueries({ queryKey: mailKeys.detail(variables.id) })
    },
  })
}

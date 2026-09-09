import { mailKeys } from "@/keys/mails"
import type { listRequestQuerySchema } from "@/schema/mail/schema"
import {
  getDraftMails,
  getMailDetails,
  getMails,
  getSentMails,
  sendMail,
  reviseMail,
  approveMail,
  rejectMail,
} from "@/server/mails"
import {
  keepPreviousData,
  queryOptions,
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { AllMailProps } from "@workspace/types/mail"
import type z from "zod"

export type ListMailQuerySearch = z.infer<typeof listRequestQuerySchema>

// 1. Single unified query options factory
export const mailListQueryOptions = (
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) => {
  const isSent = search.type === "sent"
  const isDraft = search.type === "draft"

  return queryOptions({
    queryKey: mailKeys.list(search),
    queryFn: async () => {
      const result = isSent
        ? await getSentMails({ data: search })
        : isDraft
          ? await getDraftMails({ data: search })
          : await getMails({ data: search })
      
      return result.success ? result.data : undefined
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })
}

// 3. Single hook untuk komponen (Suspense-safe)
export const allMailQueryOptions = (
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) => mailListQueryOptions({ ...search, type: "all" }, initialData)

export const allSentMailQueryOptions = (
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) => mailListQueryOptions({ ...search, type: "sent" }, initialData)

export const AllDraftMailQueryOptions = (
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) => mailListQueryOptions({ ...search, type: "draft" }, initialData)

export function useMailList(
  search: ListMailQuerySearch,
  initialData?: LaravelPaginationData<AllMailProps[]>
) {
  return useSuspenseQuery(mailListQueryOptions(search, initialData))
}

export const mailDetailQueryOptions = (id: string | null) =>
  queryOptions({
    queryKey: ["mail-detail", id],
    queryFn: async () => {
      if (!id) return null
      const result = await getMailDetails({ data: id })
      return result
    },
    enabled: !!id,
  })

export function useMailDetail(id: string | null) {
  return useQuery(mailDetailQueryOptions(id))
}

export function useSendMail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => sendMail({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ["mail-detail"] })
    },
  })
}

export function useReviseMail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      reviseMail({ data: { id, reason } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ["mail-detail"] })
    },
  })
}

export function useApproveMail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      approveMail({ data: { id, notes } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ["mail-detail"] })
    },
  })
}

export function useRejectMail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      rejectMail({ data: { id, reason } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ["mail-detail"] })
    },
  })
}

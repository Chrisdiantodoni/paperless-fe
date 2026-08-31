import { mailKeys } from "@/keys/mails"
import type { listRequestQuerySchema } from "@/schema/mail/schema"
import {
  getDraftMails,
  getMailDetails,
  getMails,
  getSentMails,
} from "@/server/mails"
import {
  keepPreviousData,
  queryOptions,
  useQuery,
  useSuspenseQuery,
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
    queryFn: () =>
      isSent
        ? getSentMails({ data: search })
        : isDraft
          ? getDraftMails({ data: search })
          : getMails({ data: search }),
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
      return await getMailDetails({ data: id })
    },
    enabled: !!id, // Hanya fetch jika id ada (tidak null)
  })

export function useMailDetail(id: string | null) {
  return useQuery(mailDetailQueryOptions(id))
}

import { dynamicMailTemplateKeys } from "@/keys/dynamicMailTemplateKeys"
import type { DynamicMailTemplateSearch } from "@/schema/list.schema"
import type { RevisionRequestForm } from "@/schema/master/schema"
import {
  deleteDynamicMailTemplate,
  getDynamicMailTemplate,
  submitDynamicMailTemplateForApproval,
  approveDynamicMailTemplate,
  rejectDynamicMailTemplate,
  requestDynamicMailTemplateRevision,
} from "@/server/master"
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { IDynamicMailTemplate } from "@workspace/types/master"
import { toast } from "sonner"

export const dynamicMailTemplateQueryOptions = (
  search: DynamicMailTemplateSearch,
  initialData?: LaravelPaginationData<IDynamicMailTemplate[]>
) =>
  queryOptions({
    queryKey: dynamicMailTemplateKeys.list(search),
    queryFn: () => getDynamicMailTemplate({ data: search }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })

export function useDynamicMailTemplate(
  search: DynamicMailTemplateSearch,
  initialData?: LaravelPaginationData<IDynamicMailTemplate[]>
) {
  return useSuspenseQuery(dynamicMailTemplateQueryOptions(search, initialData))
}

export function useDeleteDynamicMailTemplateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteDynamicMailTemplate({ data: id })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dynamicMailTemplateKeys.lists(),
        exact: false,
      })
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat menghapus data")
    },
  })
}

export function useSubmitForApprovalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await submitDynamicMailTemplateForApproval({ data: id })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dynamicMailTemplateKeys.lists(),
        exact: false,
      })
      toast.success("Template berhasil diajukan untuk approval")
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat mengajukan approval")
    },
  })
}

export function useApproveDynamicMailTemplateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await approveDynamicMailTemplate({ data: id })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dynamicMailTemplateKeys.lists(),
        exact: false,
      })
      toast.success("Template berhasil di-approve")
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat approve template")
    },
  })
}

export function useRejectDynamicMailTemplateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await rejectDynamicMailTemplate({ data: { id, reason } })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dynamicMailTemplateKeys.lists(),
        exact: false,
      })
      toast.success("Template berhasil ditolak")
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat menolak template")
    },
  })
}

export function useRequestRevisionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RevisionRequestForm }) => {
      const response = await requestDynamicMailTemplateRevision({ data: { id, data } })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dynamicMailTemplateKeys.lists(),
        exact: false,
      })
      toast.success("Request revisi berhasil dikirim")
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat request revisi")
    },
  })
}

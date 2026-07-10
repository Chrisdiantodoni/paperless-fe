import { dynamicMailTemplateKeys } from "@/keys/dynamicMailTemplateKeys"
import type { DynamicMailTemplateSearch } from "@/schema/list.schema"
import {
  deleteDynamicMailTemplate,
  getDynamicMailTemplate,
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

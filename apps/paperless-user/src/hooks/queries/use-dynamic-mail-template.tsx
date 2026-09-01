import { dynamicMailTemplateKeys } from "@/keys/dynamicMailTemplateKeys"
import type { DynamicMailTemplateSearch } from "@/schema/list.schema"
import {
  deleteDynamicMailTemplate,
  getDynamicMailTemplate,
  getObligatedDynamicTemplate,
} from "@/server/master"
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
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

export function useDynamicMailTemplateSearch(
  searchQuery: string,
  isDropdownOpen: boolean,
  deps?: DynamicMailTemplateSearch
) {
  return useQuery({
    queryKey: dynamicMailTemplateKeys.search(searchQuery, deps),
    queryFn: async () => {
      try {
        console.log('[useDynamicMailTemplateSearch] Calling with deps:', deps)
        const result = await getObligatedDynamicTemplate({ data: deps! })
        console.log('[useDynamicMailTemplateSearch] Success:', result)
        return result
      } catch (error) {
        console.error('[useDynamicMailTemplateSearch] Error:', error)
        throw error
      }
    },
    enabled: (isDropdownOpen || searchQuery.length > 0) && deps !== undefined,
    staleTime: 1000 * 60 * 5,
  })
}

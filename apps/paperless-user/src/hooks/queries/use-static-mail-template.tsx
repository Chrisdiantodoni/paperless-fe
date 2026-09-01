import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query"
import { staticMailTemplateKeys } from "@/keys/staticMailTemplateKeys"
import type z from "zod"
import type { staticMailTemplateSearchSchema } from "@/schema/list.schema"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { StaticMailTemplate } from "@workspace/types/master"
import {
  deleteStaticMailTemplate,
  getObligatedStaticTemplate,
  getStaticMailTemplates,
} from "@/server/master"
import { toast } from "sonner"

type StaticMailTemplateSearch = z.infer<typeof staticMailTemplateSearchSchema>

export const staticMailTemplateQueryOptions = (
  search: StaticMailTemplateSearch,
  initialData?: LaravelPaginationData<StaticMailTemplate[]>
) =>
  queryOptions({
    queryKey: staticMailTemplateKeys.list(search),
    queryFn: () => getStaticMailTemplates({ data: search }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })

export function useStaticMailTemplate(
  search: StaticMailTemplateSearch,
  initialData?: LaravelPaginationData<StaticMailTemplate[]>
) {
  return useSuspenseQuery(staticMailTemplateQueryOptions(search, initialData))
}

export function useDeleteStaticMailMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteStaticMailTemplate({ data: id })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staticMailTemplateKeys.lists(),
        exact: false,
      })
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat menghapus data")
    },
  })
}

export function useStaticMailtemplateSearch(
  searchQuery: string,
  isDropdownOpen: boolean,
  deps?: StaticMailTemplateSearch
) {
  return useQuery({
    queryKey: staticMailTemplateKeys.search(searchQuery, deps),
    queryFn: async () => {
      try {
        console.log('[useStaticMailtemplateSearch] Calling with deps:', deps)
        const result = await getObligatedStaticTemplate({ data: deps! })
        console.log('[useStaticMailtemplateSearch] Success:', result)
        return result
      } catch (error) {
        console.error('[useStaticMailtemplateSearch] Error:', error)
        throw error
      }
    },
    enabled: (isDropdownOpen || searchQuery.length > 0) && deps !== undefined,
    staleTime: 1000 * 60 * 5,
  })
}

import { obligatedTemplateKeys } from "@/keys/obligatedTemplateKeys"
import type { ObligatedTemplateListSchema } from "@/schema/mail/obligated-template.schema"
import { getObligatedTemplates } from "@/server/mails"
import {
  keepPreviousData,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { ObligatedTemplateListResponse } from "@workspace/types"

export const obligatedTemplateQueryOptions = (
  search: ObligatedTemplateListSchema,
  initialData?: ObligatedTemplateListResponse
) =>
  queryOptions({
    queryKey: obligatedTemplateKeys.list(search),
    queryFn: () => getObligatedTemplates({ data: search }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })

export function useObligatedTemplates(
  search: ObligatedTemplateListSchema,
  initialData?: ObligatedTemplateListResponse
) {
  return useSuspenseQuery(obligatedTemplateQueryOptions(search, initialData))
}

export function useObligatedTemplatesSearch(
  searchQuery: string,
  isDropdownOpen: boolean,
  deps?: ObligatedTemplateListSchema
) {
  return useQuery({
    queryKey: obligatedTemplateKeys.search(searchQuery, deps),
    queryFn: async () => {
      try {
        console.log("[useObligatedTemplatesSearch] Calling with deps:", deps)
        const result = await getObligatedTemplates({ data: deps! })
        console.log("[useObligatedTemplatesSearch] Success:", result)
        return result
      } catch (error) {
        console.error("[useObligatedTemplatesSearch] Error:", error)
        throw error
      }
    },
    enabled: (isDropdownOpen || searchQuery.length > 0) && deps !== undefined,
    staleTime: 1000 * 60 * 5,
  })
}

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
    queryFn: async () => {
      const result = await getObligatedTemplates({ data: search })
      return result.success ? result.data : undefined
    },
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
  params: ObligatedTemplateListSchema
) {
  return useQuery({
    queryKey: obligatedTemplateKeys.list(params),
    queryFn: async () => {
      const result = await getObligatedTemplates({ data: params })
      return result.success ? result.data : undefined
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

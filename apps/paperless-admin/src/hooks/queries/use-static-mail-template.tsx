import {
  keepPreviousData,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { staticMailTemplateKeys } from "@/keys/staticMailTemplateKeys"
import type z from "zod"
import type { staticMailTemplateSearchSchema } from "@/schema/list.schema"
import { getStaticMailTemplates } from "@/server/master"

type StaticMailTemplateSearch = z.infer<typeof staticMailTemplateSearchSchema>

export const staticMailTemplateQueryOptions = (
  search: StaticMailTemplateSearch
) =>
  queryOptions({
    queryKey: staticMailTemplateKeys.list(search),
    queryFn: () => getStaticMailTemplates({ data: search }),
    placeholderData: keepPreviousData,
  })

export function useStaticMailTemplate(search: StaticMailTemplateSearch) {
  return useSuspenseQuery(staticMailTemplateQueryOptions(search))
}

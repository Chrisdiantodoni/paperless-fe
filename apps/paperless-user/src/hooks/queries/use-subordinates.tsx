import {
  keepPreviousData,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { subordinateKeys } from "@/keys/subordinateKeys"
import type { SubordinateSearch } from "@/schema/list.schema"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { Subordinate } from "@workspace/types/master"
import { getSubordinates } from "@/server/master"

export const subordinateQueryOptions = (
  search: SubordinateSearch,
  initialData?: LaravelPaginationData<Subordinate[]>
) =>
  queryOptions({
    queryKey: subordinateKeys.list(search),
    queryFn: () => getSubordinates({ data: search }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })

export function useSubordinates(
  search: SubordinateSearch,
  initialData?: LaravelPaginationData<Subordinate[]>
) {
  return useSuspenseQuery(subordinateQueryOptions(search, initialData))
}

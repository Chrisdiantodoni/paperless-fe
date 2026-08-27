import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { authKeys } from "@/keys/authKeys"
import { getCurrentUser } from "@/server/auth"

export const userQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: () => getCurrentUser(),
  })

export function useUser() {
  return useSuspenseQuery(userQueryOptions())
}

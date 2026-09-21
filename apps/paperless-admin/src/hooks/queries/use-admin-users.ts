import { getPermissions, getUser, getUsers, updateUser } from "@/server/master"
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { AdminUser } from "@workspace/types/admin"
import type { LaravelPaginationData } from "@workspace/types/api"

export const adminUserKeys = {
  all: ["admin-users"] as const,
  list: (search: { page: number; search: string }) =>
    [...adminUserKeys.all, search] as const,
  detail: (id: string) => [...adminUserKeys.all, id] as const,
  permissions: (page: number) => ["admin-permissions", page] as const,
}

export const adminUsersQueryOptions = (
  search: { page: number; search: string },
  initialData?: LaravelPaginationData<AdminUser[]>
) =>
  queryOptions({
    queryKey: adminUserKeys.list(search),
    queryFn: () => getUsers({ data: search }),
    initialData,
    placeholderData: keepPreviousData,
  })

export function useAdminUsers(
  search: { page: number; search: string },
  initialData?: LaravelPaginationData<AdminUser[]>
) {
  return useQuery(adminUsersQueryOptions(search, initialData))
}

export function useAdminUser(id: string) {
  return useQuery(
    queryOptions({
      queryKey: adminUserKeys.detail(id),
      queryFn: () => getUser({ data: id }),
    })
  )
}

export function useAdminPermissions(page: number) {
  return useQuery(
    queryOptions({
      queryKey: adminUserKeys.permissions(page),
      queryFn: () => getPermissions({ data: { page } }),
    })
  )
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      permissions,
    }: {
      id: string
      permissions: string[] | null
    }) => updateUser({ data: { id, permissions } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all })
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.detail(variables.id),
      })
    },
  })
}

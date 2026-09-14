import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/server/notifications"
import { notificationKeys } from "@/keys/notifications"
import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { NotificationPage } from "@/services/API/notifications"

export const notificationListQueryOptions = () => ({
  queryKey: notificationKeys.list(),
  queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await getNotifications({ data: { page: pageParam, per_page: 10 } })
    return response.data as NotificationPage
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage: NotificationPage) =>
    lastPage.next_page_url ? Number(lastPage.current_page) + 1 : undefined,
  refetchInterval: 60_000,
})

export const unreadNotificationCountQueryOptions = () =>
  queryOptions({
    queryKey: notificationKeys.count(),
    queryFn: async () => {
      const response = await getUnreadNotificationCount()
      return response.data
    },
    refetchInterval: 60_000,
  })

export function useNotifications() {
  return useInfiniteQuery(notificationListQueryOptions())
}

export function useUnreadNotificationCount() {
  return useQuery(unreadNotificationCountQueryOptions())
}

function invalidateNotifications(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: notificationKeys.all })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead({ data: id }),
    onSuccess: () => invalidateNotifications(queryClient),
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => invalidateNotifications(queryClient),
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNotification({ data: id }),
    onSuccess: () => invalidateNotifications(queryClient),
  })
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteAllNotifications(),
    onSuccess: () => invalidateNotifications(queryClient),
  })
}

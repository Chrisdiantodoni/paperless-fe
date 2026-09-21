import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/server/notifications"
import { notificationKeys } from "@/keys/notifications"
import { authKeys } from "@/keys/authKeys"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import type { NotificationPage } from "@/services/API/notifications"
import { toast } from "sonner"

export const notificationListQueryOptions = () => ({
  queryKey: notificationKeys.list(),
  queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await getNotifications({
      data: { page: pageParam, per_page: 10 },
    })
    return response.data as NotificationPage
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage: NotificationPage) =>
    lastPage.next_page_url ? Number(lastPage.current_page) + 1 : undefined,
  refetchInterval: 60_000,
})

export function useNotifications() {
  return useInfiniteQuery(notificationListQueryOptions())
}

function invalidateNotifications(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: notificationKeys.list(),
      refetchType: "active",
    }),
    queryClient.invalidateQueries({
      queryKey: authKeys.me(),
      refetchType: "active",
    }),
  ])
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead({ data: id }),
    onSuccess: () => invalidateNotifications(queryClient),
    onError: () => toast.error("Notifikasi gagal ditandai sebagai dibaca"),
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => invalidateNotifications(queryClient),
    onError: () => toast.error("Notifikasi gagal ditandai sebagai dibaca"),
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNotification({ data: id }),
    onSuccess: () => invalidateNotifications(queryClient),
    onError: () => toast.error("Notifikasi gagal dihapus"),
  })
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteAllNotifications(),
    onSuccess: () => invalidateNotifications(queryClient),
    onError: () => toast.error("Semua notifikasi gagal dihapus"),
  })
}

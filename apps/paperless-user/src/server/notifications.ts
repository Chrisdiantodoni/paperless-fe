import { createServerFn } from "@tanstack/react-start"
import { notificationsApi } from "@/services/API/notifications"

const notificationId = (id: string) => id

export const getNotifications = createServerFn({ method: "GET" })
  .validator((params?: Record<string, string | number | undefined>) => params)
  .handler(({ data }) => notificationsApi.list(data))

export const getUnreadNotificationCount = createServerFn({ method: "GET" }).handler(() =>
  notificationsApi.countUnread()
)

export const markNotificationAsRead = createServerFn({ method: "POST" })
  .validator(notificationId)
  .handler(({ data }) => notificationsApi.markAsRead(data))

export const markAllNotificationsAsRead = createServerFn({ method: "POST" }).handler(() =>
  notificationsApi.markAllAsRead()
)

export const deleteNotification = createServerFn({ method: "POST" })
  .validator(notificationId)
  .handler(({ data }) => notificationsApi.remove(data))

export const deleteAllNotifications = createServerFn({ method: "POST" }).handler(() =>
  notificationsApi.removeAll()
)

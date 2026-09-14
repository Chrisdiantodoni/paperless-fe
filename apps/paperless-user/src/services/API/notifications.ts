import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import { api } from "../api"

export interface Notification {
  id: string
  type: string[] | null
  title: string
  message: string
  created_at: string
  isRead: boolean
  task_id: string | null
  mail_id: string | null
}

export type NotificationPage = LaravelPaginationData<Notification[]>

class NotificationsApi {
  async list(params?: Record<string, string | number | undefined>) {
    const response = await api.get<APIResponse<NotificationPage>>("/notifications", { params })
    return response.data
  }

  async countUnread() {
    const response = await api.get<APIResponse<number>>("/notifications/count-unread")
    return response.data
  }

  async markAsRead(id: string) {
    const response = await api.post<APIResponse<Notification>>(`/notifications/${id}/mark-as-read`)
    return response.data
  }

  async markAllAsRead() {
    const response = await api.post<APIResponse<null>>("/notifications/mark-all-as-read")
    return response.data
  }

  async remove(id: string) {
    const response = await api.post<APIResponse<null>>(`/notifications/${id}`)
    return response.data
  }

  async removeAll() {
    const response = await api.post<APIResponse<null>>("/notifications/delete-all")
    return response.data
  }
}

export const notificationsApi = new NotificationsApi()

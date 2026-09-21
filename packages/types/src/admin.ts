export interface AdminUser {
  id: string
  hris_user_id: string
  user_account: { username: string; is_active: boolean }
  staff: { fullname: string; position: string | null; branch: string | null }
  permissions: string[]
  created_at: string
}

import type { LaravelPaginationData } from "./api"

export interface AdminPermission {
  id: number
  name: string
  guard_name: string
  created_at: string
}

export type AdminUserPage = LaravelPaginationData<AdminUser[]>
export type AdminPermissionPage = AdminPermission[]

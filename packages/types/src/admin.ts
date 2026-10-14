export interface AdminUserPermission {
  id: number
  name: string
}

export interface AdminUserAccess {
  id: string
  name: string
}

export interface AdminUser {
  id: string
  hris_user_id: string
  user_account: { username: string; is_active: boolean }
  staff: { fullname: string; position: string | null; branch: string | null }
  permissions: (string | AdminUserPermission | null)[]
  permission_branches?: AdminUserAccess[]
  permission_departments?: AdminUserAccess[]
  permission_positions?: AdminUserAccess[]
  permission_category_mails?: AdminUserAccess[]
  branch_ids?: string[] | null
  department_ids?: string[] | null
  position_ids?: string[] | null
  category_mail_ids?: string[] | null
  created_at: string
}

import type { LaravelPaginationData } from "./api"

export interface AdminPermission {
  id: number
  name: string
  guard_name: string
  category: string | null
  created_at: string
}

export type AdminUserPage = LaravelPaginationData<AdminUser[]>
export type AdminPermissionPage = AdminPermission[]

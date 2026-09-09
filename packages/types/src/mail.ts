export interface AllMailProps {
  id: string
  document_number: string
  branch: Branch
  status: string
  sent_by: SentBy
  request_data: RequestData
  recipients: Recipient[]
  attachments: Attachment[]
  delegations: SentBy[]
  created_at: Date
  logs: MailLog[]
}

export interface MailLog {
  id: number
  action: string
  created_at: string
  notes: Record<string, unknown>
  performed_by: {
    id: string
    name: string
    position: string
    department: string
    branch: string
  }
}

export interface Attachment {
  id: string
  file_name: string
  file_url: string
  mime_type: string
  file_size: number
}

export interface Branch {
  id: string
  name: string
}

export interface SentBy {
  id: string
  user_id?: string
  name: string
  position: string
  department: string
  branch: string
  sender_user_id?: string
}

export interface Recipient {
  id: string
  name: string
  recipient_user_id: string
  position: string
  department: string
  branch: string
  sequence: number
  status: string
  notes: string
  recipient_type: "to" | "cc" | "superior"
}

export interface RequestData {
  type: string
  leave_type?: string
  start_date?: string
  end_date?: string
  reason?: string
  quota_deducted?: string
  notes?: string
  permit_type?: string
  date?: Date
  start_work_at?: string
  end_work_at?: string
  exit_time?: string
  return_time?: string
  table_details?: any[]
}

export interface ObligatedTemplate {
  id: string
  type: string
  request_type: string
  name: string
  code: string
  description: string
  is_active: string
  department_id: string
  department: string
  form_schema: string
  content: string
  branches: string
  departments: string
  positions: string
  recipients: string
  created_at: string
  updated_at: string
}

export interface ObligatedTemplateListParams {
  page?: number
  per_page?: number
  search?: string
  type?: string
  request_type?: string
  category_id?: string
  is_active?: string
}

export interface ObligatedTemplateListResponse {
  data: ObligatedTemplate[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface CreateMailLeaveData {
  static_mail_template_id: string
  start_date: string
  end_date: string
  days_taken: number
  leave_type: string
  reason: string
}

export interface CreateMailPermitData {
  static_mail_template_id: string
  date: string
  permit_type:
    | "Terlambat Masuk Kantor"
    | "Keluar Kantor pada Jam Kerja"
    | "Pulang Lebih Awal"
  start_work_at: string | null
  exit_time: string | null
  return_time: string | null
  end_work_at: string | null
  reason: string
}

export interface CreateMailAbsenceData {
  static_mail_template_id: string
  start_date: string
  end_date: string
  reason: string
}

export interface CreateMailOvertimeDetail {
  user_id: string
  date: string
  start_time: string
  end_time: string
  reason: string
}

export interface CreateMailOvertimeData {
  static_mail_template_id: string
  details: CreateMailOvertimeDetail[]
  reason: string
}

export interface CreateMailDynamicData {
  dynamic_mail_template_id: string
  payload: string
  form_schema: string
}

export interface CreateMailDelegation {
  user_id: string
}

export interface CreateMailPayload {
  request_type:
    | "dynamic"
    | "leave_request"
    | "permit_request"
    | "absence_request"
    | "overtime_request"
  user_id: string
  notes: string | null
  attachments?: File[]
  delegations: CreateMailDelegation[] | null
  leave_data?: CreateMailLeaveData
  permit_data?: CreateMailPermitData
  absence_data?: CreateMailAbsenceData
  overtime_data?: CreateMailOvertimeData
  dynamic_data?: CreateMailDynamicData
}

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
}

export interface RequestData {
  type: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  quota_deducted: string
  notes: string
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

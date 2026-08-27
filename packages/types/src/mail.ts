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

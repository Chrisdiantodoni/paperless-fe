import type { UserData } from "./user.type"

export interface Subordinate {
  id: string
  fullname: string
  nip: string
  branch: {
    id: string
    name: string
  }
  position: {
    id: string
    name: string
  }
  department: {
    id: string
    name: string
  }
  status: string
}

export interface Area {
  id: string
  name_area: string
  code_area: string
  pic_area: null
  is_active: boolean
}

export interface Branch {
  id: string
  area: Area
  name: string
  sub_area: null | string
  code_branch: string
  dpack_code: string
  name_branch: string
  company_name: string
  address_branch: string
  latitude_branch: string
  longitude_branch: string
  max_radius_branch: number
  qr_code_token: string
  qr_code_url: string
  umk_branch: string
  code_GL_branch: null | string
  code_invoice_branch: null | string
  sales_staff_count_branch: number
  category_branch: string
  is_active: boolean
}

export interface Position {
  id: string
  name: string
  mail_code: string
  level: string
  position_type: string
}

export interface Department {
  id: string
  name: string
  department_code: string
  branch_category: string
}

export interface StaticMailTemplate {
  id: string
  type: string
  name: string
  code: string
  description?: string
  department_id: string
  department: string
  is_active: string
  content: string
  request_type: "leave_request" | "permit_request" | "absence_request" | "overtime_request"
  branches: Branch[]
  departments: Department[]
  positions: Position[]
  recipients: {
    id: string
    sequence: number
    recipient_type: "to" | "cc"
    user_id: string
    department: string
    branch: string
    position: string
    nip: string
  }[]
  created_at: string
  updated_at: string
}

export interface ApprovalHistoryItem {
  id: string
  status: "draft" | "pending" | "approved" | "rejected"
  reason?: string
  scope_changes?: string[]
  created_at: string
  created_by: string
  created_by_name: string
}

export interface IDynamicMailTemplate {
  id: string
  type: string
  name: string
  code: string
  description?: string
  department_id: string
  department: string
  is_active: string
  content: string
  branches: Branch[]
  departments: Department[]
  positions: Position[]
  form_schema: any[]
  recipients: {
    id: string
    sequence: number
    recipient_type: "to" | "cc"
    user_id: string
    department: string
    branch: string
    position: string
    nip: string
  }[]
  approval_status: "draft" | "pending" | "approved" | "rejected"
  approval_history: ApprovalHistoryItem[]
  rejected_reason?: string
  rejected_at?: string
  rejected_by?: string
  approved_at?: string
  approved_by?: string
  created_at: string
  updated_at: string
}

export interface IStaff {
  id: string
  nip: string
  dpack_sales_code: string
  biodata: Biodata | null
  legal_documents: LegalDocuments
  employment_data: EmploymentData
  superior: null
  files: Files
  accessible_apps: any[]
  user_account: UserData | null
}

export interface Biodata {
  fullname: string
  nik: string
  email: string
  phone: string
  gender: string
  religion: string
  marital_status: string
  blood_type: null
  birth_place: null
  birth_date: Date
  address: Address
  family: Family
}

export interface Address {
  ktp_address: string
  home_address: string
}

export interface Family {
  dependency_count: number
  dependency_details: string
}

export interface EmploymentData {
  join_date: Date
  is_shift_worker: boolean
  branch: Branch
  department: Branch
  position: Position
}

export interface Files {
  photo_path: null
  signature_path: null
  id_card_photo_path: null
  latest_education_certificate_path: null
  resume_path: null
}

export interface LegalDocuments {
  npwp: null
  bpjs_kesehatan: string
  bpjs_kesehatan_mandiri: string
  bpjs_ketenagakerjaan: string
  bpjs_ketenagakerjaan_mandiri: string
  driver_license_number: null
  driver_license_type: null
}

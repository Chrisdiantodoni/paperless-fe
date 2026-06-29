// ── 1. SUB-INTERFACES (RELASI TERBAWAH) ──

export interface StaffDetails {
  id: string
  staff_id: string
  fullname: string
  nik: string | null
  email: string | null
  phone: string | null
  ktp_address: string | null
  home_address: string | null
  religion: string | null
  marital_status: string | null
  gender: string | null
  birth_place: string | null
  birth_date: string | null
  dependency_count: number
  dependency_details: string | null // sesuaikan jika ada object interface tersendiri nanti
  npwp: string | null
  bpjs_kesehatan: string | null
  bpjs_kesehatan_mandiri: string | null
  bpjs_ketenagakerjaan: string | null
  bpjs_ketenagakerjaan_mandiri: string | null
  bank_account_number: string | null
  emergency_contact_name: string | null
  emergency_contact_relationship: string | null
  emergency_contact_phone: string | null
  emergency_contact_address: string | null
  blood_type: string | null
  latest_education: string | null
  latest_education_major: string | null
  latest_education_graduation_year: string | null
  latest_education_university: string | null
  academic_degree: string | null
  driver_license_number: string | null
  driver_license_type: string | null
  photo_path: string | null
  signature_path: string | null
  id_card_photo_path: string | null
  latest_education_certificate_path: string | null
  resume_path: string | null
  facebook: string | null
  twitter: string | null
  instagram: string | null
  linkedin: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AppPivot {
  staff_id: string
  registered_app_id: string
  created_at: string
  updated_at: string
}

export interface AccessibleApp {
  id: string
  name: string
  app_code: string
  portal_url: string
  icon_url: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  pivot: AppPivot
}

export interface Staff {
  id: string
  branch_id: string
  area_id: string | null
  sub_area_id: string | null
  neq_id: string | null
  department_id: string | null
  position_id: string | null
  grade_id: string | null
  dpack_emp_code: string | null
  retired_at: string | null
  approved_work_at: string | null
  nip: string
  employment_status_id: string | null
  join_date: string | null
  dpack_sales_code: string | null
  is_shift_worker: boolean
  default_shift_id: string | null
  bank_account_number: string | null
  bank_name: string | null
  bank_branch: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  superior_id: string | null
  leave_quota: number
  details: StaffDetails
  accessible_apps: AccessibleApp[]
}

// ── 2. MIDDLE-INTERFACES (HRIS USER) ──

export interface HRISUser {
  id: string
  staff_id: string
  username: string
  is_active: boolean
  is_super_admin: boolean
  current_session_id: string
  role_template_label: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  must_change_password: boolean
  staff: Staff
}

// ── 3. ROOT-INTERFACE (USER UTAMA) ──

export interface UserData {
  id: string
  hris_user_id: string
  created_at: string
  updated_at: string
  hris_user: HRISUser
  roles: any[] // Ubah 'any[]' ke string[] atau interface khusus Role jika strukturnya sudah ada
  permissions: any[] // Ubah 'any[]' ke string[] atau interface khusus Permission jika sudah ada
}

// Interface Wrapper jika Anda ingin menembak response root API-nya langsung
export interface UserResponse {
  user: UserData
  token?: string
}

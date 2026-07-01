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

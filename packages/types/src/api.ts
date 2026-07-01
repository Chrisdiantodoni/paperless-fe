export interface TMeta {
  code: number
  status: string
  message: string
}

export interface LaravelPaginationLinks {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

// Struktur pagination dasar milik Laravel
export interface LaravelPaginationData<T> {
  current_page: number
  data: T // Array dari entity utama
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: LaravelPaginationLinks[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

// ── PERBAIKAN UTAMA: DIBUAT FLEKSIBEL MENGGUNAKAN CONDITIONAL GENERIC ──
// Jika Anda mempassing P sebagai true, dia akan otomatis pakai LaravelPaginationData.
// Jika diabaikan atau di-set false, dia menjadi respon biasa (meta + data).
export interface APIResponse<T, P extends boolean = false> {
  meta: TMeta
  data: P extends true ? LaravelPaginationData<T> : T
}

// Alias pembantu (Optional) agar kode Anda tetap terbaca rapi di tempat lain
export type PaginatedAPIResponse<T> = APIResponse<T, true>

// ── INTERFACE ERROR ANDA (Tetap Aman) ──
export interface ErrorAPI {
  code: string
  message: string
  originalError?: ErrorApiTypes
}

export interface ErrorApiTypes {
  name: string
  message: string
  stack: string
}

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  leave_request: "Cuti",
  permit_request: "Izin",
  absence_request: "Absen",
  overtime_request: "Lembur",
  job_posting_request: "Pengajuan Karyawan",
  dynamic_template: "Memo Internal",
  non_template: "Memo Internal (Non Template)",
}

export function getRequestTypeLabel(type: string | undefined): string {
  if (!type) return "—"
  return REQUEST_TYPE_LABELS[type] || type
}

export function getRequestTypeOptions() {
  return [
    { value: "dynamic_template", label: "Memo Internal" },
    { value: "non_template", label: "Memo Internal (Non Template)" },
    { value: "leave_request", label: "Cuti" },
    { value: "permit_request", label: "Izin" },
    { value: "absence_request", label: "Absen" },
    { value: "overtime_request", label: "Lembur" },
    { value: "job_posting_request", label: "Pengajuan Karyawan" },
  ]
}

export function getStaticRequestTypeOptions() {
  return [
    { value: "leave_request", label: "Cuti" },
    { value: "permit_request", label: "Izin" },
    { value: "absence_request", label: "Absen" },
    { value: "overtime_request", label: "Lembur" },
    { value: "job_posting_request", label: "Pengajuan Karyawan" },
  ]
}

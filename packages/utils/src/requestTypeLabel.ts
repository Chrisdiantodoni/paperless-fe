export const REQUEST_TYPE_LABELS: Record<string, string> = {
  leave_request: "Cuti",
  permit_request: "Izin",
  absence_request: "Absen",
  overtime_request: "Lembur",
  dynamic_template: "Template Dinamis",
}

export function getRequestTypeLabel(type: string | undefined): string {
  if (!type) return "—"
  return REQUEST_TYPE_LABELS[type] || type
}

export function getRequestTypeOptions() {
  return [
    { value: "dynamic_template", label: "Template Dinamis" },
    { value: "leave_request", label: "Cuti" },
    { value: "permit_request", label: "Izin" },
    { value: "absence_request", label: "Absen" },
    { value: "overtime_request", label: "Lembur" },
  ]
}

export function getStaticRequestTypeOptions() {
  return [
    { value: "leave_request", label: "Cuti" },
    { value: "permit_request", label: "Izin" },
    { value: "absence_request", label: "Absen" },
    { value: "overtime_request", label: "Lembur" },
  ]
}

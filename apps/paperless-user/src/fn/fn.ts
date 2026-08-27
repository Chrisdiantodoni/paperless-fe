export function statusUtils(status: string) {
  switch (status) {
    case "dynamic_template":
      return "Dynamic Template"
    case "leave_request":
      return "Cuti"
    case "permit_request":
      return "Izin"
    case "overtime_request":
      return "Lembur"
    case "absence_request":
      return "Absensi"
    default:
      return status
  }
}

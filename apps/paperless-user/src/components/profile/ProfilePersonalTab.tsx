import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { formatDate } from "@workspace/utils"
import type { StaffDetails } from "@workspace/types/user.type"

interface ProfilePersonalTabProps {
  details: StaffDetails
}

export function ProfilePersonalTab({ details }: ProfilePersonalTabProps) {
  const fields = [
    { label: "Nama Lengkap", value: details.fullname },
    { label: "NIK", value: details.nik || "-" },
    { label: "Jenis Kelamin", value: details.gender || "-" },
    { label: "Tempat Lahir", value: details.birth_place || "-" },
    { label: "Tanggal Lahir", value: details.birth_date ? formatDate(details.birth_date) : "-" },
    { label: "Agama", value: details.religion || "-" },
    { label: "Status Pernikahan", value: details.marital_status || "-" },
    { label: "Jumlah Tanggungan", value: details.dependency_count || "0" },
    { label: "Golongan Darah", value: details.blood_type || "-" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Pribadi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
              <p className="mt-1 text-base">{field.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import type { StaffDetails } from "@workspace/types/user.type"

interface ProfileContactTabProps {
  details: StaffDetails
}

export function ProfileContactTab({ details }: ProfileContactTabProps) {
  const fields = [
    { label: "Email", value: details.email || "-" },
    { label: "Nomor Telepon", value: details.phone || "-" },
    { label: "Alamat Rumah", value: details.home_address || "-" },
    { label: "Alamat KTP", value: details.ktp_address || "-" },
    { label: "Nama Kontak Darurat", value: details.emergency_contact_name || "-" },
    { label: "Hubungan Kontak Darurat", value: details.emergency_contact_relationship || "-" },
    { label: "Nomor Kontak Darurat", value: details.emergency_contact_phone || "-" },
    { label: "Alamat Kontak Darurat", value: details.emergency_contact_address || "-" },
    { label: "Nomor Rekening Bank", value: details.bank_account_number || "-" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Kontak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
              <p className="mt-1 break-words text-base">{field.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

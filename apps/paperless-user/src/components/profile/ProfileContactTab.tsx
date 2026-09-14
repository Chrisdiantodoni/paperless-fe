import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import type { StaffDetails } from "@workspace/types/user.type"

interface ProfileContactTabProps {
  details: StaffDetails
}

export function ProfileContactTab({ details }: ProfileContactTabProps) {
  const [revealed, setRevealed] = useState(false)
  const fields = [
    { label: "Email", value: details.email || "-" },
    { label: "Nomor Telepon", value: details.phone || "-" },
    { label: "Alamat Rumah", value: details.home_address || "-", sensitive: true },
    { label: "Alamat KTP", value: details.ktp_address || "-", sensitive: true },
    { label: "Nama Kontak Darurat", value: details.emergency_contact_name || "-", sensitive: true },
    { label: "Hubungan Kontak Darurat", value: details.emergency_contact_relationship || "-", sensitive: true },
    { label: "Nomor Kontak Darurat", value: details.emergency_contact_phone || "-", sensitive: true },
    { label: "Alamat Kontak Darurat", value: details.emergency_contact_address || "-", sensitive: true },
    { label: "Nomor Rekening Bank", value: details.bank_account_number || "-", sensitive: true },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Informasi Kontak</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setRevealed((current) => !current)}
          aria-pressed={revealed}
        >
          {revealed ? <EyeOff /> : <Eye />}
          {revealed ? "Sembunyikan" : "Tampilkan data sensitif"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
              <p className="mt-1 break-words text-base">
                {field.sensitive && !revealed
                  ? field.value === "-"
                    ? "-"
                    : "••••••••"
                  : field.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

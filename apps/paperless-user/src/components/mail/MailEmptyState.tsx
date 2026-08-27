import { MailOpen } from "lucide-react"

export function MailEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MailOpen className="size-7" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Pilih surat untuk dilihat
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih salah satu surat dari daftar untuk melihat detailnya
        </p>
      </div>
    </div>
  )
}
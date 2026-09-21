import { getDetailSkippedMail } from "@/server/mail"
import { useMailDetail } from "@/hooks/queries/use-mail"
import { useMemo, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { MailDetail } from "@/components/mail/mail-detail"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  MailCheck,
  UserCheck,
  UserPlus,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/ui/badge"
import type {
  MailSkipProps,
  MailTemplateType,
  RequestData,
} from "@workspace/types/mail"
import { formatDate } from "@workspace/utils"

export const resolveTitle = (templateType: MailTemplateType | undefined) => {
  switch (templateType) {
    case "leave_request":
      return "Permohonan Cuti"
    case "permit_request":
      return "Izin Kerja"
    case "absence_request":
      return "Permohonan Ketidakhadiran"
    case "overtime_request":
      return "Permohonan Lembur (Overtime)"
    case "dynamic_form":
      return "Formulir Khusus"
    case "non_template":
    case "dynamic_template":
      return "Memo Internal"
    default:
      return "Surat Permohonan"
  }
}

export const Route = createFileRoute("/_dashboard/mail/skip-mails/$id/detail")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const response = await getDetailSkippedMail({ data: params.id })
    if (!response.success) throw new Error(response.error)
    return { data: response.data }
  },
})

function RouteComponent() {
  const { data: response } = Route.useLoaderData()
  const detail: MailSkipProps = response
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const mailDetail = useMailDetail(selectedMailId ?? "")
  const skippedMails = detail?.skipped_mails ?? []
  const pageSize = 10
  const filteredMails = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return skippedMails
    return skippedMails.filter((mail) =>
      [
        mail.document_number,
        mail.mail_owner,
        mail.mail_type,
        mail.template_name,
      ].some((value) => value?.toLowerCase().includes(query))
    )
  }, [searchTerm, skippedMails])
  const totalPages = Math.max(1, Math.ceil(filteredMails.length / pageSize))
  const visibleMails = filteredMails.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  console.log(filteredMails)

  if (!detail) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Data tidak ditemukan.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon">
            <Link to="/mail/skip-mails">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Detail Delegasi Surat (Skipper)
            </h1>
            <p className="text-sm text-muted-foreground">
              ID: <span className="font-mono text-xs">{detail.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/mail/skip-mails/$id/edit" params={{ id: detail.id }}>
              Edit Data
            </Link>
          </Button>
        </div>
      </div>

      {/* Profil Skipper & Pembuat Data */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Skipper Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCheck className="h-4 w-4 text-primary" />
                Petugas Skipper
              </CardTitle>
              <CardDescription>
                Pegawai yang ditugaskan mendelegasikan
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-lg font-bold">{detail.skipper?.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{detail.skipper?.position || "-"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>
                  Dept:{" "}
                  <strong className="text-foreground">
                    {detail.skipper?.department}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div>
                Branch:{" "}
                <strong className="text-foreground">
                  {detail.skipper?.branch}
                </strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Created By Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Dibuat Oleh
              </CardTitle>
              <CardDescription>
                Pegawai yang mengajukan delegasi ini
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-lg font-bold">{detail.created_by?.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{detail.created_by?.position || "-"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>
                  Dept:{" "}
                  <strong className="text-foreground">
                    {detail.created_by?.department}
                  </strong>
                </span>
              </div>
              <span>•</span>
              <div>
                Branch:{" "}
                <strong className="text-foreground">
                  {detail.created_by?.branch}
                </strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ringkasan Periode, Waktu Dibuat & Total Dokumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Periode Berlaku
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold">
              {formatDate(detail.date_from)}{" "}
              <span className="font-normal text-muted-foreground">s/d</span>{" "}
              {formatDate(detail.date_to)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Rentang tanggal aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
            <MailCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skippedMails.length}</div>
            <p className="text-xs text-muted-foreground">Surat teralihkan</p>
          </CardContent>
        </Card>
      </div>

      {/* Catatan Alasan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Alasan Delegasi / Keterangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-md border bg-muted/40 p-3 text-sm leading-relaxed font-medium">
            {detail.reason || "-"}
          </p>
        </CardContent>
      </Card>

      {/* Tabel Surat yang Dilewati */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Daftar Dokumen Surat ({filteredMails.length})
          </CardTitle>
          <CardDescription>
            Surat yang masuk dalam cakupan periode skipper ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={searchTerm}
            placeholder="Cari nomor, pengirim, tipe, atau jenis surat..."
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setPage(1)
            }}
          />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">No.</TableHead>
                  <TableHead>Nomor Dokumen</TableHead>
                  <TableHead>Nama Pengirim</TableHead>
                  <TableHead>Tipe Surat (Mail)</TableHead>
                  <TableHead>Jenis Surat</TableHead>
                  <TableHead className="w-[80px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMails.length > 0 ? (
                  visibleMails.map((mail, index) => (
                    <TableRow key={mail.id}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold tracking-wide">
                          {mail.document_number}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {mail.mail_owner}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {resolveTitle(mail.mail_type)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {mail.template_name}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMailId(mail.user_mail_id)}
                          title="Lihat Surat"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      Tidak ada dokumen yang dilewati.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filteredMails.length > pageSize && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={Boolean(selectedMailId)}
        onOpenChange={(open) => !open && setSelectedMailId(null)}
      >
        <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col overflow-hidden p-0 sm:max-w-5xl">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle>Detail Surat</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <MailDetail
              detail={mailDetail.data}
              isLoading={mailDetail.isLoading}
              showCloseButton={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

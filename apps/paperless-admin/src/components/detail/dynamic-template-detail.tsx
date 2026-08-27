import type { IDynamicMailTemplate } from "@workspace/types/master"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import {
  Calendar,
  Building2,
  Briefcase,
  Users,
  Mail,
  Search,
  FileCode,
  Asterisk,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Input } from "@workspace/ui/components/ui/input"
import { formatDate } from "@workspace/utils"
import { useMemo, useState } from "react"
import { MarkdownPreview } from "@workspace/ui/components/editor/MarkdownPreview"

export default function DynamicTemplateDetail({
  data,
}: {
  data: IDynamicMailTemplate
}) {
  const recipients = data?.recipients ?? []

  const toRecipients = recipients
    .filter((r) => r.recipient_type === "to")
    .sort((a, b) => a.sequence - b.sequence)

  const ccRecipients = recipients
    .filter((r) => r.recipient_type === "cc")
    .sort((a, b) => a.sequence - b.sequence)

  return (
    <Card className="min-w-5xl shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl font-bold">{data.name}</CardTitle>
              {data.type && (
                <Badge variant="outline" className="text-xs">
                  {data.type}
                </Badge>
              )}
              <Badge
                variant={data.is_active ? "default" : "secondary"}
                className="text-xs"
              >
                {data.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {data.description && (
              <CardDescription className="text-base">
                {data.description}
              </CardDescription>
            )}
            <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 text-sm text-muted-foreground">
              {data.created_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Dibuat {formatDate(data.created_at)}
                </span>
              )}
              {data.updated_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Diperbarui {formatDate(data.updated_at)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* INFORMASI UMUM */}
        <div className="grid grid-cols-1 gap-6 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Kode Template
            </p>
            <p className="font-semibold">{data.code || "—"}</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Departemen Utama
            </p>
            <div className="flex items-center gap-2 font-medium">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {data.department || "—"}
            </div>
          </div>
        </div>

        {/* KONTEN */}
        {data.content && (
          <>
            <Separator />
            <div>
              <h3 className="mb-4 text-lg font-semibold">Konten</h3>
              {looksLikeHtml(data.content) ? (
                <div
                  className="tiptap max-w-none rounded-lg border border-input bg-background p-4"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              ) : (
                <MarkdownPreview markdown={data.content} />
              )}
            </div>
          </>
        )}

        <Separator />

        {/* SKEMA FORM */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <FileCode className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Skema Form</h3>
          </div>

          {!data.form_schema || data.form_schema.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada skema form.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.form_schema.map((field, idx) => (
                <div
                  key={field.name || idx}
                  className="flex items-start justify-between rounded-lg border bg-card p-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{field.label}</span>
                      {field.is_required && (
                        <Asterisk className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {field.name}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="font-mono text-[11px] uppercase"
                  >
                    {field.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* TARGET DISTRIBUSI */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Target Distribusi</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ScopeSection
              icon={Building2}
              title="Cabang"
              items={data.branches ?? []}
            />
            <ScopeSection
              icon={Users}
              title="Departemen"
              items={data.departments ?? []}
            />
            <ScopeSection
              icon={Briefcase}
              title="Posisi"
              items={data.positions ?? []}
            />
          </div>
        </div>

        <Separator />

        {/* RECIPIENTS */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Penerima Email</h3>
          </div>

          {recipients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada penerima.</p>
          ) : (
            <div className="space-y-6">
              {toRecipients.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    To ({toRecipients.length})
                  </h4>
                  <div className="flex flex-col gap-3">
                    {toRecipients.map((r) => (
                      <RecipientCard key={r.id} recipient={r} />
                    ))}
                  </div>
                </div>
              )}
              {ccRecipients.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    CC ({ccRecipients.length})
                  </h4>
                  <div className="flex flex-col gap-3">
                    {ccRecipients.map((r) => (
                      <RecipientCard key={r.id} recipient={r} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function RecipientCard({
  recipient,
}: {
  recipient: IDynamicMailTemplate["recipients"][number]
}) {
  const workInfo = [recipient.branch, recipient.department, recipient.position]
    .filter(Boolean)
    .join(" / ")

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center dark:hover:bg-slate-900/50">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
          {recipient.sequence}
        </div>

        <div>
          <p className="font-medium">
            {recipient.name || "—"}{" "}
            {recipient.nip && (
              <span className="font-normal text-muted-foreground">
                ({recipient.nip})
              </span>
            )}
          </p>
          {workInfo && (
            <p className="mt-0.5 text-xs text-muted-foreground">{workInfo}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ScopeSection({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  items: { id: string; name: string }[]
}) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        {title}
        {items.length > 0 && (
          <span className="text-xs text-muted-foreground/60">
            ({filtered.length})
          </span>
        )}
      </div>

      {items.length > 0 && (
        <div className="relative">
          <Search className="absolute top-2 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-xs"
            placeholder={`Cari ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada data.</p>
      ) : (
        <ul className="max-h-48 space-y-1 overflow-y-auto pr-1">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="rounded px-2 py-1.5 text-sm hover:bg-muted"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*?>/i.test(value.trim())
}

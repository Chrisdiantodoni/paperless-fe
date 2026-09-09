import { useState } from "react"
import { FileIcon, Eye, Download, X } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button"
import { FilePreviewModal } from "@workspace/ui/components/ui/file-preview-modal"
import { cn } from "@workspace/ui/lib/utils"

interface AttachmentItemProps {
  file: File | { id: string; name: string; url: string }
  mode?: "view" | "edit" | "upload"
  onDelete?: (id: string) => void
  className?: string
}

export function AttachmentItem({
  file,
  mode = "view",
  onDelete,
  className,
}: AttachmentItemProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const isFileObject = file instanceof File
  const fileName = isFileObject ? file.name : file.name
  const fileUrl = isFileObject ? undefined : file.url

  const isPreviewable = isFileObject
    ? file.type.startsWith("image/") || file.type === "application/pdf"
    : fileName.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/i)

  const handleDelete = () => {
    if (onDelete && !isFileObject) {
      onDelete(file.id)
    }
  }

  return (
    <>
      <div
        className={cn(
          "group flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50",
          className
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <FileIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{fileName}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {isPreviewable && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setIsPreviewOpen(true)}
              aria-label={`Preview ${fileName}`}
            >
              <Eye className="size-4" />
            </Button>
          )}

          {mode !== "upload" && fileUrl && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
              asChild
            >
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${fileName}`}
              >
                <Download className="size-4" />
              </a>
            </Button>
          )}

          {mode !== "view" && onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-destructive opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
              onClick={handleDelete}
              aria-label={`Remove ${fileName}`}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {isPreviewable && (
        <FilePreviewModal
          file={isFileObject ? file : undefined}
          fileUrl={fileUrl}
          fileName={fileName}
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}
    </>
  )
}

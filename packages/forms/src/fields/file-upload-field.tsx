"use client"

import { useId, useRef, useState } from "react"
import { useStore } from "@tanstack/react-form"
import { FileIcon, Upload, X, Eye } from "lucide-react"
import { useFieldContext } from "../forms/form-context"
import { Label } from "@workspace/ui/components/ui/label"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/ui/button"
import { FilePreviewModal } from "@workspace/ui/components/ui/file-preview-modal"
import { getErrorMessage } from "../utils/get-error-message"

interface FileUploadFieldProps {
  label: string
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  required?: boolean
}

export function FileUploadField({
  label,
  accept = ".pdf,image/*",
  multiple = false,
  maxSizeMb = 10,
  required = false,
}: FileUploadFieldProps) {
  const field = useFieldContext<File[]>()
  const id = useId()
  const errorId = `${id}-error`
  const inputRef = useRef<HTMLInputElement>(null)
  const errors = useStore(field.store, (state) => state.meta.errors)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const isPreviewable = (file: File) => {
    return file.type.startsWith("image/") || file.type === "application/pdf"
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return
    const incoming = Array.from(fileList)
    field.handleChange(
      multiple ? [...field.state.value, ...incoming] : incoming
    )
    field.validate("change")
  }

  function removeFile(index: number) {
    field.handleChange(field.state.value.filter((_, i) => i !== index))
  }

  const handlePreview = (file: File) => {
    setPreviewFile(file)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center",
          errors.length && "border-destructive"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          addFiles(e.dataTransfer.files)
        }}
      >
        <Upload className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Drag & drop, or</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Choose file{multiple ? "s" : ""}
        </Button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onBlur={field.handleBlur}
          onChange={(e) => addFiles(e.target.files)}
          aria-describedby={errors.length ? errorId : undefined}
        />
        <p className="text-xs text-muted-foreground">
          Hanya file PDF dan gambar yang diperbolehkan
        </p>
        <p className="text-xs text-muted-foreground">
          Max {maxSizeMb}MB per file
        </p>
      </div>

      {field.state.value.length > 0 && (
        <ul className="space-y-1">
          {field.state.value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{file.name}</span>
              </span>
              <div className="flex gap-1">
                {isPreviewable(file) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePreview(file)}
                    aria-label={`Preview ${file.name}`}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {errors.length > 0 && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errors.map(getErrorMessage).join(", ")}
        </p>
      )}

      <FilePreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  )
}

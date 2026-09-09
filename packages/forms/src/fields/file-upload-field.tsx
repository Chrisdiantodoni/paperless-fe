"use client"

import { useId, useRef, useState, useEffect } from "react"
import { useStore } from "@tanstack/react-form"
import { FileIcon, Upload, X, Eye } from "lucide-react"
import { useFieldContext } from "../forms/form-context"
import { Label } from "@workspace/ui/components/ui/label"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/ui/button"
import { FilePreviewModal } from "@workspace/ui/components/ui/file-preview-modal"
import { getErrorMessage } from "../utils/get-error-message"

interface FileMetadata {
  name: string
  size: number
  type: string
  lastModified: number
}

interface FileUploadFieldProps {
  label: string
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  required?: boolean
  onFilesChange?: (files: File[]) => void
}

export function FileUploadField({
  label,
  accept = ".pdf,image/*",
  multiple = false,
  maxSizeMb = 10,
  required = false,
  onFilesChange,
}: FileUploadFieldProps) {
  const field = useFieldContext<FileMetadata[]>()
  const id = useId()
  const errorId = `${id}-error`
  const inputRef = useRef<HTMLInputElement>(null)
  const filesRef = useRef<File[]>([])
  const errors = useStore(field.store, (state) => state.meta.errors)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const isPreviewable = (file: File) => {
    return file.type.startsWith("image/") || file.type === "application/pdf"
  }

  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(filesRef.current)
    }
  }, [field.state.value])

  function addFiles(fileList: FileList | null) {
    if (!fileList) return
    const incoming = Array.from(fileList)
    const currentValue = field.state.value || []
    const currentFiles = filesRef.current || []
    
    const newMetadata = incoming.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
    }))
    
    filesRef.current = multiple ? [...currentFiles, ...incoming] : incoming
    field.handleChange(
      multiple ? [...currentValue, ...newMetadata] : newMetadata
    )
    field.validate("change")
  }

  function removeFile(index: number) {
    const currentValue = field.state.value || []
    filesRef.current = filesRef.current.filter((_, i) => i !== index)
    field.handleChange(currentValue.filter((_, i) => i !== index))
  }

  const handlePreview = (index: number) => {
    const file = filesRef.current[index]
    if (file) {
      setPreviewFile(file)
      setIsPreviewOpen(true)
    }
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

      {(field.state.value || []).length > 0 && (
        <ul className="space-y-1">
          {(field.state.value || []).map((metadata, index) => {
            const file = filesRef.current[index]
            return (
              <li
                key={`${metadata.name}-${index}`}
                className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FileIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{metadata.name}</span>
                </span>
                <div className="flex gap-1">
                  {file && isPreviewable(file) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handlePreview(index)}
                      aria-label={`Preview ${metadata.name}`}
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
                    aria-label={`Remove ${metadata.name}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </li>
            )
          })}
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

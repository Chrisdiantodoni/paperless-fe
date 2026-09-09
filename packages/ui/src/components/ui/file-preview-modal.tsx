"use client"

import { useEffect, useRef, useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import type { PDFDocumentProxy } from "pdfjs-dist"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { Button } from "@workspace/ui/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

// Pastikan workerSrc sesuai dengan lokasi file worker di folder /public
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

interface FilePreviewModalProps {
  file?: File | null
  fileUrl?: string
  fileName?: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function FilePreviewModal({
  file,
  fileUrl,
  fileName,
  isOpen,
  onOpenChange,
}: FilePreviewModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false)
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false)

  const pdfDocRef = useRef<PDFDocumentProxy | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const displayName = file?.name || fileName || "Preview"

  console.log(file, fileUrl, fileName)

  const isPdf = file 
    ? file.type === "application/pdf"
    : Boolean(fileUrl?.match(/\.pdf(\?|$)/i))
    
  const isImage = file
    ? file.type.startsWith("image/")
    : Boolean(fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i))

  // 1. Tangani URL Preview Gambar (dengan cleanup otomatis)
  useEffect(() => {
    if (!isOpen || !isImage) return

    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      return () => {
        URL.revokeObjectURL(url)
        setImageUrl(null)
      }
    } else if (fileUrl) {
      setImageUrl(fileUrl)
      return () => setImageUrl(null)
    }
  }, [file, fileUrl, isOpen, isImage])

  // 2. Load Dokumen PDF saat modal aktif & file valid
  useEffect(() => {
    if (!isOpen || !isPdf || (!file && !fileUrl)) {
      pdfDocRef.current?.destroy()
      pdfDocRef.current = null
      setNumPages(0)
      setCurrentPage(1)
      return
    }

    let isCancelled = false
    setIsLoadingPdf(true)

    const loadPdf = async () => {
      try {
        let data: ArrayBuffer

        if (file) {
          data = await file.arrayBuffer()
        } else if (fileUrl) {
          const response = await fetch(fileUrl)
          if (!response.ok) throw new Error("Failed to fetch PDF")
          data = await response.arrayBuffer()
        } else {
          throw new Error("No file or fileUrl provided")
        }

        if (isCancelled) return

        const pdf = await pdfjsLib.getDocument({ data }).promise
        if (!pdf || isCancelled) return

        pdfDocRef.current = pdf
        setNumPages(pdf.numPages)
        setCurrentPage(1)
      } catch (err) {
        if (!isCancelled) console.error("Error loading PDF:", err)
      } finally {
        if (!isCancelled) setIsLoadingPdf(false)
      }
    }

    loadPdf()

    return () => {
      isCancelled = true
    }
  }, [file, fileUrl, isOpen, isPdf])

  // 3. Render Canvas hanya untuk halaman yang sedang aktif
  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current || currentPage < 1) return

    let renderTask: any = null
    let isCancelled = false
    setIsRenderingPage(true)

    pdfDocRef.current
      .getPage(currentPage)
      .then((page) => {
        if (isCancelled || !canvasRef.current) return

        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        if (!context) return

        const viewport = page.getViewport({ scale: 1.5 })
        canvas.width = viewport.width
        canvas.height = viewport.height

        renderTask = page.render({
          canvasContext: context,
          viewport,
        })
        return renderTask.promise
      })
      .catch((err) => {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Error rendering page:", err)
        }
      })
      .finally(() => {
        if (!isCancelled) setIsRenderingPage(false)
      })

    return () => {
      isCancelled = true
      if (renderTask) {
        renderTask.cancel()
      }
    }
  }, [currentPage, numPages])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate">{displayName}</DialogTitle>
        </DialogHeader>

        {/* Preview Gambar */}
        {isImage && imageUrl && (
          <div className="flex items-center justify-center p-2">
            <img
              src={imageUrl}
              alt={displayName}
              className="max-h-[70vh] w-auto rounded-lg object-contain"
            />
          </div>
        )}

        {/* Preview PDF */}
        {isPdf && (
          <div className="flex flex-col items-center">
            {isLoadingPdf ? (
              <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : numPages > 0 ? (
              <div className="w-full space-y-4">
                <div className="relative flex max-h-[70vh] items-center justify-center overflow-auto rounded-lg border bg-muted/20 p-2">
                  {isRenderingPage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xs">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <canvas ref={canvasRef} className="max-w-full shadow-xs" />
                </div>

                {numPages > 1 && (
                  <div className="flex items-center justify-between px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1 || isRenderingPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Halaman {currentPage} dari {numPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(numPages, p + 1))
                      }
                      disabled={currentPage >= numPages || isRenderingPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Gagal memuat dokumen PDF
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/core"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

interface ImageUploadDialogProps {
  editor: Editor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageUploadDialog({
  editor,
  open,
  onOpenChange,
}: ImageUploadDialogProps) {
  const [url, setUrl] = useState("")
  const [alt, setAlt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddImageFromUrl = () => {
    if (!editor || !url) return

    editor.chain().focus().setImage({ src: url, alt }).run()

    setUrl("")
    setAlt("")
    onOpenChange(false)
  }

  const handleFileUpload = async (file: File) => {
    if (!editor) return

    setLoading(true)
    try {
      const reader = new FileReader()

      reader.onload = (e) => {
        const src = e.target?.result as string
        editor.chain().focus().setImage({ src, alt: file.name }).run()
        setUrl("")
        setAlt("")
        onOpenChange(false)
        setLoading(false)
      }

      reader.readAsDataURL(file)
    } catch {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image or add an image URL to your document.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text (optional)</Label>
              <Input
                id="image-alt"
                placeholder="Describe the image"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-input p-8 text-center transition-colors hover:border-primary"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file)
                  }
                }}
                id="file-upload"
                className="hidden"
              />

              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-sm text-muted-foreground">
                  Drag and drop your image here, or click to select
                </p>
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddImageFromUrl} disabled={!url || loading}>
            {loading ? "Loading..." : "Add Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useEditor, getEditorContent, setEditorContent, type EditorOutputFormat } from "@workspace/ui/hooks/useEditor"
import { EditorToolbar } from "./EditorToolbar"
import { EditorArea } from "./EditorArea"
import { DocumentPreview } from "./DocumentPreview"

interface TiptapEditorProps {
  initialContent?: string
  id?: string
  onContentChange?: (content: string) => void
  placeholder?: string
  onChange?: (content: string) => void
  onBlur?: () => void
  value?: string
  hasError?: boolean
  className?: string
  format?: EditorOutputFormat
}

function normalizeContent(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

export function TiptapEditor({
  initialContent = "",
  id: _id,
  onContentChange,
  onChange,
  onBlur,
  value,
  hasError = false,
  className,
  placeholder,
  format = "html",
}: TiptapEditorProps) {
  const editor = useEditor(value || initialContent, placeholder, format)
  const [isPreview, setIsPreview] = useState(false)
  const skipSyncRef = useRef(false)

  useEffect(() => {
    if (!editor || value === undefined) return
    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }

    const current = getEditorContent(editor, format)
    if (normalizeContent(value) !== normalizeContent(current)) {
      setEditorContent(editor, value, format)
    }
  }, [editor, value, format])

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      const content = getEditorContent(editor, format)
      skipSyncRef.current = true
      onContentChange?.(content)
      onChange?.(content)
    }

    editor.on("update", handleUpdate)
    return () => {
      editor.off("update", handleUpdate)
    }
  }, [editor, onContentChange, onChange, format])

  useEffect(() => {
    if (!editor) return

    const handleBlur = () => {
      onBlur?.()
    }

    editor.on("blur", handleBlur)
    return () => {
      editor.off("blur", handleBlur)
    }
  }, [editor, onBlur])

  const { words, characters } = summarize(getEditorContent(editor, format))

  return (
    <div className={cn("w-full space-y-2", className)}>
      <EditorToolbar 
        editor={editor} 
        format={format}
        isPreview={isPreview}
        onPreviewChange={setIsPreview}
      />
      {isPreview ? (
        <DocumentPreview html={getEditorContent(editor, "html")} />
      ) : (
        <EditorArea
          editor={editor}
          className={cn(hasError && "border-destructive ring-1 ring-destructive")}
        />
      )}
      <div className="text-right text-xs text-muted-foreground">
        {words} kata &middot; {characters} karakter
      </div>
    </div>
  )
}

function summarize(content: string): { words: number; characters: number } {
  const text = content.trim()
  return {
    words: text.split(/\s+/).filter(Boolean).length,
    characters: text.length,
  }
}

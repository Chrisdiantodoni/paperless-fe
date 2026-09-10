"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useEditor, getMarkdownFromEditor, setEditorContent } from "@workspace/ui/hooks/useEditor"
import { EditorToolbar } from "./EditorToolbar"
import { EditorArea } from "./EditorArea"
import { MarkdownPreview } from "./MarkdownPreview"

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
}

function normalizeMarkdown(md: string): string {
  return md.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
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
}: TiptapEditorProps) {
  const editor = useEditor(value || initialContent, placeholder)
  const [isPreview, setIsPreview] = useState(false)
  const skipSyncRef = useRef(false)

  useEffect(() => {
    if (!editor || value === undefined) return
    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }

    const current = getMarkdownFromEditor(editor)
    if (normalizeMarkdown(value) !== normalizeMarkdown(current)) {
      setEditorContent(editor, value, "markdown")
    }
  }, [editor, value])

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      const markdown = getMarkdownFromEditor(editor)
      skipSyncRef.current = true
      onContentChange?.(markdown)
      onChange?.(markdown)
    }

    editor.on("update", handleUpdate)
    return () => {
      editor.off("update", handleUpdate)
    }
  }, [editor, onContentChange, onChange])

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

  const { words, characters } = summarize(getMarkdownFromEditor(editor))

  return (
    <div className={cn("w-full space-y-2", className)}>
      <EditorToolbar 
        editor={editor} 
        format="markdown"
        isPreview={isPreview}
        onPreviewChange={setIsPreview}
      />
      {isPreview ? (
        <MarkdownPreview markdown={getMarkdownFromEditor(editor)} />
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

"use client"

import { useEffect } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useEditor, getMarkdownFromEditor, setEditorContent } from "@workspace/ui/hooks/useEditor"
import { EditorToolbar } from "./EditorToolbar"
import { EditorArea } from "./EditorArea"

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

export function TiptapEditor({
  initialContent = "",
  id: _id,
  onContentChange,
  onChange,
  onBlur,
  value,
  hasError = false,
  className,
}: TiptapEditorProps) {
  const editor = useEditor(value || initialContent)

  useEffect(() => {
    if (!editor || value === undefined) return

    const currentMarkdown = getMarkdownFromEditor(editor)
    if (value !== currentMarkdown) {
      setEditorContent(editor, value, "markdown")
    }
  }, [editor, value])

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      const markdown = getMarkdownFromEditor(editor)
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
      <EditorToolbar editor={editor} format="markdown" />
      <EditorArea
        editor={editor}
        className={cn(hasError && "border-destructive ring-1 ring-destructive")}
      />
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

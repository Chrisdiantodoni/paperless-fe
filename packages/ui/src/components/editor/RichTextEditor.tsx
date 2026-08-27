"use client"

import { useState, useEffect } from "react"
import { useEditor as useTiptapEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import {
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@tiptap/extension-table"
import Underline from "@tiptap/extension-underline"
import { TextStyle, Color } from "@tiptap/extension-text-style"
import { EditorToolbar } from "./EditorToolbar"
import { EditorArea } from "./EditorArea"
import type { EditorOutputFormat } from "@workspace/ui/hooks/useEditor"
import { getEditorContent, setEditorContent } from "@workspace/ui/hooks/useEditor"
import { cn } from "@workspace/ui/lib/utils"

interface RichTextEditorProps {
  initialContent?: string
  /** Links the label's htmlFor to the editor for accessible focusing */
  id?: string
  /** Format emitted by onChange/onContentChange. Defaults to "markdown". */
  outputFormat?: EditorOutputFormat
  onContentChange?: (content: string) => void
  placeholder?: string
  /** called on every content change, same as onContentChange */
  onChange?: (content: string) => void
  /** fired when the editable area loses focus */
  onBlur?: () => void
  /** current field value — syncs editor when value changes externally (same format as outputFormat) */
  value?: string
  /** Shows a red border when true — wire up fieldState.invalid */
  hasError?: boolean
  className?: string
}

export function RichTextEditor({
  initialContent = "",
  id,
  outputFormat = "markdown",
  onContentChange,
  onChange,
  onBlur,
  value,
  hasError = false,
  className,
}: RichTextEditorProps) {
  const format: EditorOutputFormat = outputFormat
  const isHtml = format === "html"
  const [isPreview, setIsPreview] = useState(false)
  // Holds the last emitted content (in the selected format) for preview/count
  const [content, setContent] = useState(value ?? initialContent)
  // Live HTML of the editor — used for an accurate preview
  const [previewHtml, setPreviewHtml] = useState("")

  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
    ],
    content: value || initialContent || "<p></p>",
    // Fix SSR hydration mismatch — tiptap must not render on the server
    immediatelyRender: false,
    onBlur: () => onBlur?.(),
    editorProps: {
      attributes: { class: "focus:outline-none" },
    },
    onUpdate: ({ editor: tiptapEditor }) => {
      setPreviewHtml(tiptapEditor.getHTML())
      const editorContent = getEditorContent(tiptapEditor, format)
      setContent(editorContent)
      onContentChange?.(editorContent)
      onChange?.(editorContent)
    },
  })

  // Sync when an external controller (react-hook-form setValue / reset) changes the value
  useEffect(() => {
    if (!editor || value === undefined) return
    const current = getEditorContent(editor, format)
    if (normalizeContent(value) !== normalizeContent(current)) {
      setEditorContent(editor, value, format)
      setContent(value)
    }
    setPreviewHtml(editor.getHTML())
  }, [value, editor, format])

  // Seed initial content on mount
  useEffect(() => {
    if (!editor) return
    if (initialContent && !editor.view.state.doc.content.size) {
      setEditorContent(editor, initialContent, format)
      setContent(initialContent)
    }
    setPreviewHtml(editor.getHTML())
  }, [editor, initialContent, format])

  const { words, characters } = summarize(content, isHtml)

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div
        id={id}
        className={cn(
          "rounded-lg border border-input bg-background",
          hasError && "border-destructive ring-1 ring-destructive"
        )}
      >
        <EditorToolbar
          editor={editor}
          format={format}
          onPreviewChange={setIsPreview}
          isPreview={isPreview}
        />
        <div className="border-t border-input">
          {isPreview ? (
            <div
              className="tiptap rounded-none border-none px-4 py-3 min-h-80 max-h-[600px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <EditorArea editor={editor} />
          )}
        </div>
      </div>

      {/* Word / character count */}
      <div className="text-right text-xs text-muted-foreground">
        {words} words &middot; {characters} characters
      </div>
    </div>
  )
}

function normalizeContent(value: string): string {
  const trimmed = value === "<p></p>" ? "" : value.trim()
  return trimmed
}

function summarize(
  content: string,
  isHtml: boolean
): { words: number; characters: number } {
  const text = isHtml
    ? content
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim()
    : content.trim()

  return {
    words: text.split(/\s+/).filter(Boolean).length,
    characters: text.length,
  }
}

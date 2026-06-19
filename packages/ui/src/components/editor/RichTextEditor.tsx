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
import {
  getMarkdownFromEditor,
  setMarkdownContent,
} from "@workspace/ui/hooks/useEditor"
import { cn } from "@workspace/ui/lib/utils"
import { MarkdownPreview } from "./MarkdownPreview"

interface RichTextEditorProps {
  initialContent?: string
  onContentChange?: (markdown: string) => void
  placeholder?: string
  /** react-hook-form: called on every content change, same as onContentChange */
  onChange?: (value: string) => void
  /** react-hook-form: current field value — syncs editor when value changes externally */
  value?: string
  /** Shows a red border when true — wire up fieldState.invalid */
  hasError?: boolean
  className?: string
}

export function RichTextEditor({
  initialContent = "",
  onContentChange,
  onChange,
  value,
  hasError = false,
  placeholder = "Start typing...",
  className,
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [markdown, setMarkdown] = useState(value ?? initialContent)

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
    editorProps: {
      attributes: { class: "focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      const newMarkdown = getMarkdownFromEditor(editor)
      setMarkdown(newMarkdown)
      onContentChange?.(newMarkdown)
      onChange?.(newMarkdown)
    },
  })

  // Sync when an external controller (react-hook-form setValue / reset) changes the value
  useEffect(() => {
    if (!editor || value === undefined) return
    const current = getMarkdownFromEditor(editor)
    if (value !== current) {
      setMarkdownContent(editor, value)
      setMarkdown(value)
    }
  }, [value, editor])

  // Seed initial HTML content on mount
  useEffect(() => {
    if (editor && initialContent && !editor.view.state.doc.content.size) {
      setMarkdownContent(editor, initialContent)
    }
  }, [editor, initialContent])

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div
        className={cn(
          "rounded-lg border border-input bg-background",
          hasError && "border-destructive ring-1 ring-destructive"
        )}
      >
        <EditorToolbar
          editor={editor}
          onPreviewChange={setIsPreview}
          isPreview={isPreview}
        />
        <div className="border-t border-input">
          {isPreview ? (
            <MarkdownPreview
              markdown={markdown}
              className="rounded-none border-none"
            />
          ) : (
            <EditorArea editor={editor} />
          )}
        </div>
      </div>

      {/* Word / character count */}
      <div className="text-right text-xs text-muted-foreground">
        {markdown.split(/\s+/).filter(Boolean).length} words &middot;{" "}
        {markdown.length} characters
      </div>
    </div>
  )
}

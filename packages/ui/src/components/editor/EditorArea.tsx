import type { Editor } from "@tiptap/core"
import { EditorContent } from "@tiptap/react"

interface EditorAreaProps {
  editor: Editor | null
  className?: string
}

export function EditorArea({ editor, className = "" }: EditorAreaProps) {
  return (
    <div
      className={`rounded-lg border border-input bg-background ${className}`}
    >
      <EditorContent
        editor={editor}
        className="max-h-[600px] min-h-80 overflow-y-auto px-4 py-3 text-sm text-foreground focus:outline-none"
      />
    </div>
  )
}

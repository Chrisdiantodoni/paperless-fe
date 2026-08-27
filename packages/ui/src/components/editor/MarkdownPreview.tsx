"use client"

import { useMemo } from "react"
import { markdownToHtml } from "@workspace/ui/lib/markdown-utils"
import { cn } from "@workspace/ui/lib/utils"

interface MarkdownPreviewProps {
  markdown: string
  className?: string
}

export function MarkdownPreview({ markdown, className }: MarkdownPreviewProps) {
  const html = useMemo(() => markdownToHtml(markdown || ""), [markdown])

  return (
    <div
      className={cn(
        // Menyesuaikan container RichTextEditor
        "tiptap ProseMirror prose prose-sm dark:prose-invert max-w-none focus:outline-none",
        "max-h-[600px] min-h-80 overflow-y-auto rounded-none border-none px-4 py-3",

        // Styling Table agar persis sama dengan @tiptap/extension-table
        "[&_table]:my-3 [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse",
        "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground",
        "[&_td]:border [&_td]:border-border [&_td]:p-2.5 [&_td]:align-top",

        // Paragraf, List, Heading
        "[&_p]:my-2 [&_p]:leading-relaxed",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:my-0.5",
        "[&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-bold",
        "[&_h2]:my-2.5 [&_h2]:text-xl [&_h2]:font-bold",
        "[&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold",

        // Code & Blockquote
        "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",

        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

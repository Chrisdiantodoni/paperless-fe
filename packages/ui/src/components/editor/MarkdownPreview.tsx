"use client"

import { useMemo } from "react"
import { markdownToHtml } from "@workspace/ui/lib/markdown-utils"

interface MarkdownPreviewProps {
  markdown: string
  className?: string
}

export function MarkdownPreview({
  markdown,
  className = "",
}: MarkdownPreviewProps) {
  const html = useMemo(() => markdownToHtml(markdown), [markdown])

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none rounded-lg border border-input bg-background p-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

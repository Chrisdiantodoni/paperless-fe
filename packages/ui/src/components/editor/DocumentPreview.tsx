"use client"

import { cn } from "@workspace/ui/lib/utils"

interface DocumentPreviewProps {
  html: string
  className?: string
}

export function DocumentPreview({ html, className }: DocumentPreviewProps) {
  return (
    <div className={cn("bg-muted/30 p-4 md:p-8", className)}>
      <div
        className={cn(
          "mx-auto min-h-[29.7cm] max-w-[21cm] min-w-0 overflow-hidden bg-white shadow-lg",
          "px-6 py-8 md:px-[2cm] md:py-[2.5cm]",
          "prose prose-sm md:prose-base dark:prose-invert max-w-none",
          "[&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground",
          "[&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground",
          "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
          "[&_h4]:mt-3 [&_h4]:mb-2 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground",
          "[&_p]:mb-3 [&_p]:leading-relaxed [&_p]:text-foreground [&_p:empty]:min-h-[1.5em]",
          "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_li]:mb-1.5 [&_li]:leading-relaxed",
          "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
          "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground",
          "[&_pre]:my-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80",
          "[&_strong]:font-semibold [&_strong]:text-foreground",
          "[&_em]:italic",
          "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse",
          "[&_table]:border [&_table]:border-border",
          "[&_thead]:bg-muted/50",
          "[&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground",
          "[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-foreground",
          "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md",
          "[&_hr]:my-6 [&_hr]:border-border"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { DocumentPreview } from "./DocumentPreview"
import { Button } from "@workspace/ui/components/ui/button"
import { Eye, Pencil } from "@phosphor-icons/react"

interface RichTextEditorProps {
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

export function RichTextEditor({
  initialContent = "",
  id,
  onContentChange,
  onChange,
  onBlur,
  value,
  hasError = false,
  className,
  placeholder = "Tulis konten dalam format Markdown...",
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [content, setContent] = useState(value ?? initialContent)

  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value)
    }
  }, [value])

  const handleChange = (newValue: string) => {
    setContent(newValue)
    onContentChange?.(newValue)
    onChange?.(newValue)
  }

  const { words, characters } = summarize(content)

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div
        className={cn(
          "rounded-lg border border-input bg-background overflow-hidden",
          hasError && "border-destructive ring-1 ring-destructive"
        )}
      >
        <div className="flex items-center justify-end border-b border-input bg-muted/30 px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <>
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="mr-1.5 h-4 w-4" />
                Preview
              </>
            )}
          </Button>
        </div>

        {isPreview ? (
          <div className="max-h-[600px] overflow-y-auto">
            <DocumentPreview markdown={content} />
          </div>
        ) : (
          <Textarea
            id={id}
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className="min-h-[400px] resize-none rounded-none border-none font-mono text-sm focus-visible:ring-0"
          />
        )}
      </div>

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

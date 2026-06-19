"use client"

import { useEditorState, useEditor as useTiptapEditor } from "@tiptap/react"
import type { Editor } from "@tiptap/core"
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

export function useEditor(initialContent?: string): Editor | null {
  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
    ],
    content: initialContent || "<p></p>",
  })
  useEditorState({
    editor,
    selector: (ctx) => ctx.editor.state,
  })
  return editor
}

/**
 * Get markdown from editor
 */
export function getMarkdownFromEditor(editor: Editor | null): string {
  if (!editor) return ""

  const html = editor.getHTML()

  // Convert HTML to basic markdown
  let markdown = html
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<strong>|<b>/g, "**")
    .replace(/<\/strong>|<\/b>/g, "**")
    .replace(/<em>|<i>/g, "*")
    .replace(/<\/em>|<\/i>/g, "*")
    .replace(/<u>/g, "")
    .replace(/<\/u>/g, "")
    .replace(/<s>|<strike>/g, "~~")
    .replace(/<\/s>|<\/strike>/g, "~~")
    .replace(/<h1>/g, "# ")
    .replace(/<\/h1>/g, "\n\n")
    .replace(/<h2>/g, "## ")
    .replace(/<\/h2>/g, "\n\n")
    .replace(/<h3>/g, "### ")
    .replace(/<\/h3>/g, "\n\n")
    .replace(/<h4>/g, "#### ")
    .replace(/<\/h4>/g, "\n\n")
    .replace(/<h5>/g, "##### ")
    .replace(/<\/h5>/g, "\n\n")
    .replace(/<h6>/g, "###### ")
    .replace(/<\/h6>/g, "\n\n")
    .replace(/<blockquote>/g, "\n> ")
    .replace(/<\/blockquote>/g, "\n")
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "\n")
    .replace(/<ol>/g, "")
    .replace(/<\/ol>/g, "\n")
    .replace(/<li>/g, "- ")
    .replace(/<\/li>/g, "\n")
    .replace(/<code>/g, "`")
    .replace(/<\/code>/g, "`")
    .replace(/<pre><code[^>]*>/g, "```\n")
    .replace(/<\/code><\/pre>/g, "\n```")
    .replace(/<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g, "[$2]($1)")
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/g, "![$1]($2)")
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, "![$2]($1)")
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, "![]($1)")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (match) => {
      // Parse table
      const rows: string[] = []
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g
      let rowMatch

      while ((rowMatch = rowRegex.exec(match)) !== null) {
        const cells: string[] = []
        const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g
        let cellMatch

        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          cells.push(cellMatch[1].replace(/<[^>]*>/g, "").trim())
        }

        if (cells.length > 0) {
          rows.push(`| ${cells.join(" | ")} |`)
        }
      }

      if (rows.length === 0) return ""

      const separator = `| ${Array(rows[0].split("|").length - 2)
        .fill("---")
        .join(" | ")} |`
      return rows[0] + "\n" + separator + "\n" + rows.slice(1).join("\n") + "\n"
    })
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")

  // Clean up multiple newlines
  markdown = markdown.replace(/\n\n\n+/g, "\n\n")

  return markdown.trim()
}

/**
 * Set content from markdown
 */
export function setMarkdownContent(
  editor: Editor | null,
  markdown: string
): void {
  if (!editor) return

  // Simple markdown to HTML conversion
  let html = markdown
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/~~(.*?)~~/g, "<s>$1</s>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/- (.*?)$/gm, "<li>$1</li>")

  // Wrap loose list items
  html = html
    .replace(/(<li>.*?<\/li>)/s, "<ul>$1</ul>")
    .replace(/<\/ul>\s*<ul>/g, "")

  // Convert paragraphs
  const lines = html.split("\n").filter((line) => line.trim())
  html = lines
    .map((line) => {
      if (!line.match(/^<[hpul]/)) {
        return `<p>${line}</p>`
      }
      return line
    })
    .join("")

  editor.commands.setContent(html)
}

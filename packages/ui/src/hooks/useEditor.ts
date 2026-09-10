"use client"

import { useEditorState, useEditor as useTiptapEditor } from "@tiptap/react"
import type { Editor } from "@tiptap/core"
import { markdownToHtml } from "@workspace/ui/lib/markdown-utils"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"
import Underline from "@tiptap/extension-underline"
import { TextStyle, Color } from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"

export function useEditor(
  initialMarkdown?: string,
  _placeholder?: string
): Editor | null {
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
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          style: "background-color: #f3f4f6;",
        },
      }),
      TableCell.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: (element) =>
                element.style.backgroundColor || null,
              renderHTML: (attributes) => {
                if (!attributes.backgroundColor) {
                  return {}
                }
                return {
                  style: `background-color: ${attributes.backgroundColor}`,
                }
              },
            },
          }
        },
      }),
      Underline,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: markdownToHtml(initialMarkdown || "") || "<p></p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
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

  // Preserve raw table HTML (with colgroup/col width) so column widths
  // survive the markdown round-trip. markdown-it (html: true) renders it back.
  const tables: string[] = []
  let markdown = html.replace(/<table[^>]*>[\s\S]*?<\/table>/g, (m) => {
    tables.push(m)
    return `\u0000T${tables.length - 1}\u0000`
  })

  // Preserve empty paragraphs (Enter for spacing) and hard breaks (Shift+Enter)
  // as raw <br> so visible line breaks survive the markdown round-trip.
  // Runs before <br> handling so `<p><br></p>` matches as an empty paragraph.
  markdown = markdown.replace(
    /<p[^>]*>\s*(?:<br\s*\/?>\s*)?(?:&nbsp;\s*)?<\/p>/g,
    () => "\u0000BR\u0000"
  )

  // Convert HTML to basic markdown
  markdown = markdown
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
    .replace(/<br\s*\/?>/g, () => "\u0000BR\u0000")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")

  // Clean up multiple newlines
  markdown = markdown.replace(/\r\n/g, "\n")
  markdown = markdown.replace(/\n{3,}/g, "\n\n")

  // Re-insert preserved tables at the end
  markdown = markdown.replace(/\u0000T(\d+)\u0000/g, (_, i) => {
    return `\n\n${tables[Number(i)]}\n\n`
  })

  // Re-insert line breaks as raw HTML (rendered by markdown-it html: true)
  markdown = markdown.replace(/\u0000BR\u0000/g, () => "<br>")

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

  editor.commands.setContent(markdownToHtml(markdown) || "<p></p>")
}

export type EditorOutputFormat = "markdown" | "html"

/**
 * Get editor content in the requested format
 */
export function getEditorContent(
  editor: Editor | null,
  format: EditorOutputFormat
): string {
  if (!editor) return ""
  return format === "html" ? editor.getHTML() : getMarkdownFromEditor(editor)
}

/**
 * Set editor content from markdown or html
 */
export function setEditorContent(
  editor: Editor | null,
  content: string,
  format: EditorOutputFormat
): void {
  if (!editor) return
  if (format === "html") {
    // Legacy rows may still contain markdown — render it before importing
    const html = /<[a-z][\s\S]*?>/i.test(content.trim())
      ? content
      : markdownToHtml(content)
    editor.commands.setContent(html || "<p></p>")
    return
  }
  setMarkdownContent(editor, content)
}

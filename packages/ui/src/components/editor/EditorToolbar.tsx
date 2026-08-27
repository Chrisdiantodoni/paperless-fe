"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/core"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Link2,
  Image,
  Redo,
  Undo,
  Download,
  Eye,
  EyeOff,
  Table2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { LinkDialog } from "./LinkDialog"
import { TableDialog } from "./TableDialog"
import { ImageUploadDialog } from "./ImageUploadDialog"
import type { EditorOutputFormat } from "@workspace/ui/hooks/useEditor"
import {
  getEditorContent,
  setMarkdownContent,
} from "@workspace/ui/hooks/useEditor"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useEditorState } from "@tiptap/react"

interface EditorToolbarProps {
  editor: Editor | null
  format?: EditorOutputFormat
  onPreviewChange?: (preview: boolean) => void
  isPreview?: boolean
}

export function EditorToolbar({
  editor,
  format = "markdown",
  onPreviewChange,
  isPreview = false,
}: EditorToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)
  const [textColor, setTextColor] = useState("#000000")

  useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold"),
      isItalic: ctx.editor?.isActive("italic"),
      isUnderline: ctx.editor?.isActive("underline"),
      isStrike: ctx.editor?.isActive("strike"),
      isBulletList: ctx.editor?.isActive("bulletList"),
      isOrderedList: ctx.editor?.isActive("orderedList"),
      isCodeBlock: ctx.editor?.isActive("codeBlock"),
      isBlockquote: ctx.editor?.isActive("blockquote"),
      isH1: ctx.editor?.isActive("heading", { level: 1 }),
      isH2: ctx.editor?.isActive("heading", { level: 2 }),
      isH3: ctx.editor?.isActive("heading", { level: 3 }),
    }),
  })

  const handleAddLink = () => {
    setLinkOpen(true)
  }

  const handleExport = (targetFormat: EditorOutputFormat) => {
    const content = getEditorContent(editor, targetFormat)
    const extension = targetFormat === "html" ? "html" : "md"
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
    )
    element.setAttribute("download", `document.${extension}`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopy = (targetFormat: EditorOutputFormat) => {
    const content = getEditorContent(editor, targetFormat)
    navigator.clipboard.writeText(content)
  }

  const handleImportMarkdown = () => {
    const markdown = prompt("Paste your markdown:")
    if (markdown) {
      setMarkdownContent(editor, markdown)
    }
  }

  const handleTextColorChange = (color: string) => {
    setTextColor(color)
    editor?.chain().focus().setColor(color).run()
  }

  if (!editor) return null

  const inTable = editor.isActive("table")
  const canMergeCells = editor.can().mergeCells()
  const canSplitCell = editor.can().splitCell()

  const handleAddColumnBefore = () =>
    editor.chain().focus().addColumnBefore().run()
  const handleAddColumnAfter = () =>
    editor.chain().focus().addColumnAfter().run()
  const handleDeleteColumn = () => editor.chain().focus().deleteColumn().run()
  const handleAddRowBefore = () => editor.chain().focus().addRowBefore().run()
  const handleAddRowAfter = () => editor.chain().focus().addRowAfter().run()
  const handleDeleteRow = () => editor.chain().focus().deleteRow().run()
  const handleMergeCells = () => editor.chain().focus().mergeCells().run()
  const handleSplitCell = () => editor.chain().focus().splitCell().run()
  const handleToggleHeaderRow = () =>
    editor.chain().focus().toggleHeaderRow().run()
  const handleToggleHeaderColumn = () =>
    editor.chain().focus().toggleHeaderColumn().run()
  const handleDeleteTable = () => editor.chain().focus().deleteTable().run()

  return (
    <div className="space-y-2">
      {/* Main Toolbar */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-input bg-background p-2">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("bold") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("italic") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
            className="gap-1 pr-1.5"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("underline") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("strike") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          {/* Color Picker - moved here */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                title="Text Color"
                className="gap-1.5 px-2"
              >
                <span
                  className="text-xs leading-none font-semibold"
                  style={{ color: textColor }}
                >
                  A
                </span>
                <div
                  className="h-1 w-4 rounded-full"
                  style={{ backgroundColor: textColor }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <div className="space-y-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Text Color
                </p>

                {/* Preset palette */}
                {[
                  {
                    label: "Neutral",
                    colors: [
                      "#000000",
                      "#374151",
                      "#6B7280",
                      "#9CA3AF",
                      "#D1D5DB",
                      "#F3F4F6",
                      "#FFFFFF",
                    ],
                  },
                  {
                    label: "Red",
                    colors: [
                      "#7F1D1D",
                      "#B91C1C",
                      "#DC2626",
                      "#EF4444",
                      "#F87171",
                      "#FCA5A5",
                      "#FEE2E2",
                    ],
                  },
                  {
                    label: "Orange",
                    colors: [
                      "#7C2D12",
                      "#C2410C",
                      "#EA580C",
                      "#F97316",
                      "#FB923C",
                      "#FDBA74",
                      "#FED7AA",
                    ],
                  },
                  {
                    label: "Yellow",
                    colors: [
                      "#713F12",
                      "#A16207",
                      "#CA8A04",
                      "#EAB308",
                      "#FACC15",
                      "#FDE047",
                      "#FEF08A",
                    ],
                  },
                  {
                    label: "Green",
                    colors: [
                      "#14532D",
                      "#15803D",
                      "#16A34A",
                      "#22C55E",
                      "#4ADE80",
                      "#86EFAC",
                      "#DCFCE7",
                    ],
                  },
                  {
                    label: "Blue",
                    colors: [
                      "#1E3A5F",
                      "#1D4ED8",
                      "#2563EB",
                      "#3B82F6",
                      "#60A5FA",
                      "#93C5FD",
                      "#DBEAFE",
                    ],
                  },
                  {
                    label: "Purple",
                    colors: [
                      "#3B0764",
                      "#7E22CE",
                      "#9333EA",
                      "#A855F7",
                      "#C084FC",
                      "#D8B4FE",
                      "#F3E8FF",
                    ],
                  },
                ].map(({ label, colors }) => (
                  <div key={label}>
                    <p className="mb-1 text-[10px] text-muted-foreground">
                      {label}
                    </p>
                    <div className="flex gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          title={color}
                          onClick={() => handleTextColorChange(color)}
                          className="size-6 cursor-pointer rounded transition-transform hover:scale-110 focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none"
                          style={{
                            backgroundColor: color,
                            outline:
                              textColor === color
                                ? "2px solid hsl(var(--primary))"
                                : "1px solid rgba(0,0,0,0.15)",
                            outlineOffset: textColor === color ? "2px" : "0px",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Divider + custom / eyedropper */}
                <div className="flex items-center gap-2 border-t border-border pt-2">
                  <label
                    htmlFor="custom-color"
                    className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors select-none hover:text-foreground"
                  >
                    <div className="size-5 flex-shrink-0 overflow-hidden rounded border border-input">
                      <input
                        id="custom-color"
                        type="color"
                        value={textColor}
                        onChange={(e) => handleTextColorChange(e.target.value)}
                        className="absolute h-8 w-8 -translate-x-1 -translate-y-1 cursor-pointer opacity-0"
                      />
                      <div
                        className="size-full"
                        style={{ backgroundColor: textColor }}
                      />
                    </div>
                    Custom / Eyedropper
                  </label>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {textColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Headings */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={
              editor.isActive("heading", { level: 1 }) ? "default" : "outline"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={
              editor.isActive("heading", { level: 2 }) ? "default" : "outline"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={
              editor.isActive("heading", { level: 3 }) ? "default" : "outline"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Lists */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("bulletList") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("orderedList") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Blocks */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("codeBlock") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("blockquote") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Alignment */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={
              editor.isActive({ textAlign: "left" }) ? "default" : "outline"
            }
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={
              editor.isActive({ textAlign: "center" }) ? "default" : "outline"
            }
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={
              editor.isActive({ textAlign: "right" }) ? "default" : "outline"
            }
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Media & Links */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setImageOpen(true)}
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddLink}
            title="Insert Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant={inTable ? "default" : "outline"}
                title="Table"
              >
                <Table2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onSelect={() => setTableOpen(true)}>
                Insert table
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!inTable}
                onSelect={handleAddColumnBefore}
              >
                Add column before
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!inTable}
                onSelect={handleAddColumnAfter}
              >
                Add column after
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!inTable}
                onSelect={handleDeleteColumn}
              >
                Delete column
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={!inTable} onSelect={handleAddRowBefore}>
                Add row before
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!inTable} onSelect={handleAddRowAfter}>
                Add row after
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!inTable} onSelect={handleDeleteRow}>
                Delete row
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canMergeCells}
                onSelect={handleMergeCells}
              >
                Merge cells
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canSplitCell}
                onSelect={handleSplitCell}
              >
                Split cell
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!inTable}
                onSelect={handleToggleHeaderRow}
              >
                Toggle header row
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!inTable}
                onSelect={handleToggleHeaderColumn}
              >
                Toggle header column
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!inTable}
                onSelect={handleDeleteTable}
              >
                Delete table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Export/Import */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              title={`Export as ${format}`}
            >
              <Download className="mr-1 h-4 w-4" />
              Export {format}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("markdown")}>
              Download as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopy("markdown")}>
              Copy Markdown
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport("html")}>
              Download as HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopy("html")}>
              Copy HTML
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleImportMarkdown}
          title="Import Markdown"
        >
          Import Markdown
        </Button>

        {/* Preview Toggle */}
        <Button
          type="button"
          size="sm"
          variant={isPreview ? "default" : "outline"}
          onClick={() => onPreviewChange?.(!isPreview)}
          title="Toggle Preview"
        >
          {isPreview ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Dialogs */}
      <LinkDialog editor={editor} open={linkOpen} onOpenChange={setLinkOpen} />
      <TableDialog
        editor={editor}
        open={tableOpen}
        onOpenChange={setTableOpen}
      />
      <ImageUploadDialog
        editor={editor}
        open={imageOpen}
        onOpenChange={setImageOpen}
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/core"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"

interface LinkDialogProps {
  editor: Editor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedText?: string
}

export function LinkDialog({
  editor,
  open,
  onOpenChange,
  selectedText = "",
}: LinkDialogProps) {
  const [url, setUrl] = useState("")
  const [text, setText] = useState(selectedText)
  const [openNewTab, setOpenNewTab] = useState(true)

  const handleAddLink = () => {
    if (!editor || !url) return

    if (text) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: openNewTab ? "_blank" : "" })
        .run()
    }

    setUrl("")
    setText("")
    setOpenNewTab(true)
    onOpenChange(false)
  }

  const handleImportLinks = () => {
    // This would typically open a file picker or allow pasting
    const linkText = prompt(
      "Paste markdown or text with links (e.g., [text](url)):"
    )
    if (!linkText) return

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let match
    let content = ""

    while ((match = linkRegex.exec(linkText)) !== null) {
      content += `<a href="${match[2]}">${match[1]}</a> `
    }

    if (content) {
      editor?.chain().focus().insertContent(content).run()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
          <DialogDescription>
            Add a link to your document. You can also import markdown links.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text (optional)</Label>
            <Input
              id="link-text"
              placeholder="Enter link text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="open-tab"
              checked={openNewTab}
              onCheckedChange={(checked) => setOpenNewTab(checked as boolean)}
            />
            <Label htmlFor="open-tab" className="cursor-pointer font-normal">
              Open in new tab
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleImportLinks}>
            Import Links
          </Button>
          <Button onClick={handleAddLink} disabled={!url}>
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

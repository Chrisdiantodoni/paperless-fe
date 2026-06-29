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
} from "@workspace/ui/components/ui/dialog"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

interface TableDialogProps {
  editor: Editor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TableDialog({ editor, open, onOpenChange }: TableDialogProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  const handleInsertTable = () => {
    if (!editor) return

    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run()

    setRows(3)
    setCols(3)
    onOpenChange(false)
  }

  const handleAddRowAbove = () => {
    if (!editor) return
    editor.chain().focus().addRowBefore().run()
  }

  const handleAddRowBelow = () => {
    if (!editor) return
    editor.chain().focus().addRowAfter().run()
  }

  const handleAddColumnLeft = () => {
    if (!editor) return
    editor.chain().focus().addColumnBefore().run()
  }

  const handleAddColumnRight = () => {
    if (!editor) return
    editor.chain().focus().addColumnAfter().run()
  }

  const handleDeleteRow = () => {
    if (!editor) return
    editor.chain().focus().deleteRow().run()
  }

  const handleDeleteColumn = () => {
    if (!editor) return
    editor.chain().focus().deleteColumn().run()
  }

  const handleDeleteTable = () => {
    if (!editor) return
    editor.chain().focus().deleteTable().run()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
          <DialogDescription>
            Specify the number of rows and columns for your table.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table-rows">Rows</Label>
            <Input
              id="table-rows"
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="table-cols">Columns</Label>
            <Input
              id="table-cols"
              type="number"
              min="1"
              max="20"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Table Operations</p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={handleAddRowAbove}>
                Add Row Above
              </Button>
              <Button size="sm" variant="outline" onClick={handleAddRowBelow}>
                Add Row Below
              </Button>
              <Button size="sm" variant="outline" onClick={handleAddColumnLeft}>
                Add Col Left
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddColumnRight}
              >
                Add Col Right
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteRow}
                className="text-destructive hover:text-destructive"
              >
                Delete Row
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteColumn}
                className="text-destructive hover:text-destructive"
              >
                Delete Col
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleDeleteTable}
            className="mr-auto text-destructive hover:text-destructive"
          >
            Delete Table
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsertTable}>Insert Table</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

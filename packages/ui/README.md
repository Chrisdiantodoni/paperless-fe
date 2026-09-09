# @workspace/ui

Shared UI components for Paperless monorepo.

## Editor Components

### TiptapEditor (WYSIWYG)

Full-featured WYSIWYG editor with rich formatting, tables, and markdown output.

**Features:**
- Rich text formatting (bold, italic, underline, strikethrough)
- Headings (H1-H3), lists (bullet/ordered), code blocks, blockquotes
- Text alignment (left, center, right)
- Text color picker with preset palettes
- Links and images
- **Tables with full toolbar:**
  - Insert table (default 3×3)
  - Add/delete rows and columns
  - Merge/split cells
  - Toggle header row/column
  - Cell background color
  - Resizable columns (drag handle)
  - Auto width reset
- Undo/Redo
- Export/import markdown
- Output: Markdown format

**Usage:**

```tsx
import { TiptapEditor } from "@workspace/ui/components/editor"

function MyForm() {
  const [content, setContent] = useState("")

  return (
    <TiptapEditor
      value={content}
      onChange={setContent}
      placeholder="Tulis konten..."
      hasError={false}
    />
  )
}
```

**With TanStack Form:**

```tsx
import { TiptapEditor } from "@workspace/ui/components/editor"

<form.Field name="content">
  {(field) => (
    <TiptapEditor
      value={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
      hasError={field.state.meta.errors.length > 0}
    />
  )}
</form.Field>
```

### RichTextEditor (Markdown)

Simple markdown editor with preview toggle.

**Features:**
- Plain textarea with markdown syntax
- Preview mode (rendered markdown)
- Edit/Preview toggle button
- Word and character count
- Output: Markdown format

**Usage:**

```tsx
import { RichTextEditor } from "@workspace/ui/components/editor"

function MyForm() {
  const [content, setContent] = useState("")

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Tulis konten dalam format Markdown..."
    />
  )
}
```

## When to Use Which Editor

- **TiptapEditor**: Use when users need visual formatting, tables, or don't know markdown
- **RichTextEditor**: Use when users prefer writing raw markdown or need simple text editing

Both editors output markdown format for consistent storage.

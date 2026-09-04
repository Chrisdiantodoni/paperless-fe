# Form Implementation Patterns

Complete guide for implementing forms with TanStack Form, Zod validation, and server-side submission in paperless-admin.

---

## Table of Contents

- [Overview](#overview)
- [Form Schema Definition](#form-schema-definition)
- [Basic Form Setup](#basic-form-setup)
- [Field Patterns](#field-patterns)
- [Form Submission](#form-submission)
- [Validation Patterns](#validation-patterns)
- [Error Handling](#error-handling)

---

## Overview

Forms in paperless-admin use:

- **TanStack Form** - Form state management
- **Zod** - Schema validation
- **@tanstack/zod-adapter** - Zod integration
- **shadcn/ui** - Form components
- **Server Functions** - Form submission

---

## Form Schema Definition

### Location

`apps/paperless-admin/src/schema/[domain]/schema.ts`

### Define Form Schema

```typescript
import z from "zod"

export const staticMailTemplateFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi"),
  department_id: z.string().min(1, "Departemen wajib diisi"),
  branch_id: z.string().optional(),
  position_id: z.string().optional(),
  subject: z.string().min(1, "Subject wajib diisi"),
  body: z.string().min(1, "Konten wajib diisi"),
  is_active: z.boolean().default(true),
})

export type StaticMailTemplateFormSchema = z.infer<typeof staticMailTemplateFormSchema>
```

### Validation Rules

#### Required Fields

```typescript
name: z.string().min(1, "Nama wajib diisi")
```

#### Optional Fields

```typescript
branch_id: z.string().optional()
```

#### Email Validation

```typescript
email: z.string().email("Email tidak valid")
```

#### Number Validation

```typescript
age: z.number().min(18, "Minimal 18 tahun").max(100, "Maksimal 100 tahun")
```

#### URL Validation

```typescript
website: z.string().url("URL tidak valid").optional()
```

#### Date Validation

```typescript
birth_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Tanggal tidak valid"
})
```

#### Custom Validation

```typescript
password: z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(/[A-Z]/, "Harus ada huruf besar")
  .regex(/[0-9]/, "Harus ada angka")
```

---

## Basic Form Setup

### Location

`apps/paperless-admin/src/routes/_dashboard/[domain]/[entity]/create.tsx`

### Import Dependencies

```typescript
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-adapter"
import { staticMailTemplateFormSchema } from "@/schema/master/schema"
import { Button } from "@workspace/ui/components/ui/button"
import { Field } from "@workspace/ui/components/ui/field"
import { toast } from "sonner"
```

### Create Route

```typescript
export const Route = createFileRoute("/_dashboard/mail/static-mail-templates/create")({
  component: CreateStaticMailTemplate,
})
```

### Form Component Structure

```typescript
function CreateStaticMailTemplate() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      department_id: "",
      branch_id: "",
      position_id: "",
      subject: "",
      body: "",
      is_active: true,
    },
    onSubmit: async ({ value }) => {
      try {
        // Submit logic here
        await createStaticMailTemplate({ data: value })
        toast.success("Template berhasil dibuat")
        navigate({ to: "/mail/static-mail-templates" })
      } catch (error: any) {
        toast.error(error.message || "Gagal membuat template")
      }
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <div className="container mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Buat Template Statis</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {/* Fields go here */}

        <div className="flex gap-2">
          <Button type="submit" disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/mail/static-mail-templates" })}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
```

---

## Field Patterns

### Text Input Field

```typescript
<form.Field
  name="name"
  validators={{
    onChange: staticMailTemplateFormSchema.shape.name,
  }}
>
  {(field) => (
    <Field label="Nama Template" error={field.state.meta.errors[0]}>
      <input
        type="text"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="Masukkan nama template"
      />
    </Field>
  )}
</form.Field>
```

### Textarea Field

```typescript
<form.Field
  name="body"
  validators={{
    onChange: staticMailTemplateFormSchema.shape.body,
  }}
>
  {(field) => (
    <Field label="Konten" error={field.state.meta.errors[0]}>
      <textarea
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="Masukkan konten template"
        rows={6}
      />
    </Field>
  )}
</form.Field>
```

### Select Field

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

<form.Field
  name="status"
  validators={{
    onChange: z.enum(["active", "inactive"]),
  }}
>
  {(field) => (
    <Field label="Status" error={field.state.meta.errors[0]}>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="inactive">Tidak Aktif</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  )}
</form.Field>
```

### Checkbox Field

```typescript
import { Checkbox } from "@workspace/ui/components/ui/checkbox"

<form.Field
  name="is_active"
  validators={{
    onChange: z.boolean(),
  }}
>
  {(field) => (
    <div className="flex items-center gap-2">
      <Checkbox
        id="is_active"
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
      />
      <label htmlFor="is_active" className="text-sm">
        Aktif
      </label>
    </div>
  )}
</form.Field>
```

### Combobox Field (Dynamic Data)

```typescript
import { DepartmentCombobox } from "@/components/select/select-departments"

<form.Field
  name="department_id"
  validators={{
    onChange: staticMailTemplateFormSchema.shape.department_id,
  }}
>
  {(field) => (
    <Field label="Departemen" error={field.state.meta.errors[0]}>
      <DepartmentCombobox
        value={{ value: field.state.value, label: "" }}
        onChange={(val) => field.handleChange(val.value)}
      />
    </Field>
  )}
</form.Field>
```

### Number Input Field

```typescript
<form.Field
  name="age"
  validators={{
    onChange: z.number().min(18).max(100),
  }}
>
  {(field) => (
    <Field label="Umur" error={field.state.meta.errors[0]}>
      <input
        type="number"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        placeholder="Masukkan umur"
      />
    </Field>
  )}
</form.Field>
```

### Date Picker Field

```typescript
import { DatePicker } from "@workspace/ui/components/ui/date-picker"

<form.Field
  name="birth_date"
  validators={{
    onChange: z.string().min(1, "Tanggal lahir wajib diisi"),
  }}
>
  {(field) => (
    <Field label="Tanggal Lahir" error={field.state.meta.errors[0]}>
      <DatePicker
        date={field.state.value ? new Date(field.state.value) : undefined}
        onSelect={(date) => field.handleChange(date?.toISOString() || "")}
      />
    </Field>
  )}
</form.Field>
```

---

## Form Submission

### Create Form Submission

```typescript
import { createStaticMailTemplate } from "@/server/master"

const form = useForm({
  defaultValues: {
    name: "",
    code: "",
    is_active: true,
  },
  onSubmit: async ({ value }) => {
    try {
      await createStaticMailTemplate({ data: value })
      toast.success("Template berhasil dibuat")
      navigate({ to: "/mail/static-mail-templates" })
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat template")
    }
  },
  validatorAdapter: zodValidator(),
})
```

### Edit Form Submission (with ID)

```typescript
import { useParams } from "@tanstack/react-router"
import { updateStaticMailTemplate } from "@/server/master"

function EditStaticMailTemplate() {
  const { id } = useParams({ from: "/mail/static-mail-templates/$id/edit" })
  
  const form = useForm({
    defaultValues: {
      // Load from loader data
    },
    onSubmit: async ({ value }) => {
      try {
        await updateStaticMailTemplate({ data: { id, ...value } })
        toast.success("Template berhasil diperbarui")
        navigate({ to: "/mail/static-mail-templates/$id", params: { id } })
      } catch (error: any) {
        toast.error(error.message || "Gagal memperbarui template")
      }
    },
    validatorAdapter: zodValidator(),
  })
  
  // ...
}
```

---

**⚠️ PART 1 ENDS HERE (298 lines) - PART 2 CONTINUES WITH VALIDATION & ERROR HANDLING**

## Validation Patterns

### Client-Side Validation

**Validates on change:**

```typescript
<form.Field
  name="email"
  validators={{
    onChange: z.string().email("Email tidak valid"),
  }}
>
  {(field) => (
    <Field label="Email" error={field.state.meta.errors[0]}>
      <input
        type="email"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </Field>
  )}
</form.Field>
```

### Blur Validation

**Validates on blur (better UX):**

```typescript
<form.Field
  name="name"
  validators={{
    onBlur: staticMailTemplateFormSchema.shape.name,
  }}
>
  {(field) => (
    <Field label="Nama" error={field.state.meta.errors[0]}>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </Field>
  )}
</form.Field>
```

### Combined Validation

```typescript
<form.Field
  name="password"
  validators={{
    onChange: z.string().min(8),
    onBlur: z.string().regex(/[A-Z]/, "Harus ada huruf besar"),
  }}
>
  {(field) => (
    <Field label="Password" error={field.state.meta.errors[0]}>
      <input type="password" {...field} />
    </Field>
  )}
</form.Field>
```

### Async Validation

```typescript
<form.Field
  name="username"
  validators={{
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const response = await checkUsernameAvailability(value)
      if (!response.available) {
        return "Username sudah digunakan"
      }
      return undefined
    },
    onChangeAsyncDebounceMs: 500,
  }}
>
  {(field) => (
    <Field 
      label="Username" 
      error={field.state.meta.errors[0]}
      loading={field.state.meta.isValidating}
    >
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </Field>
  )}
</form.Field>
```

---

## Error Handling

### Display Field Errors

```typescript
<Field label="Nama" error={field.state.meta.errors[0]}>
  <input {...field} />
</Field>
```

### Display Multiple Errors

```typescript
<Field 
  label="Password" 
  error={field.state.meta.errors.join(", ")}
>
  <input type="password" {...field} />
</Field>
```

### Form-Level Errors

```typescript
const form = useForm({
  onSubmit: async ({ value }) => {
    try {
      await createEntity(value)
    } catch (error: any) {
      // Show toast error
      toast.error(error.message)
      
      // Or set form-level error
      form.setFieldMeta("_root", {
        errors: [error.message],
      })
    }
  },
})

// Display form error
{form.state.errors.length > 0 && (
  <div className="rounded bg-red-50 p-3 text-sm text-red-600">
    {form.state.errors[0]}
  </div>
)}
```

### Server Validation Errors

```typescript
const form = useForm({
  onSubmit: async ({ value }) => {
    try {
      await createEntity(value)
    } catch (error: any) {
      // Handle field-specific errors from API
      if (error.fields) {
        Object.entries(error.fields).forEach(([field, message]) => {
          form.setFieldMeta(field, {
            errors: [message as string],
          })
        })
      } else {
        toast.error(error.message)
      }
    }
  },
})
```

---

## Loading States

### Submit Button Loading

```typescript
<Button type="submit" disabled={form.state.isSubmitting}>
  {form.state.isSubmitting ? "Menyimpan..." : "Simpan"}
</Button>
```

### Disable All Fields During Submit

```typescript
<form.Field name="name">
  {(field) => (
    <input
      {...field}
      disabled={form.state.isSubmitting}
    />
  )}
</form.Field>
```

### Show Loading Spinner

```typescript
import { Loader2 } from "lucide-react"

<Button type="submit" disabled={form.state.isSubmitting}>
  {form.state.isSubmitting && (
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  )}
  Simpan
</Button>
```

---

## Edit Form Pattern

### Load Initial Data from Loader

```typescript
export const Route = createFileRoute("/_dashboard/mail/static-mail-templates/$id/edit")({
  component: EditStaticMailTemplate,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const data = await queryClient.ensureQueryData(
      staticMailTemplateDetailQueryOptions(id)
    )
    return { data }
  },
})

function EditStaticMailTemplate() {
  const { data } = Route.useLoaderData()
  const { id } = Route.useParams()

  const form = useForm({
    defaultValues: {
      name: data.name,
      code: data.code,
      department_id: data.department_id,
      is_active: data.is_active,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateStaticMailTemplate({ data: { id, ...value } })
        toast.success("Data berhasil diperbarui")
        navigate({ to: "/mail/static-mail-templates/$id", params: { id } })
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      {/* Fields */}
    </form>
  )
}
```

---

## Dynamic Field Arrays

### Basic Array Field

```typescript
<form.Field name="tags" mode="array">
  {(field) => (
    <div>
      <label>Tags</label>
      {field.state.value.map((_, index) => (
        <form.Field key={index} name={`tags[${index}]`}>
          {(subField) => (
            <div className="flex gap-2">
              <input
                value={subField.state.value}
                onChange={(e) => subField.handleChange(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => field.removeValue(index)}
              >
                Remove
              </Button>
            </div>
          )}
        </form.Field>
      ))}
      <Button
        type="button"
        onClick={() => field.pushValue("")}
      >
        Add Tag
      </Button>
    </div>
  )}
</form.Field>
```

---

## Form State Management

### Check if Form is Dirty

```typescript
const isDirty = form.state.isDirty

// Warn before leaving if form is dirty
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault()
      e.returnValue = ""
    }
  }
  window.addEventListener("beforeunload", handleBeforeUnload)
  return () => window.removeEventListener("beforeunload", handleBeforeUnload)
}, [isDirty])
```

### Reset Form

```typescript
<Button
  type="button"
  onClick={() => form.reset()}
>
  Reset
</Button>
```

### Manually Set Field Value

```typescript
// Set single field
form.setFieldValue("name", "New Value")

// Set multiple fields
form.setFieldValue("branch_id", "123")
form.setFieldValue("branch_label", "Cabang A")
```

---

## Best Practices

### 1. Use Blur Validation for Better UX

```typescript
// ✅ Good - validates on blur
validators={{ onBlur: schema.shape.email }}

// ❌ Avoid - validates on every keystroke
validators={{ onChange: schema.shape.email }}
```

### 2. Debounce Async Validation

```typescript
validators={{
  onChangeAsync: checkAvailability,
  onChangeAsyncDebounceMs: 500, // Wait 500ms after typing stops
}}
```

### 3. Disable Submit While Submitting

```typescript
<Button type="submit" disabled={form.state.isSubmitting}>
  Simpan
</Button>
```

### 4. Reset Page to 1 on Filter Change (Tables)

```typescript
navigate({
  search: (prev) => ({ ...prev, status: value, page: 1 }),
})
```

### 5. Show Success Toast and Navigate

```typescript
onSubmit: async ({ value }) => {
  await createEntity(value)
  toast.success("Data berhasil disimpan")
  navigate({ to: "/list" })
}
```

### 6. Handle Server Errors Gracefully

```typescript
try {
  await submitForm(value)
} catch (error: any) {
  if (error.fields) {
    // Handle field-specific errors
    Object.entries(error.fields).forEach(([field, msg]) => {
      form.setFieldMeta(field, { errors: [msg] })
    })
  } else {
    // Handle general errors
    toast.error(error.message || "Terjadi kesalahan")
  }
}
```

---

## Complete Form Example

```typescript
function CreateForm() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      is_active: true,
    },
    onSubmit: async ({ value }) => {
      try {
        await createEntity({ data: value })
        toast.success("Data berhasil dibuat")
        navigate({ to: "/list" })
      } catch (error: any) {
        toast.error(error.message)
      }
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{ onBlur: z.string().min(1, "Nama wajib diisi") }}
      >
        {(field) => (
          <Field label="Nama" error={field.state.meta.errors[0]}>
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{ onBlur: z.string().email("Email tidak valid") }}
      >
        {(field) => (
          <Field label="Email" error={field.state.meta.errors[0]}>
            <input
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="is_active">
        {(field) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked === true)}
            />
            <label>Aktif</label>
          </div>
        )}
      </form.Field>

      <div className="flex gap-2">
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/list" })}>
          Batal
        </Button>
      </div>
    </form>
  )
}
```

---

**End of FORM_PATTERNS.md**

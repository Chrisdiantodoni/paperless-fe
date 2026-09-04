# Table Implementation Guide

Complete guide for implementing paginated table pages with CRUD operations in paperless-admin.

---

## Table of Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Implementation Steps](#implementation-steps)
- [Step 1: Define Types](#step-1-define-types)
- [Step 2: Create Search Schema](#step-2-create-search-schema)
- [Step 3: Create Query Keys](#step-3-create-query-keys)
- [Step 4: Implement API Service](#step-4-implement-api-service)
- [Step 5: Create Server Functions](#step-5-create-server-functions)

---

## Overview

This guide walks through creating a complete table-based CRUD interface using:

- **TanStack Router** (file-based routing)
- **TanStack Query** (data fetching & caching)
- **TanStack Table** (table UI)
- **shadcn/ui** (UI components)
- **Zod** (validation)

**Example:** We'll use the **Static Mail Template** feature as a real-world reference.

---

## File Structure

```
apps/paperless-admin/src/
├── routes/_dashboard/mail/
│   ├── -column/
│   │   └── static-mail-column.tsx           # Column definitions
│   └── static-mail-templates/
│       ├── index.tsx                         # List page (table)
│       ├── create.tsx                        # Create form
│       └── $id/
│           ├── index.tsx                     # Detail view
│           └── edit.tsx                      # Edit form
├── hooks/queries/
│   └── use-static-mail-template.tsx          # Query hooks
├── keys/
│   └── staticMailTemplateKeys.ts             # Query key factory
├── schema/
│   ├── list.schema.ts                        # Search schema
│   └── master/
│       └── schema.ts                         # Form schema
├── server/
│   └── master.ts                             # Server functions
└── services/API/
    └── master.ts                             # API service class

packages/types/src/
└── master.ts                                  # TypeScript types
```

---

## Implementation Steps

### Quick Checklist

- [ ] **Step 1:** Define TypeScript types
- [ ] **Step 2:** Create search schema
- [ ] **Step 3:** Create query key factory
- [ ] **Step 4:** Implement API service methods
- [ ] **Step 5:** Create server functions
- [ ] **Step 6:** Create query hooks
- [ ] **Step 7:** Define table columns
- [ ] **Step 8:** Build list route component
- [ ] **Step 9:** Add pagination & filters
- [ ] **Step 10:** Implement CRUD operations

---

## Step 1: Define Types

### Location

`packages/types/src/master.ts` (or appropriate domain file)

### Define Entity Interface

```typescript
export interface StaticMailTemplate {
  id: string
  name: string
  code: string
  department: string
  branch: string | null
  position: string | null
  subject: string
  body: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Key Principles

- Use **PascalCase** for interface names
- Match **backend API structure** exactly
- Use `string | null` for nullable fields
- Include audit fields (`created_at`, `updated_at`)

### Export in Index

Add to `packages/types/src/index.ts`:

```typescript
export type { StaticMailTemplate } from "./master"
```

---

## Step 2: Create Search Schema

### Location

`apps/paperless-admin/src/schema/list.schema.ts`

### Define Search Schema

```typescript
import z from "zod"

export const staticMailTemplateSearchSchema = z.object({
  page: z.number().catch(1),
  search: z.string().catch(""),
  per_page: z.number().catch(10),
  branch_id: z.string().catch(""),
  branch_label: z.string().catch(""),
  department_id: z.string().catch(""),
  department_label: z.string().catch(""),
  position_id: z.string().catch(""),
  position_label: z.string().catch(""),
  is_active: z
    .preprocess(
      (val) => {
        if (val === "true" || val === true) return true
        if (val === "false" || val === false) return false
        return ""
      },
      z.union([z.boolean(), z.literal("")])
    )
    .catch(""),
})

export type StaticMailTemplateSearch = z.infer<typeof staticMailTemplateSearchSchema>
```

### Schema Patterns

#### Basic Pagination

```typescript
page: z.number().catch(1),
per_page: z.number().catch(10),
```

#### Text Search

```typescript
search: z.string().catch(""),
```

#### Enum Filter

```typescript
status: z.enum(["all", "active", "inactive"]).catch("all").optional(),
```

#### Boolean Filter (String or Boolean)

```typescript
is_active: z
  .preprocess(
    (val) => {
      if (val === "true" || val === true) return true
      if (val === "false" || val === false) return false
      return ""
    },
    z.union([z.boolean(), z.literal("")])
  )
  .catch(""),
```

#### Combobox Filters (ID + Label Pattern)

```typescript
branch_id: z.string().catch(""),
branch_label: z.string().catch(""),
```

**Why ID + Label?**
- **ID**: Sent to API for filtering
- **Label**: Displayed in UI (avoids refetching for display)
- **Both in URL**: Maintains full state on page reload

---

## Step 3: Create Query Keys

### Location

`apps/paperless-admin/src/keys/staticMailTemplateKeys.ts`

### Implement Query Key Factory

```typescript
import type { StaticMailTemplateSearch } from "@/schema/list.schema"

export const staticMailTemplateKeys = {
  all: ["static-mail-templates"] as const,
  lists: () => [...staticMailTemplateKeys.all, "list"] as const,
  list: (search?: StaticMailTemplateSearch) => {
    return [...staticMailTemplateKeys.lists(), search] as const
  },
  details: () => [...staticMailTemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...staticMailTemplateKeys.details(), id] as const,
}
```

### Key Hierarchy

```
["static-mail-templates"]                                    // all
["static-mail-templates", "list"]                           // lists()
["static-mail-templates", "list", { page: 1, search: "" }] // list(search)
["static-mail-templates", "detail"]                         // details()
["static-mail-templates", "detail", "abc123"]              // detail(id)
```

### Pattern Consistency

**Always include:**
- `all` - Root key for entity
- `lists()` - All list queries
- `list(params)` - Specific list query with params
- `details()` - All detail queries
- `detail(id)` - Specific detail query

---

## Step 4: Implement API Service

### Location

`apps/paperless-admin/src/services/API/master.ts`

### Add Service Methods

```typescript
import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import type { StaticMailTemplate } from "@workspace/types/master"
import { api } from "../api"

class MasterService {
  // GET all (with pagination & filters)
  async getStaticMailTemplates(
    params?: Record<string, string | number | undefined | boolean>
  ): Promise<APIResponse<LaravelPaginationData<StaticMailTemplate[]>>> {
    const res = await api.get("/mail/static/static-mail-templates", { params })
    return res.data
  }

  // GET by ID
  async getStaticMailTemplateById(
    id: string
  ): Promise<APIResponse<StaticMailTemplate>> {
    const res = await api.get(`/mail/static/static-mail-templates/${id}`)
    return res.data
  }

  // POST (create)
  async createStaticMailTemplate(data: any): Promise<APIResponse<any>> {
    const res = await api.post("/mail/static/static-mail-templates", data)
    return res.data
  }

  // PUT (update)
  async updateStaticMailTemplate(
    id: string,
    data: any
  ): Promise<APIResponse<any>> {
    const res = await api.put(`/mail/static/static-mail-templates/${id}`, data)
    return res.data
  }

  // DELETE
  async deleteStaticMailTemplate(id: string): Promise<APIResponse<any>> {
    const res = await api.delete(`/mail/static/static-mail-templates/${id}`)
    return res.data
  }
}

export default new MasterService()
```

### Method Patterns

#### List Method (GET with params)

```typescript
async get[EntityPlural](
  params?: Record<string, string | number | undefined | boolean>
): Promise<APIResponse<LaravelPaginationData<Entity[]>>>
```

#### Detail Method (GET by ID)

```typescript
async get[Entity]ById(id: string): Promise<APIResponse<Entity>>
```

#### Create Method (POST)

```typescript
async create[Entity](data: any): Promise<APIResponse<any>>
```

#### Update Method (PUT)

```typescript
async update[Entity](id: string, data: any): Promise<APIResponse<any>>
```

#### Delete Method (DELETE)

```typescript
async delete[Entity](id: string): Promise<APIResponse<any>>
```

---

## Step 5: Create Server Functions

### Location

`apps/paperless-admin/src/server/master.ts`

### Implement Server Functions

```typescript
import { createServerFn } from "@tanstack/react-start"
import { handleApiError } from "@/lib/handle-api-error"
import { staticMailTemplateSearchSchema } from "@/schema/list.schema"
import master from "@/services/API/master"
import z from "zod"

// GET all
export const getStaticMailTemplates = createServerFn({ method: "GET" })
  .validator(staticMailTemplateSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaticMailTemplates(data)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

// GET by ID
export const getStaticMailTemplateById = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaticMailTemplateById(data.id)
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })

// DELETE
export const deleteStaticMailTemplate = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    try {
      const response = await master.deleteStaticMailTemplate(data.id)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })
```

### Server Function Patterns

**For GET (loaders):**
- Use `handleApiError(error)` for redirect on 401/403

**For mutations (create/update/delete):**
- Use `throw new Error(error.message)` for error toast

---

**⚠️ PART 1 ENDS HERE (298 lines) - PART 2 CONTINUES WITH REMAINING STEPS**

## Step 6: Create Query Hooks

### Location

`apps/paperless-admin/src/hooks/queries/use-static-mail-template.tsx`

### Implement Query Hooks

```typescript
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { staticMailTemplateKeys } from "@/keys/staticMailTemplateKeys"
import type { StaticMailTemplateSearch } from "@/schema/list.schema"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { StaticMailTemplate } from "@workspace/types/master"
import {
  deleteStaticMailTemplate,
  getStaticMailTemplates,
} from "@/server/master"
import { toast } from "sonner"

// Query options factory
export const staticMailTemplateQueryOptions = (
  search: StaticMailTemplateSearch,
  initialData?: LaravelPaginationData<StaticMailTemplate[]>
) =>
  queryOptions({
    queryKey: staticMailTemplateKeys.list(search),
    queryFn: () => getStaticMailTemplates({ data: search }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    initialData,
  })

// List query hook
export function useStaticMailTemplate(
  search: StaticMailTemplateSearch,
  initialData?: LaravelPaginationData<StaticMailTemplate[]>
) {
  return useSuspenseQuery(staticMailTemplateQueryOptions(search, initialData))
}

// Delete mutation hook
export function useDeleteStaticMailMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteStaticMailTemplate({ data: id })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staticMailTemplateKeys.lists(),
        exact: false,
      })
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan saat menghapus data")
    },
  })
}
```

---

## Step 7: Define Table Columns

### Location

`apps/paperless-admin/src/routes/_dashboard/mail/-column/static-mail-column.tsx`

### Create Column Definitions

```typescript
import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { StaticMailTemplate } from "@workspace/types/master"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Eye, Pencil, Trash } from "lucide-react"
import { useConfirm } from "@workspace/ui/components/ui/confirm-dialog"
import { toast } from "sonner"
import { useDeleteStaticMailMutation } from "@/hooks/queries/use-static-mail-template"

// Extend type with pagination metadata
export type StaticMailTemplateRow = StaticMailTemplate & {
  current_page: number
  per_page: number
}

// Action cell component
export function ActionCell({ rowData }: { rowData: StaticMailTemplateRow }) {
  const confirm = useConfirm()
  const { mutateAsync: deleteStaticMailTemplate } =
    useDeleteStaticMailMutation()

  const handleDelete = async () => {
    await confirm({
      title: "Hapus Template",
      variant: "destructive",
      confirmLabel: "Hapus",
      onConfirm: async () => {
        await deleteStaticMailTemplate(rowData.id)
        toast.success("Template dihapus")
      },
    })
  }

  return (
    <div className="flex flex-row gap-1">
      <Button asChild variant="ghost" size="sm">
        <Link to="/mail/static-mail-templates/$id" params={{ id: rowData.id }}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>

      <Button asChild variant="ghost" size="sm">
        <Link
          to="/mail/static-mail-templates/$id/edit"
          params={{ id: rowData.id }}
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>

      <Button variant="ghost" size="sm" onClick={handleDelete}>
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}

// Column definitions
export const columns: ColumnDef<StaticMailTemplateRow>[] = [
  {
    accessorKey: "no",
    header: "No.",
    cell: ({ row }) => {
      return (
        (row.original.current_page - 1) * row.original.per_page +
        (row.index + 1)
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => row.original.code,
  },
  {
    accessorKey: "department",
    header: "Kategori / Dept",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusLabel = row.original.is_active ? "Aktif" : "Tidak Aktif"
      return (
        <Badge
          variant={row.original.is_active ? "secondary" : "destructive"}
          className="rounded-md"
        >
          {statusLabel}
        </Badge>
      )
    },
  },
  {
    accessorKey: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionCell rowData={row.original} />,
  },
]
```

### Column Patterns

#### Row Number Column

```typescript
{
  accessorKey: "no",
  header: "No.",
  cell: ({ row }) => {
    return (
      (row.original.current_page - 1) * row.original.per_page +
      (row.index + 1)
    )
  },
}
```

#### Badge Column (Status)

```typescript
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const label = row.original.is_active ? "Aktif" : "Tidak Aktif"
    return (
      <Badge variant={row.original.is_active ? "secondary" : "destructive"}>
        {label}
      </Badge>
    )
  },
}
```

#### Actions Column

```typescript
{
  accessorKey: "actions",
  header: "Aksi",
  cell: ({ row }) => <ActionCell rowData={row.original} />,
}
```

---

## Step 8: Build List Route Component

### Location

`apps/paperless-admin/src/routes/_dashboard/mail/static-mail-templates/index.tsx`

### Create Route Definition

```typescript
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { staticMailTemplateSearchSchema } from "@/schema/list.schema"
import { staticMailTemplateQueryOptions } from "@/hooks/queries/use-static-mail-template"

export const Route = createFileRoute("/_dashboard/mail/static-mail-templates/")(
  {
    component: RouteComponent,
    validateSearch: zodValidator(staticMailTemplateSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient }, deps: search }) => {
      const data = await queryClient.ensureQueryData(
        staticMailTemplateQueryOptions(search)
      )
      return { data }
    },
  }
)
```

### Key Route Features

- **`validateSearch`**: Validates URL search params with Zod
- **`loaderDeps`**: Triggers loader when search changes
- **`loader`**: Prefetches data server-side
- **`ensureQueryData`**: Fetches if not cached, returns if cached

---

## Step 9: Implement Component with Filters

### Basic Component Structure

```typescript
function RouteComponent() {
  const navigate = Route.useNavigate()
  const { data: initialData } = Route.useLoaderData()
  const search = Route.useSearch()
  const { search: searchQuery, is_active } = search

  const { data, isFetching } = useStaticMailTemplate(search, initialData)

  const rows = useMemo(
    () =>
      data.data.map(
        (d): StaticMailTemplateRow => ({
          ...d,
          current_page: data.current_page,
          per_page: data.per_page,
        })
      ),
    [data]
  )

  return (
    <div className="container mx-auto space-y-4 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-normal tracking-tight">
          List Template Statis
        </h1>
        <Button asChild size="sm">
          <Link to="/mail/static-mail-templates/create">
            <Plus className="h-4 w-4" />
            Tambah Template
          </Link>
        </Button>
      </div>

      {/* Filters - see next section */}

      {/* Table */}
      <div className="border">
        <DataTable columns={columns} data={rows} isFetching={isFetching} />
      </div>

      {/* Pagination */}
      <DataTablePagination
        currentPage={data.current_page}
        lastPage={data.last_page}
        total={data.total}
        isFetching={isFetching}
        onPageChange={(page) =>
          navigate({ search: (prev) => ({ ...prev, page }) })
        }
      />
    </div>
  )
}
```

### Add Search Input

```typescript
import { SearchInput } from "@/components/search-input"

<SearchInput
  placeholder="Search template..."
  value={searchQuery}
  onChange={(q) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: q,
        page: 1, // Reset to page 1 on search
      }),
    })
  }}
/>
```

### Add Status Select Filter

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

<Select
  value={
    is_active === true
      ? "true"
      : is_active === false
        ? "false"
        : "all"
  }
  onValueChange={(value) => {
    navigate({
      search: (prev) => ({
        ...prev,
        is_active: value,
        page: 1,
      }),
    })
  }}
>
  <SelectTrigger className="w-full sm:w-[150px]">
    <SelectValue placeholder="Status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Semua Status</SelectItem>
    <SelectItem value="true">Aktif</SelectItem>
    <SelectItem value="false">Tidak Aktif</SelectItem>
  </SelectContent>
</Select>
```

---

## Step 10: Best Practices

### 1. Always Reset Page on Filter Change

```typescript
navigate({
  search: (prev) => ({
    ...prev,
    [filterKey]: value,
    page: 1, // ← Reset to first page
  }),
})
```

### 2. Use Memoization for Row Data

```typescript
const rows = useMemo(
  () =>
    data.data.map((d) => ({
      ...d,
      current_page: data.current_page,
      per_page: data.per_page,
    })),
  [data]
)
```

### 3. Handle Loading States

```typescript
<DataTable columns={columns} data={rows} isFetching={isFetching} />
```

### 4. Sync State with URL Params

For combobox values that need label display:

```typescript
const [branchValue, setBranchValue] = useState<ComboboxValue>({
  value: branch_id,
  label: branch_label,
})

useEffect(() => {
  setBranchValue({ value: branch_id, label: branch_label })
}, [branch_id, branch_label])
```

### 5. Confirm Before Delete

```typescript
const handleDelete = async () => {
  await confirm({
    title: "Hapus Template",
    variant: "destructive",
    confirmLabel: "Hapus",
    onConfirm: async () => {
      await deleteEntity(id)
      toast.success("Data dihapus")
    },
  })
}
```

---

## Complete Implementation Checklist

- [ ] TypeScript interface in `packages/types`
- [ ] Search schema in `schema/list.schema.ts`
- [ ] Query key factory in `keys/[entity]Keys.ts`
- [ ] API service methods in `services/API/[domain].ts`
- [ ] Server functions in `server/[domain].ts`
- [ ] Query hooks in `hooks/queries/use-[entity].tsx`
- [ ] Column definitions in `routes/.../−column/[entity]-column.tsx`
- [ ] List route with loader in `routes/.../[entity]/index.tsx`
- [ ] Search input implemented
- [ ] Filter components added
- [ ] Pagination working
- [ ] Delete confirmation dialog
- [ ] Success/error toasts
- [ ] Run `pnpm lint && pnpm typecheck`

---

**End of TABLE_IMPLEMENTATION.md**

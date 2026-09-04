# Naming Conventions

This document defines standardized naming rules for the paperless monorepo project to ensure consistency and maintainability across the codebase.

---

## Table of Contents

- [File Naming](#file-naming)
- [Route Structure](#route-structure)
- [TypeScript Naming](#typescript-naming)
- [Function Naming](#function-naming)
- [Component Naming](#component-naming)
- [Query Keys](#query-keys)
- [Variables](#variables)

---

## File Naming

### Route Files

```
kebab-case for directories and files
```

**Examples:**
```
✅ static-mail-templates/
✅ dynamic-mail-templates/
✅ create.tsx
✅ edit.tsx
✅ index.tsx
❌ StaticMailTemplates/
❌ CreateTemplate.tsx
```

### Column Definition Files

**Pattern:** `[entity]-column.tsx`

```
✅ static-mail-column.tsx
✅ dynamic-mail-column.tsx
✅ department-column.tsx
❌ StaticMailColumn.tsx
❌ columns.tsx (too generic)
```

### Hook Files

**Pattern:** `use-[entity].tsx` or `use-[entity].ts`

```
✅ use-static-mail-template.tsx
✅ use-departments.ts
✅ use-branch.tsx
❌ useStaticMailTemplate.tsx
❌ static-mail-hooks.tsx
```

### Query Key Files

**Pattern:** `[entity]Keys.ts`

```
✅ staticMailTemplateKeys.ts
✅ departmentKeys.ts
✅ branchKeys.ts
❌ static-mail-template-keys.ts
❌ KEYS.ts
```

### Schema Files

**Pattern:** `[domain]/schema.ts` or `[purpose].schema.ts`

```
✅ master/schema.ts
✅ list.schema.ts
✅ auth.schema.ts
❌ masterSchema.ts
❌ schemas.ts
```

### Server Function Files

**Pattern:** `[domain].ts`

```
✅ master.ts
✅ auth.ts
✅ utilities.ts
❌ masterServer.ts
❌ server-functions.ts
```

---

## Route Structure

### Private Route Segments

Use `-` prefix for route segments that shouldn't appear in URL:

```
routes/
  _dashboard/
    mail/
      -column/              ← Private route (not in URL)
        static-mail-column.tsx
      static-mail-templates/
        index.tsx
```

### Dynamic Routes

Use `$` prefix for dynamic parameters:

```
✅ $id/
✅ $slug/
❌ [id]/
❌ :id/
```

### Layout Routes

Use `_` prefix for layout routes:

```
✅ _dashboard.tsx
✅ _auth.tsx
❌ dashboard-layout.tsx
```

---

## TypeScript Naming

### Interfaces

**Pattern:** `PascalCase` with descriptive names

```typescript
✅ interface StaticMailTemplate { }
✅ interface LaravelPaginationData<T> { }
✅ interface APIResponse<T> { }
❌ interface staticMailTemplate { }
❌ interface IStaticMailTemplate { } (avoid I prefix)
```

### Types

**Pattern:** `PascalCase` for type aliases

```typescript
✅ type StaticMailTemplateSearch = z.infer<typeof staticMailTemplateSearchSchema>
✅ type StaticMailTemplateRow = StaticMailTemplate & { current_page: number }
❌ type staticMailTemplateSearch = ...
```

### Enums

**Pattern:** `PascalCase` for enum name, `UPPER_SNAKE_CASE` for values

```typescript
✅ enum MailStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
❌ enum mailStatus { }
❌ enum MailStatus { active = "active" }
```

### Zod Schemas

**Pattern:** `camelCase` ending with `Schema`

```typescript
✅ const staticMailTemplateSearchSchema = z.object({ })
✅ const departmentSearchSchema = z.object({ })
✅ const staticMailTemplateFormSchema = z.object({ })
❌ const StaticMailTemplateSearchSchema = ...
❌ const staticMailTemplateSearch = ...
```

---

## Function Naming

### React Query Hooks

**Pattern:** `use[Entity][Action]`

```typescript
✅ useStaticMailTemplate()
✅ useDeleteStaticMailMutation()
✅ useCreateDepartmentMutation()
❌ useGetStaticMailTemplate()
❌ staticMailTemplateQuery()
```

### Query Options Factory

**Pattern:** `[entity]QueryOptions`

```typescript
✅ staticMailTemplateQueryOptions()
✅ departmentQueryOptions()
❌ getStaticMailTemplateOptions()
❌ staticMailTemplateOptions()
```

### Server Functions

**Pattern:** `[verb][Entity]` using camelCase

```typescript
✅ getStaticMailTemplates()
✅ createStaticMailTemplate()
✅ updateStaticMailTemplate()
✅ deleteStaticMailTemplate()
❌ StaticMailTemplates()
❌ fetchStaticMailTemplates()
```

### API Service Methods

**Pattern:** Same as server functions

```typescript
class MasterService {
  ✅ async getStaticMailTemplates() { }
  ✅ async createStaticMailTemplate() { }
  ❌ async staticMailTemplates() { }
  ❌ async fetchStaticMailTemplates() { }
}
```

### Event Handlers

**Pattern:** `handle[Action]`

```typescript
✅ const handleDelete = () => { }
✅ const handleSubmit = () => { }
✅ const handlePageChange = () => { }
❌ const onDelete = () => { }
❌ const deleteHandler = () => { }
```

---

## Component Naming

### React Components

**Pattern:** `PascalCase`

```typescript
✅ function RouteComponent() { }
✅ function ActionCell() { }
✅ function DataTable() { }
❌ function routeComponent() { }
❌ function action_cell() { }
```

### Component Files

**Pattern:** `kebab-case.tsx`

```
✅ data-table.tsx
✅ search-input.tsx
✅ data-table-pagination.tsx
❌ DataTable.tsx
❌ SearchInput.tsx
```

---

## Query Keys

### Query Key Factory Pattern

**Pattern:** Hierarchical structure with const assertions

```typescript
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

**Usage:**
```typescript
✅ staticMailTemplateKeys.list(search)
✅ departmentKeys.detail(id)
✅ branchKeys.lists()
```

---

## Variables

### Search Parameters

**Pattern:** Snake case matching API parameters

```typescript
✅ const { search, is_active, department_id, branch_id } = search
❌ const { search, isActive, departmentId, branchId } = search
```

### State Variables

**Pattern:** Descriptive camelCase

```typescript
✅ const [branchValue, setBranchValue] = useState()
✅ const [isActiveValue, setIsActiveValue] = useState()
✅ const [isFetching, setIsFetching] = useState()
❌ const [branch, setBranch] = useState()
❌ const [active, setActive] = useState()
```

### Constants

**Pattern:** `UPPER_SNAKE_CASE` for true constants, `camelCase` for config

```typescript
✅ const DEVELOPMENT = process.env.NODE_ENV === "development"
✅ const PORT = 3000
✅ const baseUrl = import.meta.env.VITE_BASE_URL
❌ const development = ...
❌ const BASE_URL = ...
```

---

## Example Mapping

Here's a complete example showing consistent naming across the stack:

```
Entity: StaticMailTemplate

Files:
  ├── routes/_dashboard/mail/static-mail-templates/index.tsx
  ├── routes/_dashboard/mail/-column/static-mail-column.tsx
  ├── hooks/queries/use-static-mail-template.tsx
  ├── keys/staticMailTemplateKeys.ts
  ├── schema/list.schema.ts (staticMailTemplateSearchSchema)
  ├── schema/master/schema.ts (staticMailTemplateFormSchema)
  └── server/master.ts

TypeScript:
  interface StaticMailTemplate { }
  type StaticMailTemplateSearch = z.infer<...>
  type StaticMailTemplateRow = StaticMailTemplate & { ... }
  const staticMailTemplateSearchSchema = z.object({ })
  const staticMailTemplateFormSchema = z.object({ })

Functions:
  staticMailTemplateQueryOptions()
  useStaticMailTemplate()
  useDeleteStaticMailMutation()
  getStaticMailTemplates()
  createStaticMailTemplate()
  updateStaticMailTemplate()
  deleteStaticMailTemplate()

Query Keys:
  staticMailTemplateKeys.list(search)
  staticMailTemplateKeys.detail(id)
```

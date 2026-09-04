# React Query Patterns

This document covers React Query (TanStack Query) implementation patterns used in the paperless-admin application.

---

## Table of Contents

- [Query Key Factory Pattern](#query-key-factory-pattern)
- [Query Options Factory](#query-options-factory)
- [Query Hooks](#query-hooks)
- [Mutation Patterns](#mutation-patterns)
- [Cache Management](#cache-management)
- [Error Handling](#error-handling)

---

## Query Key Factory Pattern

### Overview

Query keys are organized in a hierarchical factory pattern for consistent cache management and invalidation.

### Implementation

**File Location:** `apps/paperless-admin/src/keys/[entity]Keys.ts`

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
["static-mail-templates", "detail", "123"]                  // detail(id)
```

### Benefits

- **Consistent structure** across all entities
- **Easy invalidation** at any level
- **Type-safe** with const assertions
- **Hierarchical** for granular cache control

### Usage Examples

```typescript
// Invalidate all static mail template queries
queryClient.invalidateQueries({
  queryKey: staticMailTemplateKeys.all,
})

// Invalidate all list queries (keeps detail queries)
queryClient.invalidateQueries({
  queryKey: staticMailTemplateKeys.lists(),
  exact: false,
})

// Invalidate specific list query
queryClient.invalidateQueries({
  queryKey: staticMailTemplateKeys.list({ page: 1, search: "test" }),
})

// Invalidate specific detail query
queryClient.invalidateQueries({
  queryKey: staticMailTemplateKeys.detail("123"),
})
```

---

## Query Options Factory

### Overview

Query options factories centralize query configuration for reuse across loaders and components.

### Implementation

**File Location:** `apps/paperless-admin/src/hooks/queries/use-[entity].tsx`

```typescript
import {
  keepPreviousData,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { staticMailTemplateKeys } from "@/keys/staticMailTemplateKeys"
import type { StaticMailTemplateSearch } from "@/schema/list.schema"
import type { LaravelPaginationData } from "@workspace/types/api"
import type { StaticMailTemplate } from "@workspace/types/master"
import { getStaticMailTemplates } from "@/server/master"

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
```

### Key Features

- **`queryKey`**: Uses key factory for consistency
- **`queryFn`**: Calls server function (not API service directly)
- **`placeholderData: keepPreviousData`**: Prevents UI flicker during pagination
- **`staleTime: 30_000`**: Cache for 30 seconds before refetch
- **`initialData`**: Accepts loader data for SSR

### Usage in Route Loader

```typescript
export const Route = createFileRoute("/_dashboard/mail/static-mail-templates/")(
  {
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

### Usage in Component

```typescript
function RouteComponent() {
  const { data: initialData } = Route.useLoaderData()
  const search = Route.useSearch()
  
  const { data, isFetching } = useStaticMailTemplate(search, initialData)
  
  // ...
}
```

---

## Query Hooks

### List Query Hook

**Pattern:** `use[Entity]()`

```typescript
export function useStaticMailTemplate(
  search: StaticMailTemplateSearch,
  initialData?: LaravelPaginationData<StaticMailTemplate[]>
) {
  return useSuspenseQuery(staticMailTemplateQueryOptions(search, initialData))
}
```

### Detail Query Hook

```typescript
export function useStaticMailTemplateDetail(
  id: string,
  initialData?: StaticMailTemplate
) {
  return useSuspenseQuery({
    queryKey: staticMailTemplateKeys.detail(id),
    queryFn: () => getStaticMailTemplateById({ data: id }),
    staleTime: 60_000,
    initialData,
  })
}
```

### Why `useSuspenseQuery`?

- Works with TanStack Router's loader pattern
- Handles loading states at route boundary
- Prevents "loading" state in component
- Throws errors to error boundaries

---

## Mutation Patterns

### Delete Mutation

```typescript
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

### Create Mutation

```typescript
export function useCreateStaticMailMutation() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()
  
  return useMutation({
    mutationFn: async (data: StaticMailTemplateFormSchema) => {
      const response = await createStaticMailTemplate({ data })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staticMailTemplateKeys.lists(),
        exact: false,
      })
      toast.success("Template berhasil dibuat")
      navigate({ to: "/mail/static-mail-templates" })
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat template")
    },
  })
}
```

### Update Mutation

```typescript
export function useUpdateStaticMailMutation() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StaticMailTemplateFormSchema }) => {
      const response = await updateStaticMailTemplate({ data: { id, ...data } })
      return response
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and specific detail
      queryClient.invalidateQueries({
        queryKey: staticMailTemplateKeys.lists(),
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: staticMailTemplateKeys.detail(variables.id),
      })
      toast.success("Template berhasil diperbarui")
      navigate({ to: "/mail/static-mail-templates/$id", params: { id: variables.id } })
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui template")
    },
  })
}
```

---

## Cache Management

### Invalidation Strategies

#### 1. Invalidate All Lists (Keep Details)

```typescript
queryClient.invalidateQueries({
  queryKey: staticMailTemplateKeys.lists(),
  exact: false,
})
```

Use after: Create, Update, Delete

#### 2. Invalidate Specific Detail

```typescript
queryClient.invalidateQueries({
  queryKey: staticMailTemplateKeys.detail(id),
})
```

Use after: Update

#### 3. Invalidate Everything

```typescript
queryClient.invalidateQueries({
  queryKey: staticMailTemplateKeys.all,
})
```

Use rarely: Only when cache corruption suspected

### Optimistic Updates

```typescript
export function useUpdateStaticMailMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateStaticMailTemplate,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: staticMailTemplateKeys.detail(variables.id),
      })
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(
        staticMailTemplateKeys.detail(variables.id)
      )
      
      // Optimistically update
      queryClient.setQueryData(
        staticMailTemplateKeys.detail(variables.id),
        variables.data
      )
      
      return { previous }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          staticMailTemplateKeys.detail(variables.id),
          context.previous
        )
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: staticMailTemplateKeys.detail(variables.id),
      })
    },
  })
}
```

---

## Error Handling

### Server Function Errors

Server functions throw errors that are caught by TanStack Router's error boundaries:

```typescript
export const getStaticMailTemplates = createServerFn({ method: "GET" })
  .validator(staticMailTemplateSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaticMailTemplates(data)
      return response.data
    } catch (error: any) {
      handleApiError(error) // Throws redirect or rethrows
    }
  })
```

### Mutation Error Handling

```typescript
const { mutateAsync } = useDeleteStaticMailMutation()

const handleDelete = async () => {
  await confirm({
    title: "Hapus Template",
    variant: "destructive",
    confirmLabel: "Hapus",
    onConfirm: async () => {
      try {
        await mutateAsync(rowData.id)
        toast.success("Template dihapus")
      } catch (error: any) {
        // Error already handled in mutation's onError
        // Additional handling here if needed
      }
    },
  })
}
```

### Component-Level Error Handling

```typescript
function RouteComponent() {
  const { data, error, isFetching } = useStaticMailTemplate(search)
  
  if (error) {
    return <ErrorDisplay message={error.message} />
  }
  
  // Render data
}
```

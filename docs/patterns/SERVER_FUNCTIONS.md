# Server Functions Pattern

This document covers TanStack Start server function patterns used in the paperless-admin application.

---

## Table of Contents

- [Overview](#overview)
- [Basic Pattern](#basic-pattern)
- [Validation Integration](#validation-integration)
- [Error Handling](#error-handling)
- [API Service Integration](#api-service-integration)
- [Authentication](#authentication)
- [Type Safety](#type-safety)

---

## Overview

Server functions (`createServerFn`) provide type-safe, server-side operations that can be called from client components and route loaders. They handle:

- **Server-side data fetching**
- **Request validation** (Zod schemas)
- **Error handling** and redirects
- **Session management**
- **API service orchestration**

---

## Basic Pattern

### File Location

`apps/paperless-admin/src/server/[domain].ts`

### Simple GET Request

```typescript
import { createServerFn } from "@tanstack/react-start"
import master from "@/services/API/master"
import { handleApiError } from "@/lib/handle-api-error"

export const getArea = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const response = await master.getArea()
      return response.data
    } catch (error: any) {
      handleApiError(error)
    }
  })
```

### Key Components

1. **`createServerFn({ method: "GET" })`** - Defines HTTP method
2. **`.handler(async () => { })`** - Handler function
3. **API service call** - `await master.getArea()`
4. **Return data** - `return response.data`
5. **Error handling** - `handleApiError(error)`

---

## Validation Integration

### With Zod Schema Validator

```typescript
import { staticMailTemplateSearchSchema } from "@/schema/list.schema"

export const getStaticMailTemplates = createServerFn({ method: "GET" })
  .validator(staticMailTemplateSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaticMailTemplates(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })
```

### Validator Flow

1. **Client calls** server function with parameters
2. **Zod validates** input against schema
3. **Validation passes** → handler receives `{ data }` (typed!)
4. **Validation fails** → throws validation error (caught by router)

### Type Safety with Validator

```typescript
// Schema definition
export const staticMailTemplateSearchSchema = z.object({
  page: z.number().catch(1),
  search: z.string().catch(""),
  per_page: z.number().catch(10),
  branch_id: z.string().catch(""),
})

// Server function automatically types 'data' parameter
.handler(async ({ data }) => {
  // data is typed as:
  // {
  //   page: number
  //   search: string
  //   per_page: number
  //   branch_id: string
  // }
})
```

---

## Error Handling

### `handleApiError` Utility

**File:** `apps/paperless-admin/src/lib/handle-api-error.ts`

```typescript
import { clearSessionCookie } from "@/server/session.server"
import { redirect } from "@tanstack/react-router"

type ApiErrorShape = {
  status?: number
  code?: string
  message?: string
  redirectTo?: string | null
  originalError?: unknown
}

export function handleApiError(err: unknown): never {
  const apiErr = err as ApiErrorShape

  if (apiErr?.redirectTo) {
    clearSessionCookie()
    throw redirect({ href: apiErr.redirectTo })
  }

  throw err
}
```

### Error Handling Strategy

```typescript
export const getStaticMailTemplates = createServerFn({ method: "GET" })
  .validator(staticMailTemplateSearchSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.getStaticMailTemplates(data)
      return response.data
    } catch (error: any) {
      // Option 1: Use handleApiError for redirect on 401/403
      handleApiError(error)
      
      // Option 2: Throw generic error (for mutation errors)
      // throw new Error(error.message)
    }
  })
```

### When to Use Each Pattern

| Pattern | Use Case |
|---------|----------|
| `handleApiError(error)` | GET requests in loaders (redirect on auth failure) |
| `throw new Error(error.message)` | Mutations (show error toast, no redirect) |

---

## API Service Integration

### API Service Layer

**File:** `apps/paperless-admin/src/services/API/master.ts`

```typescript
import type { APIResponse, LaravelPaginationData } from "@workspace/types/api"
import type { StaticMailTemplate } from "@workspace/types/master"
import { api } from "../api"

class MasterService {
  async getStaticMailTemplates(
    params?: Record<string, string | number | undefined | boolean>
  ): Promise<APIResponse<LaravelPaginationData<StaticMailTemplate[]>>> {
    const res = await api.get("/mail/static/static-mail-templates", { params })
    return res.data
  }

  async getStaticMailTemplateById(
    id: string
  ): Promise<APIResponse<StaticMailTemplate>> {
    const res = await api.get(`/mail/static/static-mail-templates/${id}`)
    return res.data
  }

  async createStaticMailTemplate(data: any): Promise<APIResponse<any>> {
    const res = await api.post("/mail/static/static-mail-templates", data)
    return res.data
  }

  async updateStaticMailTemplate(
    id: string,
    data: any
  ): Promise<APIResponse<any>> {
    const res = await api.put(`/mail/static/static-mail-templates/${id}`, data)
    return res.data
  }

  async deleteStaticMailTemplate(id: string): Promise<APIResponse<any>> {
    const res = await api.delete(`/mail/static/static-mail-templates/${id}`)
    return res.data
  }
}

export default new MasterService()
```

### Server Function → API Service Flow

```
Client Component
  ↓ calls
Server Function (createServerFn)
  ↓ validates with Zod
  ↓ calls
API Service Class
  ↓ calls
Axios Instance (with interceptors)
  ↓ HTTP request
External API
```

---

## Authentication

### Session Token Pattern

**File:** `apps/paperless-admin/src/server/session.ts`

```typescript
export async function readSessionToken(): Promise<string | null> {
  // Read session cookie server-side
  // Implementation depends on session storage
}
```

**File:** `apps/paperless-admin/src/services/api.ts`

```typescript
import { readSessionToken } from "@/server/session"
import { setupApi } from "@workspace/api-client"

const baseUrl = import.meta.env.VITE_BASE_URL || "/api"
const portalUrl = import.meta.env.VITE_PORTAL_URL || ""

export const api = setupApi(
  baseUrl,
  portalUrl,
  async () => await readSessionToken()
)
```

### How Authentication Works

1. **Client makes request** to server function
2. **Server function runs** on server with access to cookies
3. **`readSessionToken()`** reads session cookie
4. **Axios interceptor** adds token to Authorization header
5. **API request** includes authentication
6. **Response** returns to server function
7. **Data** passed back to client

---

## Type Safety

### Full Type Flow Example

```typescript
// 1. Define type in packages/types
export interface StaticMailTemplate {
  id: string
  name: string
  code: string
  is_active: boolean
}

// 2. Define search schema
export const staticMailTemplateSearchSchema = z.object({
  page: z.number().catch(1),
  search: z.string().catch(""),
})

export type StaticMailTemplateSearch = z.infer<typeof staticMailTemplateSearchSchema>

// 3. Type API service method
class MasterService {
  async getStaticMailTemplates(
    params?: StaticMailTemplateSearch
  ): Promise<APIResponse<LaravelPaginationData<StaticMailTemplate[]>>> {
    const res = await api.get("/mail/static/static-mail-templates", { params })
    return res.data
  }
}

// 4. Type server function (automatic via validator)
export const getStaticMailTemplates = createServerFn({ method: "GET" })
  .validator(staticMailTemplateSearchSchema)
  .handler(async ({ data }) => {
    // 'data' is typed as StaticMailTemplateSearch
    const response = await master.getStaticMailTemplates(data)
    // response.data is typed as LaravelPaginationData<StaticMailTemplate[]>
    return response.data
  })

// 5. Type in component (automatic via inference)
const { data } = useStaticMailTemplate(search)
// 'data' is typed as LaravelPaginationData<StaticMailTemplate[]>
```

### Benefits

- **End-to-end type safety** from API to component
- **Compile-time errors** if types mismatch
- **IntelliSense** throughout the stack
- **Refactoring safety** - rename propagates everywhere

---

## Complete CRUD Example

```typescript
// GET all (with search)
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

// POST (create)
export const createStaticMailTemplate = createServerFn({ method: "POST" })
  .validator(staticMailTemplateFormSchema)
  .handler(async ({ data }) => {
    try {
      const response = await master.createStaticMailTemplate(data)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  })

// PUT (update)
export const updateStaticMailTemplate = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
  }).merge(staticMailTemplateFormSchema))
  .handler(async ({ data }) => {
    try {
      const { id, ...payload } = data
      const response = await master.updateStaticMailTemplate(id, payload)
      return response.data
    } catch (error: any) {
      throw new Error(error.message)
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

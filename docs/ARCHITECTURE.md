# Architecture Overview

High-level architecture documentation for the paperless monorepo project.

---

## Table of Contents

- [Monorepo Structure](#monorepo-structure)
- [Application Boundaries](#application-boundaries)
- [Package Responsibilities](#package-responsibilities)
- [Data Flow](#data-flow)
- [Authentication Flow](#authentication-flow)
- [Route Organization](#route-organization)
- [State Management](#state-management)

---

## Monorepo Structure

```
paperless/
├── apps/
│   ├── paperless-admin/        # Admin portal (custom Express SSR)
│   └── paperless-user/         # User portal (standard TanStack Start)
├── packages/
│   ├── ui/                     # Shared UI components (shadcn/ui)
│   ├── api-client/             # Axios wrapper with interceptors
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # Utility functions
│   └── forms/                  # Shared form components
├── docs/                       # Documentation
│   ├── patterns/               # Implementation patterns
│   ├── PRD_TEMPLATE.md         # Product requirements template
│   └── ARCHITECTURE.md         # This file
├── turbo.json                  # Turborepo pipeline config
├── package.json                # Root workspace config
└── pnpm-workspace.yaml         # pnpm workspace definition
```

### Technology Stack

- **Build Tool:** Turborepo 2.9.15
- **Package Manager:** pnpm 10.33.4
- **Runtime:** Node.js >=20
- **Language:** TypeScript 6
- **Framework:** TanStack Start (React 19, SSR)
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query (React Query)
- **Tables:** TanStack Table
- **Forms:** TanStack Form + Zod
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (radix-nova style)
- **Icons:** Phosphor Icons
- **Rich Text:** TipTap Editor

---

## Application Boundaries

### paperless-admin

**Purpose:** Administrative portal with SSO authentication

**Port:** 3000

**Features:**
- Custom Express SSR server (`server.ts` in root directory)
- Vite middleware in development
- SSO authentication via `createServerFn`
- Session stored in `__Host-session` HttpOnly cookie
- Full CRUD operations for master data
- Mail template management (static & dynamic)
- User and role management

**Dev Server:**
- `pnpm dev` - Standard Vite dev server
- `pnpm start` - Custom Express SSR dev via `tsx server.ts`

**Build:**
- Outputs to `dist/server/server.js` for production
- Serves via Express in production

### paperless-user

**Purpose:** End-user portal

**Port:** 3001

**Features:**
- Standard TanStack Start application
- No custom server logic
- Simpler architecture than admin
- User-facing features

**Dev Server:**
- `pnpm dev` - Standard Vite dev server (port 3001)

---

## Package Responsibilities

### @workspace/ui

**Purpose:** Shared UI component library

**Contents:**
- shadcn/ui components (radix-nova style)
- TipTap rich text editor
- Data table components
- Form field components
- Global CSS (`globals.css`)

**Exports:**
```typescript
"@workspace/ui/globals.css"    // Global styles
"@workspace/ui/components/*"   // UI components
"@workspace/ui/hooks/*"        // React hooks
"@workspace/ui/lib/*"          // Utilities (cn, etc.)
```

**CSS Import Pattern:**
```typescript
import "@workspace/ui/globals.css?url"
```

### @workspace/api-client

**Purpose:** Axios wrapper with authentication and error handling

**Features:**
- Axios instance with interceptors
- Automatic token injection from cookies (server) or `js-cookie` (client)
- 401/403/503 redirect handling
- Base URL configuration from environment variables

**Setup:**
```typescript
import { setupApi } from "@workspace/api-client"

const api = setupApi(
  baseUrl,          // VITE_BASE_URL
  portalUrl,        // VITE_PORTAL_URL
  getTokenFn        // async () => token
)
```

### @workspace/types

**Purpose:** Shared TypeScript types

**Contents:**
- Entity interfaces (User, Department, Branch, etc.)
- API response types (`APIResponse`, `LaravelPaginationData`)
- Utility types (`SelectValue`, etc.)

**Structure:**
```
packages/types/src/
├── index.ts          # Main exports
├── api.ts            # API response types
├── master.ts         # Master data types
├── mail.ts           # Mail template types
├── user.type.ts      # User types
└── utilities.ts      # Utility types
```

### @workspace/utils

**Purpose:** Shared utility functions

**Examples:**
- `formatCurrency()` - Format numbers as currency
- `formatDate()` - Date formatting utilities
- String manipulation helpers
- Validation helpers

### @workspace/forms

**Purpose:** Shared form components and utilities

**Contents:**
- Reusable form field components
- Form layout components
- TanStack Form integrations

---

## Data Flow

### Complete Request Flow

```
┌─────────────┐
│   Client    │
│  Component  │
└──────┬──────┘
       │ 1. Call query hook
       ↓
┌─────────────┐
│ Query Hook  │ useStaticMailTemplate()
│ (React Query│
└──────┬──────┘
       │ 2. Use query options
       ↓
┌─────────────┐
│Query Options│ staticMailTemplateQueryOptions()
└──────┬──────┘
       │ 3. Call server function
       ↓
┌─────────────┐
│   Server    │ getStaticMailTemplates()
│  Function   │ (createServerFn)
└──────┬──────┘
       │ 4. Call API service
       ↓
┌─────────────┐
│API Service  │ master.getStaticMailTemplates()
│   Class     │
└──────┬──────┘
       │ 5. HTTP request via Axios
       ↓
┌─────────────┐
│   Axios     │ api.get()
│  Instance   │ + interceptors
└──────┬──────┘
       │ 6. HTTP request with auth token
       ↓
┌─────────────┐
│ External    │
│     API     │
└─────────────┘
```

### Mutation Flow

```
┌─────────────┐
│   Client    │
│  Component  │
└──────┬──────┘
       │ 1. Call mutation hook
       ↓
┌─────────────┐
│  Mutation   │ useDeleteStaticMailMutation()
│    Hook     │
└──────┬──────┘
       │ 2. mutateAsync(id)
       ↓
┌─────────────┐
│   Server    │ deleteStaticMailTemplate({ data: id })
│  Function   │
└──────┬──────┘
       │ 3. Call API service
       ↓
┌─────────────┐
│API Service  │ master.deleteStaticMailTemplate(id)
└──────┬──────┘
       │ 4. HTTP DELETE
       ↓
┌─────────────┐
│     API     │
└──────┬──────┘
       │ 5. Success
       ↓
┌─────────────┐
│Query Client │ invalidateQueries()
│   Cache     │ (refetch affected queries)
└─────────────┘
```

---

## Authentication Flow

### Server-Side Auth (Admin App)

```
┌─────────────┐
│  SSO Login  │
└──────┬──────┘
       │ 1. Redirect to SSO provider
       ↓
┌─────────────┐
│SSO Provider │
│   (Auth)    │
└──────┬──────┘
       │ 2. Return auth token
       ↓
┌─────────────┐
│Server Route │ /auth/sso
│  (Handler)  │
└──────┬──────┘
       │ 3. Set HttpOnly cookie
       │    __Host-session = token
       ↓
┌─────────────┐
│  Redirect   │ → Dashboard
└─────────────┘
```

### Request Authentication

```
┌─────────────┐
│   Client    │
│   Request   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Server    │ readSessionToken()
│  Function   │ (reads cookie)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Axios     │ Authorization: Bearer {token}
│Interceptor  │ (adds header)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│     API     │ (validates token)
└─────────────┘
```

### Error Handling (401/403)

```
┌─────────────┐
│     API     │ 401 Unauthorized
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Axios     │ Response interceptor
│Interceptor  │ throws { redirectTo: "/auth/sso" }
└──────┬──────┘
       │
       ↓
┌─────────────┐
│handleApiError│ clearSessionCookie()
│   Utility   │ throw redirect({ href: "/auth/sso" })
└──────┬──────┘
       │
       ↓
┌─────────────┐
│TanStack     │ Catches redirect
│  Router     │ Navigates to SSO
└─────────────┘
```

---

## Route Organization

### File-Based Routing (TanStack Router)

```
routes/
├── __root.tsx                    # Root layout
├── _dashboard.tsx                # Dashboard layout (protected)
├── _dashboard/
│   ├── index.tsx                 # /
│   ├── dashboard.tsx             # /dashboard
│   ├── mail/
│   │   ├── -column/              # Private route (not in URL)
│   │   │   ├── static-mail-column.tsx
│   │   │   └── dynamic-mail-column.tsx
│   │   ├── static-mail-templates/
│   │   │   ├── index.tsx         # /mail/static-mail-templates
│   │   │   ├── create.tsx        # /mail/static-mail-templates/create
│   │   │   └── $id/
│   │   │       ├── index.tsx     # /mail/static-mail-templates/:id
│   │   │       └── edit.tsx      # /mail/static-mail-templates/:id/edit
│   │   └── dynamic-mail-templates/
│   │       └── ...               # Similar structure
│   ├── master/
│   │   └── -column/
│   │       └── department-column.tsx
│   └── system/
│       ├── roles.tsx             # /system/roles
│       └── users.tsx             # /system/users
└── auth/
    ├── sso.tsx                   # /auth/sso
    └── dev-ticket.tsx            # /auth/dev-ticket
```

### Route Naming Conventions

- **Layout routes:** `_prefix` (e.g., `_dashboard.tsx`)
- **Dynamic routes:** `$param` (e.g., `$id/`)
- **Private routes:** `-prefix` (e.g., `-column/`)
- **Index routes:** `index.tsx` (maps to parent path)

---

## State Management Strategy

### URL State (Search Params)

**Used for:**
- Table filters (search, status, pagination)
- Combobox selections (branch_id, department_id)
- Any state that should persist on page reload

**Pattern:**
```typescript
const search = Route.useSearch()
navigate({ search: (prev) => ({ ...prev, page: 1 }) })
```

### React Query Cache

**Used for:**
- Server data (entities from API)
- Optimistic updates
- Background refetching

**Pattern:**
```typescript
const { data } = useSuspenseQuery(queryOptions)
queryClient.invalidateQueries({ queryKey })
```

### Local Component State

**Used for:**
- UI state (modals, dropdowns, tooltips)
- Form state (via TanStack Form)
- Temporary display state

**Pattern:**
```typescript
const [isOpen, setIsOpen] = useState(false)
```

### No Global State Library

- **No Redux/Zustand/Jotai**
- React Query handles server state
- URL handles shareable state
- Local state for UI

---

**End of ARCHITECTURE.md**

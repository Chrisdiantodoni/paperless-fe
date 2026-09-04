# Product Requirements Document (PRD)

**Feature Name:** [Feature Name Here]  
**Author:** [Your Name]  
**Date:** [YYYY-MM-DD]  
**Status:** [Draft | In Review | Approved | In Progress | Completed]

---

## 1. Overview

### 1.1 Feature Summary
[Provide a brief 2-3 sentence description of the feature]

**Example:**
> This feature adds a table-based interface for managing employee departments. Users can view, create, edit, and delete departments with filtering by status and search functionality. The interface supports pagination and real-time data fetching.

### 1.2 Goals
- [Primary goal 1]
- [Primary goal 2]
- [Primary goal 3]

### 1.3 Non-Goals
- [What this feature will NOT do]
- [Out of scope items]

---

## 2. User Stories

### 2.1 Primary User Stories

**As a** [user role]  
**I want to** [action]  
**So that** [benefit]

**Example:**
> **As a** system administrator  
> **I want to** view all departments in a paginated table  
> **So that** I can quickly browse and manage organizational structure

### 2.2 Additional User Stories
[List 3-5 additional user stories covering CRUD operations]

---

## 3. Data Model

### 3.1 Entity Definition

**Entity Name:** `[EntityName]`

**TypeScript Interface:**
```typescript
export interface [EntityName] {
  id: string
  name: string
  code: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Add all fields
}
```

**Example:**
```typescript
export interface Department {
  id: string
  name: string
  department_code: string
  branch_category: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### 3.2 Type Location
**Path:** `packages/types/src/[domain].ts`

---

## 4. Table Specification

### 4.1 Table Columns

| Column | Accessor Key | Header | Type | Sortable | Notes |
|--------|-------------|--------|------|----------|-------|
| No. | `no` | No. | computed | No | Row number with pagination |
| [Field 1] | `[key]` | [Label] | string | Yes | [Notes] |
| [Field 2] | `[key]` | [Label] | boolean | No | Badge display |
| Actions | `actions` | Aksi | component | No | View, Edit, Delete |

**Example:**
| Column | Accessor Key | Header | Type | Sortable | Notes |
|--------|-------------|--------|------|----------|-------|
| No. | `no` | No. | computed | No | (page - 1) * perPage + index + 1 |
| Name | `name` | Nama | string | Yes | Department name |
| Code | `department_code` | Kode | string | Yes | Unique code |
| Status | `is_active` | Status | boolean | No | Badge: Aktif/Tidak Aktif |
| Actions | `actions` | Aksi | component | No | View, Edit, Delete buttons |

### 4.2 Column Component Location
**Path:** `apps/paperless-admin/src/routes/_dashboard/[domain]/-column/[entity]-column.tsx`

---

## 5. Search & Filtering

### 5.1 Search Schema

**Schema Definition:**
```typescript
export const [entity]SearchSchema = z.object({
  page: z.number().catch(1),
  search: z.string().catch(""),
  per_page: z.number().catch(10),
  status: z.enum(["all", "active", "inactive"]).catch("all").optional(),
  // Add additional filters
})

export type [Entity]Search = z.infer<typeof [entity]SearchSchema>
```

**Schema Location:** `apps/paperless-admin/src/schema/list.schema.ts`

### 5.2 Filter Components

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Search | Text Input | N/A | "" |
| Status | Select | All, Active, Inactive | "all" |
| [Custom Filter] | [Type] | [Options] | [Default] |

**Example:**
| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Search | Text Input | N/A | "" |
| Status | Select | Semua Status, Aktif, Tidak Aktif | "all" |
| Branch | Combobox | Dynamic from API | "" |
| Department | Combobox | Dynamic from API | "" |

---

## 6. CRUD Operations

### 6.1 List/Read (Table View)

**Route:** `/[domain]/[entity-plural]`  
**Component:** `index.tsx`

**Features:**
- [x] Paginated table display
- [x] Search by name/code
- [x] Filter by status
- [x] Skeleton loading state
- [x] Empty state handling

### 6.2 Detail/View

**Route:** `/[domain]/[entity-plural]/$id`  
**Component:** `$id/index.tsx`

**Features:**
- [ ] Display all entity fields
- [ ] Related data (if any)
- [ ] Action buttons (Edit, Delete, Back)

### 6.3 Create

**Route:** `/[domain]/[entity-plural]/create`  
**Component:** `create.tsx`

**Features:**
- [ ] Form with validation
- [ ] Success toast notification
- [ ] Navigate to list on success
- [ ] Cancel button

### 6.4 Edit

**Route:** `/[domain]/[entity-plural]/$id/edit`  
**Component:** `$id/edit.tsx`

**Features:**
- [ ] Pre-populated form
- [ ] Validation matching create
- [ ] Success toast notification
- [ ] Navigate to detail on success
- [ ] Cancel button

### 6.5 Delete

**Location:** Table action cell  
**Trigger:** Delete button in row

**Features:**
- [ ] Confirmation dialog
- [ ] Success toast notification
- [ ] Refetch table data
- [ ] Error handling

---

## 7. Validation Rules

### 7.1 Form Validation Schema

```typescript
export const [entity]FormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi"),
  is_active: z.boolean().default(true),
  // Add all fields with validation
})

export type [Entity]FormSchema = z.infer<typeof [entity]FormSchema>
```

**Schema Location:** `apps/paperless-admin/src/schema/[domain]/schema.ts`

### 7.2 Validation Rules

| Field | Required | Min Length | Max Length | Pattern | Notes |
|-------|----------|-----------|------------|---------|-------|
| name | Yes | 1 | 255 | N/A | Department name |
| code | Yes | 1 | 50 | Alphanumeric | Unique code |
| is_active | No | N/A | N/A | Boolean | Default: true |

---

## 8. API Endpoints

### 8.1 Endpoint Mapping

| Operation | Method | Endpoint | Request Body | Response |
|-----------|--------|----------|-------------|----------|
| List | GET | `/[domain]/[entity-plural]` | Query params | `LaravelPaginationData<Entity[]>` |
| Detail | GET | `/[domain]/[entity-plural]/:id` | N/A | `Entity` |
| Create | POST | `/[domain]/[entity-plural]` | `EntityFormData` | `Entity` |
| Update | PUT | `/[domain]/[entity-plural]/:id` | `EntityFormData` | `Entity` |
| Delete | DELETE | `/[domain]/[entity-plural]/:id` | N/A | `{ success: true }` |

**Example:**
| Operation | Method | Endpoint | Request Body | Response |
|-----------|--------|----------|-------------|----------|
| List | GET | `/master/departments` | `{ page, search, status }` | `LaravelPaginationData<Department[]>` |
| Detail | GET | `/master/departments/:id` | N/A | `Department` |
| Create | POST | `/master/departments` | `DepartmentFormData` | `Department` |
| Update | PUT | `/master/departments/:id` | `DepartmentFormData` | `Department` |
| Delete | DELETE | `/master/departments/:id` | N/A | `{ success: true }` |

### 8.2 API Service Location
**Path:** `apps/paperless-admin/src/services/API/[domain].ts`

---

## 9. User Permissions

### 9.1 Role-Based Access

| Role | View | Create | Edit | Delete |
|------|------|--------|------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Manager | ✅ | ✅ | ✅ | ❌ |
| User | ✅ | ❌ | ❌ | ❌ |

[Adjust based on your requirements]

---

## 10. Success Criteria

### 10.1 Functional Requirements
- [ ] Table displays paginated data correctly
- [ ] Search filters data in real-time
- [ ] Status filter works correctly
- [ ] Create form validates and submits successfully
- [ ] Edit form loads existing data and updates correctly
- [ ] Delete confirmation works and removes data
- [ ] All toast notifications appear appropriately

### 10.2 Non-Functional Requirements
- [ ] Page loads in < 2 seconds
- [ ] Table pagination is smooth without flicker
- [ ] Form validation provides clear error messages
- [ ] Mobile responsive (table scrolls horizontally)
- [ ] Accessible (keyboard navigation, screen readers)

### 10.3 Technical Requirements
- [ ] TypeScript types defined in `packages/types`
- [ ] Search schema in `schema/list.schema.ts`
- [ ] Form schema in `schema/[domain]/schema.ts`
- [ ] Query keys in `keys/[entity]Keys.ts`
- [ ] Query hooks in `hooks/queries/use-[entity].tsx`
- [ ] Server functions in `server/[domain].ts`
- [ ] API service methods in `services/API/[domain].ts`
- [ ] Column definitions in `routes/.../−column/[entity]-column.tsx`
- [ ] Route components follow TanStack Router conventions

---

## 11. Implementation Checklist

- [ ] **Phase 1: Types & Schemas**
  - [ ] Define TypeScript interface
  - [ ] Create search schema
  - [ ] Create form schema
  
- [ ] **Phase 2: API Integration**
  - [ ] Add API service methods
  - [ ] Create server functions
  - [ ] Create query key factory
  - [ ] Create query hooks

- [ ] **Phase 3: Table View**
  - [ ] Define table columns
  - [ ] Create list route component
  - [ ] Implement search & filters
  - [ ] Add pagination

- [ ] **Phase 4: CRUD Operations**
  - [ ] Create form component
  - [ ] Create route
  - [ ] Edit route with data loading
  - [ ] Delete with confirmation

- [ ] **Phase 5: Testing & Polish**
  - [ ] Run `pnpm lint`
  - [ ] Run `pnpm typecheck`
  - [ ] Test all CRUD operations
  - [ ] Test mobile responsiveness
  - [ ] Test error states

---

## 12. Notes & References

- Refer to `docs/patterns/TABLE_IMPLEMENTATION.md` for implementation guide
- Follow naming conventions in `docs/patterns/NAMING_CONVENTIONS.md`
- Query patterns documented in `docs/patterns/QUERY_PATTERNS.md`

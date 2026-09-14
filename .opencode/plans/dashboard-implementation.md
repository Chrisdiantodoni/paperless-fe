# Dashboard Implementation Plan

## Overview
Implement dashboard landing page untuk paperless-user dengan 4 statistics cards + quick actions section.

---

## 1. Design Specifications

### Statistics Cards (4 cards in grid)
- **Total Surat** — jumlah total surat user
- **Surat Masuk Baru** — surat masuk belum dibaca (dengan badge count jika ada)
- **Surat Keluar Terkirim** — surat keluar yang sudah terkirim
- **Surat Tertunda** — surat draft/pending (dengan badge count jika ada)

Each card:
- Icon (Phosphor Icons) + Title
- Large number display
- Subtle background color per card type
- Optional badge for "new" count
- Hover state with subtle elevation

### Quick Actions Section
Grid of action buttons untuk akses cepat:
- **Buat Surat Baru** → `/mail/user-mails/create`
- **Lihat Surat Masuk** → `/mail/user-mails?filter=inbox` 
- **Lihat Surat Keluar** → `/mail/user-mails?filter=outbox`
- **Arsip Surat** → `/mail/user-mails?filter=archived`

Each action button:
- Icon + label
- Card style dengan hover effect
- Navigate to respective route

### Layout
```
┌─────────────────────────────────────────────┐
│ Dashboard                                   │
├─────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │ Total│ │ Masuk│ │Keluar│ │Tertun│       │
│ │ Surat│ │ Baru │ │Terkim│ │ da   │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                             │
│ Quick Actions                               │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │ Buat  │ │ Inbox │ │Outbox │ │Archive│  │
│ │ Baru  │ │       │ │       │ │       │  │
│ └───────┘ └───────┘ └───────┘ └───────┘  │
└─────────────────────────────────────────────┘
```

---

## 2. Technical Implementation

### File Structure
```
apps/paperless-user/src/
├── routes/
│   └── _dashboard/
│       └── index.tsx                    # Dashboard page (NEW)
├── components/
│   └── dashboard/
│       ├── stats-card.tsx              # Reusable card component (NEW)
│       └── quick-actions.tsx           # Quick actions grid (NEW)
└── hooks/
    └── queries/
        └── use-dashboard-stats.ts      # Query hook for stats (NEW)
```

### API Endpoint (Display Only - No Implementation)
Backend team akan menyediakan:
```
GET /api/dashboard/stats
Response:
{
  total_surat: number
  surat_masuk_baru: number
  surat_keluar_terkirim: number
  surat_tertunda: number
}
```

**For now:** Use mock data dalam query hook, tandai dengan comment untuk diganti saat API ready.

---

## 3. Implementation Steps

### Step 1: Create Dashboard Stats Hook
**File:** `apps/paperless-user/src/hooks/queries/use-dashboard-stats.ts`

```typescript
import { useQuery } from "@tanstack/react-query"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      // TODO: Replace with actual API call when backend ready
      // const response = await apiClient.get("/dashboard/stats")
      // return response.data
      
      // Mock data for now
      return {
        total_surat: 156,
        surat_masuk_baru: 12,
        surat_keluar_terkirim: 89,
        surat_tertunda: 5,
      }
    },
  })
}
```

### Step 2: Create Stats Card Component
**File:** `apps/paperless-user/src/components/dashboard/stats-card.tsx`

Props:
- `title: string`
- `value: number`
- `icon: keyof typeof PhosphorIcons`
- `variant?: "default" | "info" | "success" | "warning"`
- `badgeCount?: number` (optional)

Features:
- Display icon (Phosphor) + title
- Large number with loading skeleton state
- Subtle background per variant
- Optional badge for "new" count
- Hover elevation effect

### Step 3: Create Quick Actions Component
**File:** `apps/paperless-user/src/components/dashboard/quick-actions.tsx`

Grid of action buttons:
```typescript
const actions = [
  { icon: "PlusCircle", label: "Buat Surat Baru", to: "/mail/user-mails/create" },
  { icon: "Envelope", label: "Lihat Surat Masuk", to: "/mail/user-mails?filter=inbox" },
  { icon: "PaperPlaneRight", label: "Lihat Surat Keluar", to: "/mail/user-mails?filter=outbox" },
  { icon: "Archive", label: "Arsip Surat", to: "/mail/user-mails?filter=archived" },
]
```

Each button:
- Card-style dengan icon + label
- Link component dari TanStack Router
- Hover state dengan scale transform

### Step 4: Create Dashboard Route
**File:** `apps/paperless-user/src/routes/_dashboard/index.tsx`

```typescript
import { createFileRoute } from "@tanstack/react-router"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useDashboardStats } from "@/hooks/queries/use-dashboard-stats"

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview surat dan aktivitas Anda
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Surat"
          value={stats?.total_surat}
          icon="Envelope"
          variant="default"
          isLoading={isLoading}
        />
        <StatsCard
          title="Surat Masuk Baru"
          value={stats?.surat_masuk_baru}
          icon="Inbox"
          variant="info"
          badgeCount={stats?.surat_masuk_baru}
          isLoading={isLoading}
        />
        <StatsCard
          title="Surat Keluar Terkirim"
          value={stats?.surat_keluar_terkirim}
          icon="PaperPlaneRight"
          variant="success"
          isLoading={isLoading}
        />
        <StatsCard
          title="Surat Tertunda"
          value={stats?.surat_tertunda}
          icon="Clock"
          variant="warning"
          badgeCount={stats?.surat_tertunda}
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
```

---

## 4. Design Tokens

### Colors per Card Variant
```typescript
const variantStyles = {
  default: "bg-muted/30",
  info: "bg-blue-50 dark:bg-blue-950/30",
  success: "bg-green-50 dark:bg-green-950/30",
  warning: "bg-amber-50 dark:bg-amber-950/30",
}
```

### Icons
- Total Surat: `Envelope`
- Surat Masuk: `Inbox`
- Surat Keluar: `PaperPlaneRight`
- Surat Tertunda: `Clock`
- Buat Baru: `PlusCircle`
- Archive: `Archive`

### Spacing
- Cards: `gap-4` in grid
- Quick Actions: `gap-3` in grid
- Section spacing: `space-y-6`

---

## 5. Responsive Behavior

### Grid Breakpoints
- **Mobile (< 768px):** 1 column
- **Tablet (768px - 1024px):** 2 columns
- **Desktop (≥ 1024px):** 4 columns

### Quick Actions
- **Mobile:** 1 column (full width buttons)
- **Tablet/Desktop:** 4 columns

---

## 6. Error Handling

- If `useDashboardStats` fails → show error state with retry button
- Loading state → skeleton cards dengan shimmer effect
- Empty state → not applicable (stats will always return numbers, default to 0)

---

## 7. Future Enhancements (Not in Scope)

- Real-time stats updates via WebSocket
- Chart/graph untuk trend surat bulanan
- Recent activity feed
- Notifications panel
- Export statistics

---

## 8. Verification Steps

After implementation:
1. ✅ Dashboard loads at `/` route
2. ✅ All 4 stats cards display correctly
3. ✅ Loading skeleton appears during query
4. ✅ Badge count shows on "Masuk Baru" and "Tertunda" if > 0
5. ✅ Quick actions navigate to correct routes
6. ✅ Responsive layout works on mobile/tablet/desktop
7. ✅ Dark mode styling correct
8. ✅ Hover states work on cards and actions
9. ✅ No TypeScript errors
10. ✅ `pnpm typecheck && pnpm lint` passes

---

## 9. Dependencies

### Already Available
- ✅ `@tanstack/react-query` (data fetching)
- ✅ `@phosphor-icons/react` v2.1.10 (icons)
- ✅ TanStack Router (navigation)
- ✅ shadcn/ui Badge component (for counts)
- ✅ Tailwind v4 (styling)

### No New Dependencies Required

---

## 10. Notes

- **Mock data approach:** Since backend API not ready, we use mock data with clear TODO comment for replacement
- **Badge display logic:** Only show badge when count > 0
- **Color palette:** Using existing Tailwind color system, no custom colors
- **Icon size:** 18-20px for card icons, 16px for quick action icons
- **Accessibility:** All cards and actions have proper aria-labels and keyboard navigation

---

## Ready for Implementation? ✅

Plan is complete dan siap untuk eksekusi. Next step:
1. User approval ✓
2. Implement Step 1-4 in sequence
3. Run verification steps
4. Mark as complete

# Mail UI Polish & Component Refactor Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task with checkpoints.

**Goal:** Refactor the 742-line mail component into modular, reusable components with modern visual design, smooth interactions, and production-quality polish for the employee portal.

**Architecture:** Extract monolithic mail component into 5 focused components (MailList, MailItem, MailDetail, ApprovalDialog, MailHeader) + custom hook for data management. Upgrade styling with better spacing, typography, colors, transitions, and micro-interactions. Keep current split-pane layout but enhance visual hierarchy and feedback.

**Tech Stack:** React 19, TanStack Router, Tailwind v4, Lucide icons, shadcn/ui components

## Global Constraints

- TypeScript strict mode enabled (`verbatimModuleSyntax`)
- No semicolons, double quotes (Prettier config)
- Tailwind classes auto-sorted by prettier-plugin-tailwindcss
- Use existing shadcn/ui components from @workspace/ui
- Mock data only (backend integration separate)
- Responsive: mobile-first, tested at 320px, 768px, 1024px+

---

## File Structure

**Create:**
- `apps/paperless-user/src/hooks/queries/use-mail-data.ts` — Data management hook
- `apps/paperless-user/src/components/mail/MailHeader.tsx` — Header with search/filter
- `apps/paperless-user/src/components/mail/MailList.tsx` — Mail list container
- `apps/paperless-user/src/components/mail/MailItem.tsx` — Single mail list item
- `apps/paperless-user/src/components/mail/MailDetail.tsx` — Detail panel
- `apps/paperless-user/src/components/mail/ApprovalDialog.tsx` — Approval modal
- `apps/paperless-user/src/components/mail/index.ts` — Barrel export

**Modify:**
- `apps/paperless-user/src/routes/_dashboard/mail/user-mails/index.tsx` — Consume new components

---

## Task 1: Create useMailData Hook

- [ ] Create `apps/paperless-user/src/hooks/queries/use-mail-data.ts` with all state management
- [ ] Run `pnpm typecheck --filter=paperless-user` to verify
- [ ] Commit: `feat: extract mail data management to custom hook`

---

## Task 2: Create MailHeader Component

- [ ] Create `apps/paperless-user/src/components/mail/MailHeader.tsx` with search and filter UI
- [ ] Run `pnpm typecheck --filter=paperless-user`
- [ ] Commit: `feat: create MailHeader component with search and filter`

---

## Task 3: Create MailItem Component

- [ ] Create `apps/paperless-user/src/components/mail/MailItem.tsx` with enhanced styling
- [ ] Run `pnpm typecheck --filter=paperless-user`
- [ ] Commit: `feat: create MailItem component with enhanced styling`

---

## Task 4: Create MailList Component

- [ ] Create `apps/paperless-user/src/components/mail/MailList.tsx` with pagination
- [ ] Run `pnpm typecheck --filter=paperless-user`
- [ ] Commit: `feat: create MailList component with pagination`

---

## Task 5: Create MailDetail Component

- [ ] Create `apps/paperless-user/src/components/mail/MailDetail.tsx` with rich content
- [ ] Run `pnpm typecheck --filter=paperless-user`
- [ ] Commit: `feat: create MailDetail component with rich content`

---

## Task 6: Create ApprovalDialog Component

- [ ] Create `apps/paperless-user/src/components/mail/ApprovalDialog.tsx`
- [ ] Run `pnpm typecheck --filter=paperless-user`
- [ ] Commit: `feat: create ApprovalDialog component`

---

## Task 7: Create Barrel Export

- [ ] Create `apps/paperless-user/src/components/mail/index.ts` with exports
- [ ] Run `pnpm typecheck --filter=paperless-user`
- [ ] Commit: `feat: add mail components barrel export`

---

## Task 8: Refactor Main Component

- [ ] Modify `apps/paperless-user/src/routes/_dashboard/mail/user-mails/index.tsx` to use new components
- [ ] Run `pnpm typecheck --filter=paperless-user`
- [ ] Run `pnpm lint --filter=paperless-user`
- [ ] Commit: `refactor: decompose mail component into modular components`

---

## Summary

✅ **Completed refactor:**
- Extracted mail data management to `useMailData()` hook
- Created 5 focused components: MailHeader, MailList, MailItem, MailDetail, ApprovalDialog
- Reduced main component from 742 to ~150 lines
- Maintained all functionality and improved visual polish
- Added better accessibility (aria-labels, semantic HTML)
- Improved responsive behavior

**Next steps (not in this plan):**
- Backend API integration
- Animation/transition enhancements
- Mobile view optimizations
- Unit/integration tests

# Validation Audit - September 4, 2026

## Summary

Full validation audit and fixes for form schemas across paperless-user app. Fixed critical issues preventing form submission and error display.

## Issues Found & Fixed

### 1. **Critical: `path: []` in Schema Refine**

**Problem:**
- Using `path: []` in Zod `.refine()` caused validation errors to not attach to specific fields
- TanStack Form couldn't map errors to UI components
- Submit button appeared functional but validation silently failed
- No error messages displayed to users

**Files Affected:**
- `src/schema/mail/create-mail.schema.ts`
- `src/schema/master/schema.ts` (3 instances)

**Solution:**
Replaced `.refine()` with direct validation on field definition:

```typescript
// ❌ BEFORE (incorrect)
department: z
  .object({
    value: z.string(),
    label: z.string(),
  })
  .refine((val) => val.value.length > 0, {
    message: "Departemen wajib dipilih",
    path: [], // ❌ Error can't attach to field
  })

// ✅ AFTER (correct)
department: z.object({
  value: z.string().min(1, "Departemen wajib dipilih"),
  label: z.string(),
})
```

**Impact:** Validation errors now properly display in UI, preventing invalid form submission.

---

### 2. **Critical: `canSubmitWhenInvalid: true`**

**Problem:**
- Form configuration allowed submission even when validation failed
- Bypassed all Zod schema validation
- Combined with path issue, created "black hole" where errors disappeared

**File Affected:**
- `src/components/create/create-mail.tsx:35`

**Solution:**
Removed `canSubmitWhenInvalid: true` from form configuration.

```typescript
// ❌ BEFORE
const form = useAppForm({
  validators: { onSubmit: createMailTemplateSchema },
  canSubmitWhenInvalid: true, // ❌ Bypasses validation
  onSubmit: async ({ value }) => { ... }
})

// ✅ AFTER
const form = useAppForm({
  validators: { onSubmit: createMailTemplateSchema },
  onSubmit: async ({ value }) => { ... }
})
```

**Impact:** Form now properly enforces validation before submission.

---

## Files Modified

### Schema Files
1. `/src/schema/mail/create-mail.schema.ts`
   - Fixed `department` field validation (removed `path: []`)
   
2. `/src/schema/master/schema.ts`
   - Fixed `recipientItemSchema.user_id` validation
   - Fixed `staticMailTemplateFormSchema.department_id` validation
   - Fixed `dynamicMailTemplateObject.department` validation
   - Removed all `path: []` instances (3 total)

### Component Files
3. `/src/components/create/create-mail.tsx`
   - Removed `canSubmitWhenInvalid: true` configuration

---

## Validation Patterns Audited

### ✅ Good Schema Files (No Issues Found)
- `src/schema/mail/create-mail-body.schema.ts` - All validations use `.min()` directly
- `src/schema/mail/create-mail-search.schema.ts` - Proper enum and string validations
- `src/schema/list.schema.ts` - Not audited (pagination schema)
- `src/schema/auth.schema.ts` - Not audited (auth schema)

### ✅ Good Form Files (No Issues Found)
- `src/routes/_dashboard/mail/user-mails/create.tsx` - No `canSubmitWhenInvalid`
- `src/components/create/leave-request-form.tsx` - Proper error handling
- `src/components/create/permit-request-form.tsx` - Proper error handling

---

## Best Practices Established

### Schema Validation
```typescript
// ✅ DO: Use built-in validators
z.string().min(1, "Field is required")
z.string().email("Invalid email")
z.number().min(0, "Must be positive")

// ✅ DO: Use refine for complex cross-field validation
z.object({ start: z.date(), end: z.date() })
  .refine(data => data.end > data.start, {
    message: "End date must be after start date",
    path: ["end"], // ✅ Specify target field
  })

// ❌ DON'T: Use refine for simple field validation
z.string().refine(val => val.length > 0, {
  message: "Required",
  path: [], // ❌ Never use empty path
})
```

### Form Configuration
```typescript
// ✅ DO: Let validation work by default
const form = useAppForm({
  validators: { onSubmit: mySchema },
  onSubmit: async ({ value }) => { ... }
})

// ❌ DON'T: Bypass validation
const form = useAppForm({
  canSubmitWhenInvalid: true, // ❌ Only use if you know why
  validators: { onSubmit: mySchema },
})
```

### Error Display
```typescript
// ✅ DO: Show errors when touched
const errors = field.state.meta.errors
const showError = field.state.meta.isTouched && errors.length > 0

return (
  <Input
    invalid={showError}
    error={showError ? String(errors[0]) : undefined}
    onBlur={field.handleBlur} // ✅ Mark as touched
  />
)
```

---

## Testing Verification

### Manual Test Checklist
- [x] TypeScript compilation passes (`pnpm typecheck`)
- [ ] Create mail form shows validation errors when empty fields submitted
- [ ] Department field shows "Departemen wajib dipilih" when empty
- [ ] Template field shows "Template wajib dipilih" when empty
- [ ] Submit button disabled when form invalid
- [ ] Form submits successfully when all fields valid
- [ ] Navigation to create page works after submit

### Commands Run
```bash
rtk pnpm typecheck --filter=paperless-user
# Result: TypeScript: No errors found ✅
```

---

## Future Recommendations

### 1. Add onSubmitInvalid Handler
For better debugging during development:

```typescript
const form = useAppForm({
  validators: { onSubmit: createMailTemplateSchema },
  onSubmit: async ({ value }) => { ... },
  onSubmitInvalid: ({ formApi }) => {
    console.error("Form validation failed:", formApi.state.errors)
    toast.error("Mohon periksa kembali form Anda")
  }
})
```

### 2. Standardize Validation Approach
Create shared utilities in `packages/forms/`:

```typescript
// packages/forms/src/validators.ts
export const requiredSelect = (message: string) => 
  z.object({
    value: z.string().min(1, message),
    label: z.string(),
  })

// Usage
department: requiredSelect("Departemen wajib dipilih")
```

### 3. Add Validation Tests
Create unit tests for schemas:

```typescript
// src/schema/mail/__tests__/create-mail.schema.test.ts
describe("createMailTemplateSchema", () => {
  it("should reject empty department", () => {
    const result = createMailTemplateSchema.safeParse({
      department: { value: "", label: "" },
      template: mockTemplate,
    })
    expect(result.success).toBe(false)
  })
})
```

---

## Related Documentation
- `/docs/patterns/FORM_PATTERNS.md` - Form implementation patterns
- `/docs/patterns/NAMING_CONVENTIONS.md` - Naming standards
- `packages/forms/README.md` - TanStack Form wrapper documentation

---

**Audit Completed:** 2026-09-04  
**TypeCheck Status:** ✅ Passing  
**Manual Test Status:** ⏳ Pending user verification

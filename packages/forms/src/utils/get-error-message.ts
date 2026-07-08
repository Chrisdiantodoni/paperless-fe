/**
 * Field validator errors can come in two shapes depending on the trigger:
 *   - `onChange`/`onBlur` validators you write yourself, returning a plain
 *     string → error is already a string.
 *   - `onSubmit` validated against a zod (or any Standard Schema) schema →
 *     TanStack Form distributes each schema issue to its field as an
 *     object shaped like `{ message: string, path?: ... }`, not a string.
 *
 * Every field component should render errors through this helper instead
 * of `String(error)` — otherwise object-shaped errors print as
 * "[object Object]".
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message
  }
  return String(error)
}

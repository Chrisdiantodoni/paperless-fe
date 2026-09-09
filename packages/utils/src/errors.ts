export function extractApiError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message
  }
  return "Terjadi kesalahan"
}

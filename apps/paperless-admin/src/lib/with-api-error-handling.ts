// src/utils/with-api-error-handling.ts
import { handleApiError } from "./handle-api-error"

/**
 * Bungkus async function (biasanya isi loader) supaya semua error
 * dari axios otomatis di-cek: kalau ada `redirectTo`, langsung redirect.
 *
 * Contoh:
 * loader: withApiErrorHandling(async () => {
 *   const data = await apiClient.get("/some-data");
 *   return data;
 * })
 */
export function withApiErrorHandling<T>(
  fn: () => Promise<T>
): () => Promise<T> {
  return async () => {
    try {
      return await fn()
    } catch (err) {
      handleApiError(err) // ini akan throw (redirect atau error asli)
    }
  }
}

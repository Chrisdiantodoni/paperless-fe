import type { NavPrimaryprops } from "@workspace/types/utilities"

/**
 * Flatten struktur sidebar (termasuk nested children) menjadi
 * Map<path, label> agar breadcrumb bisa lookup label berdasarkan
 * pathname yang sedang aktif.
 *
 * Item dengan `header` (section label, bukan link) dilewati.
 */
export function buildBreadcrumbMap(
  items: NavPrimaryprops["items"]
): Map<string, string> {
  const map = new Map<string, string>()

  for (const item of items) {
    if (item.url && item.title) {
      map.set(item.url, item.title)
    }

    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        if (child.url && child.title) {
          map.set(child.url, child.title)
        }
      }
    }
  }

  return map
}

/** Ubah segmen URL (kebab-case) jadi label yang enak dibaca, fallback terakhir. */
export function humanizeSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

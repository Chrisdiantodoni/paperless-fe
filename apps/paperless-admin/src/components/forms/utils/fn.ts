import type { SelectValue } from "@workspace/types"

export function resolveLabels(items: SelectValue[], max = 6) {
  const labels = items.map((item) => item.label)
  const isTruncated = labels.length > max

  return {
    display: isTruncated
      ? `${labels.slice(0, max).join(", ")}, +${labels.length - max} lainnya`
      : labels.join(", "),
    full: labels.join(", "),
    isTruncated,
  }
}

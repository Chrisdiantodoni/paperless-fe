import { getRequestTypeLabel } from "@workspace/utils"

export function statusUtils(status: string) {
  return getRequestTypeLabel(status)
}

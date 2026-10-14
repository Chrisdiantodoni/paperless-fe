import type { AllMailProps } from "@workspace/types/mail"

export function isMailReadByUser(
  mail: AllMailProps,
  currentUserIds: string[]
): boolean {
  return mail.logs.some(
    (log) =>
      log.action === "READ" && currentUserIds.includes(log.performed_by.id)
  )
}

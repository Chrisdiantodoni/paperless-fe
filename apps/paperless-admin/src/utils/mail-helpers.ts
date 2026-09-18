import type { AllMailProps } from "@workspace/types/mail"

export function isMailReadByUser(
  mail: AllMailProps,
  currentUserId: string
): boolean {
  console.log(mail)

  return mail.logs.some(
    (log) => log.action === "READ" && log.performed_by.id === currentUserId
  )
}

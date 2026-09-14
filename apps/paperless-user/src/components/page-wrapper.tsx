import type { HTMLAttributes } from "react"
import { cn } from "@workspace/ui/lib/utils"

export function PageWrapper({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full px-4 py-6 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}

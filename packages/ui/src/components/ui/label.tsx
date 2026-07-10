import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@workspace/ui/lib/utils"

// 1. Tambahkan extends untuk memasukkan properti required
interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean
}

function Label({
  className,
  required, // 2. Ambil properti required di sini
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // 3. Jika required true, tambahkan asterisk merah di akhir text
        required && "after:ml-0.5 after:text-destructive after:content-['*']",
        className
      )}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  )
}

export { Label }

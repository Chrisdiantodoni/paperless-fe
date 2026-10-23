import { FileXIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

export function NotFoundPage({ action }: { action: ReactNode }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-16">
      <div className="absolute inset-0" />
      <div className="relative w-full max-w-xl text-center">
        <div className="relative mx-auto mb-8 grid size-28 place-items-center rounded-[2rem] border bg-card shadow-sm">
          <span className="absolute -top-5 -right-10 -z-10 text-8xl font-black tracking-tighter text-muted/50 select-none sm:-right-20 sm:text-9xl">
            404
          </span>
          <FileXIcon className="size-12 text-primary" weight="duotone" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          Tautan mungkin sudah berubah atau alamat yang dimasukkan kurang tepat.
          Kembali ke dashboard untuk melanjutkan pekerjaan.
        </p>
        <div className="mt-8 flex justify-center">{action}</div>
      </div>
    </main>
  )
}

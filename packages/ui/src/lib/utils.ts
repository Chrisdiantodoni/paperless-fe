import { clsx } from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null): string {
  if (!name || typeof name !== "string") return "?"

  // Bersihkan spasi berlebih di awal/akhir dan di antara kata
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return "?"

  // Jika hanya 1 kata: ambil 2 huruf pertama (misal "Doni" -> "DO")
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  // Jika 2 kata atau lebih: ambil huruf pertama kata pertama + huruf pertama kata terakhir
  // Contoh 2 kata: "Doni Chrisdianto" -> "DC"
  // Contoh 3 kata: "Doni Chrisdianto K" -> "DK" (atau "DCK" jika ingin 3 huruf)
  const firstInitial = words[0][0]
  const lastInitial = words[words.length - 1][0]

  return `${firstInitial}${lastInitial}`.toUpperCase()
}

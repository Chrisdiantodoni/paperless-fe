import { Input } from "@workspace/ui/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  debounce?: number
  className?: string
}

export function SearchInput({
  placeholder,
  value = "",
  onChange,
  debounce = 400,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value)
  const debouncedValue = useDebounce(internalValue, debounce)

  // Ref untuk mendeteksi apakah perubahan datang dari user mengetik atau dari props luar
  const isTyping = useRef(false)

  // 1. Hanya sinkronisasi ke dalam JIKA perubahan murni dari luar (bukan karena ketikan user)
  useEffect(() => {
    if (!isTyping.current) {
      setInternalValue(value)
    }
  }, [value])

  // 2. Kirim nilai ke parent hanya saat debouncedValue berubah akibat ketikan
  useEffect(() => {
    if (isTyping.current) {
      onChange?.(debouncedValue)
      // Matikan flag setelah debounce selesai menembak nilai terbaru
      isTyping.current = false
    }
  }, [debouncedValue])

  return (
    <div className={`relative w-full max-w-sm ${className ?? ""} h-8`}>
      <Search className="absolute top-2 left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-8"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => {
          isTyping.current = true // Tandai bahwa user sedang mengetik/backspace
          setInternalValue(e.target.value)
        }}
      />
    </div>
  )
}

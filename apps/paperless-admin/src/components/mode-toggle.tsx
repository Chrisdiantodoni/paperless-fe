import { AnimatedThemeToggler } from "@workspace/ui/components/ui/animated-theme-toggler"

export function ModeToggle() {
  return (
    <AnimatedThemeToggler
      aria-label="Ganti tema"
      className="h-10 w-10 rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      variant="circle"
      duration={500}
    />
  )
}

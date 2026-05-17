"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const THEME_CYCLE = ["system", "light", "dark"] as const
type Theme = (typeof THEME_CYCLE)[number]

const THEME_CONFIG: Record<Theme, { Icon: React.ElementType; label: string }> = {
  light:  { Icon: Sun,     label: "Light mode"  },
  dark:   { Icon: Moon,    label: "Dark mode"   },
  system: { Icon: Monitor, label: "System mode" },
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Loading theme" disabled className={cn("shrink-0", className)}>
        <Sun className="h-4 w-4" aria-hidden="true" />
      </Button>
    )
  }

  const currentTheme = (theme ?? "system") as Theme
  const config       = THEME_CONFIG[currentTheme]
  const isDark       = resolvedTheme === "dark"

  const handleToggle = () => {
    const idx  = THEME_CYCLE.indexOf(currentTheme)
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]
    setTheme(next)
  }

  const sunClass  = isDark ? "rotate-90 scale-0 opacity-0"   : "rotate-0 scale-100 opacity-100"
  const moonClass = isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            aria-label={`Current theme: ${config.label}. Click to change.`}
            className={cn("relative shrink-0 h-11 w-11", className)}
          >
            <Sun
              className={cn("h-4 w-4 transition-all duration-300", sunClass)}
              aria-hidden="true"
            />
            <Moon
              className={cn("absolute h-4 w-4 transition-all duration-300", moonClass)}
              aria-hidden="true"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

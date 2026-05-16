"use client"

import { cn } from "@/lib/utils"
import type { TemperatureUnit } from "@/types/weather"

interface HeaderProps {
  unit: TemperatureUnit
  onUnitChange: (unit: TemperatureUnit) => void
  onSearch: (city: string) => void
  className?: string
}

/**
 * Header — Barra de navegación principal de WeatherBoard
 *
 * Contiene:
 * - Logo / nombre de la app
 * - SearchBar (componente a implementar en Sprint 3)
 * - Toggle de unidades °F / °C
 * - Toggle de tema (dark / light)
 *
 * TODO Sprint 3: Implementar SearchBar dentro del Header
 * TODO Sprint 5: Implementar ThemeToggle y UI completa
 */
export function Header({ unit, onUnitChange, onSearch, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            🌤️ WeatherBoard
          </span>
        </div>

        {/* SearchBar placeholder — Sprint 3 */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="h-9 w-full rounded-md border border-input bg-muted/50 px-3 flex items-center">
            <span className="text-sm text-muted-foreground">
              Search city... (Sprint 3)
            </span>
          </div>
        </div>

        {/* Controls placeholder — Sprint 5 */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground border border-border rounded px-2 py-1">
            {unit === "imperial" ? "°F" : "°C"}
          </span>
        </div>
      </div>
    </header>
  )
}

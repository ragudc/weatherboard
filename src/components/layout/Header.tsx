"use client"

import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/weather/SearchBar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { TemperatureUnit } from "@/types/weather"

interface HeaderProps {
  unit: TemperatureUnit
  onUnitChange: (unit: TemperatureUnit) => void
  onSearch: (city: string) => void
  isSearchLoading?: boolean
  currentCity?: string | null
  className?: string
}

/**
 * Header — Barra de navegación principal de WeatherBoard
 *
 * Layout responsive:
 * - Mobile: logo | toggle °F/°C (SearchBar debajo del header)
 * - md+: logo | SearchBar expandida | toggle °F/°C
 *
 * - ThemeToggle (Sun/Moon) con next-themes, default light
 */
export function Header({
  unit,
  onUnitChange,
  onSearch,
  isSearchLoading = false,
  currentCity,
  className,
}: HeaderProps) {
  const isImperial = unit === "imperial"

  const handleUnitToggle = (checked: boolean) => {
    onUnitChange(checked ? "metric" : "imperial")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* ─── Logo ────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xl select-none" aria-hidden="true">🌤️</span>
          <span className="text-base font-bold tracking-tight hidden xs:inline">
            WeatherBoard
          </span>
        </div>

        {/* ─── SearchBar (solo md+) ─────────────────────────────── */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchBar
            onSearch={onSearch}
            isLoading={isSearchLoading}
            defaultValue={currentCity ?? ""}
            className="w-full"
          />
        </div>

        {/* Spacer en mobile */}
        <div className="flex-1 md:hidden" />

        {/* ─── Separator ───────────────────────────────────────── */}
        <Separator orientation="vertical" className="h-6 hidden md:block" />

        {/* ─── Toggle °F / °C ──────────────────────────────────── */}
        <div
          className="flex shrink-0 items-center gap-2"
          role="group"
          aria-label="Temperature unit toggle"
        >
          <Label
            htmlFor="unit-toggle"
            className={cn(
              "text-sm font-medium cursor-pointer select-none",
              isImperial ? "text-foreground" : "text-muted-foreground"
            )}
          >
            °F
          </Label>
          <Switch
            id="unit-toggle"
            checked={!isImperial}
            onCheckedChange={handleUnitToggle}
            aria-label={`Switch to ${isImperial ? "Celsius" : "Fahrenheit"}`}
          />
          <Label
            htmlFor="unit-toggle"
            className={cn(
              "text-sm font-medium cursor-pointer select-none",
              !isImperial ? "text-foreground" : "text-muted-foreground"
            )}
          >
            °C
          </Label>
        </div>

        {/* ─── Separator + ThemeToggle ──────────────────────────── */}
        <Separator orientation="vertical" className="h-6" />
        <ThemeToggle />

      </div>

      {/* ─── SearchBar mobile (bajo el header) ───────────────────── */}
      <div className="md:hidden border-t border-border px-4 py-2">
        <SearchBar
          onSearch={onSearch}
          isLoading={isSearchLoading}
          defaultValue={currentCity ?? ""}
          className="w-full"
        />
      </div>
    </header>
  )
}

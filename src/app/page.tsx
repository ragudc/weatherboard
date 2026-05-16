"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import type { TemperatureUnit } from "@/types/weather"

/**
 * Home Page — Página principal de WeatherBoard
 *
 * Estructura de layout:
 * ┌─────────────────────────────────────┐
 * │  Header (sticky)                    │
 * ├─────────────────────────────────────┤
 * │  Hero: CurrentWeather (Sprint 3)    │
 * ├─────────────────────────────────────┤
 * │  WeatherStats (Sprint 3)            │
 * ├─────────────────────────────────────┤
 * │  HourlyForecast scroll (Sprint 4)   │
 * ├─────────────────────────────────────┤
 * │  Grid: DailyForecast │ AirQuality   │
 * │        (Sprint 4)    │ (Sprint 4)   │
 * ├─────────────────────────────────────┤
 * │  TemperatureChart (Sprint 4)        │
 * ├─────────────────────────────────────┤
 * │  WeatherAlerts (Sprint 4)           │
 * ├─────────────────────────────────────┤
 * │  Footer                             │
 * └─────────────────────────────────────┘
 */
export default function HomePage() {
  const [unit, setUnit] = useState<TemperatureUnit>("imperial")
  const [city, setCity] = useState<string>("New York")

  const handleSearch = (searchedCity: string) => {
    setCity(searchedCity)
  }

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    setUnit(newUnit)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Header ────────────────────────────────────────────── */}
      <Header
        unit={unit}
        onUnitChange={handleUnitChange}
        onSearch={handleSearch}
      />

      {/* ─── Main Content ───────────────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">

          {/* Estado vacío inicial */}
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <span className="text-6xl">🌤️</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Welcome to WeatherBoard
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-md">
              Real-time weather dashboard for US cities.
              Search for a city to get started.
            </p>
            <div className="mt-2 rounded-md bg-muted px-4 py-2">
              <p className="text-sm text-muted-foreground">
                📍 Current city:{" "}
                <span className="font-medium text-foreground">{city}</span>
                {" · "}
                <span className="font-medium text-foreground">
                  {unit === "imperial" ? "°F" : "°C"}
                </span>
              </p>
            </div>

            {/* Placeholders de componentes — se implementan en Sprints 3 y 4 */}
            <div className="w-full mt-8 grid gap-4">
              {[
                "CurrentWeather",
                "WeatherStats",
                "HourlyForecast",
                "DailyForecast",
                "TemperatureChart",
                "WeatherAlerts",
                "AirQuality",
              ].map((component) => (
                <div
                  key={component}
                  className="w-full rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    🚧 <span className="font-mono">{component}</span> —
                    implementation pending
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import { DEFAULT_TEMPERATURE_UNIT } from "@/lib/constants"
import type { TemperatureUnit } from "@/types/weather"

interface UseTemperatureUnitReturn {
  unit: TemperatureUnit
  toggleUnit: () => void
  setUnit: (unit: TemperatureUnit) => void
  isImperial: boolean
  unitLabel: "°F" | "°C"
  speedLabel: "mph" | "m/s"
}

/**
 * useTemperatureUnit — Gestión de la unidad de temperatura
 * Default: imperial (°F) para clientes de EEUU
 */
export function useTemperatureUnit(): UseTemperatureUnitReturn {
  const [unit, setUnitState] = useState<TemperatureUnit>(DEFAULT_TEMPERATURE_UNIT)

  const toggleUnit = useCallback(() => {
    setUnitState((prev) => (prev === "imperial" ? "metric" : "imperial"))
  }, [])

  const setUnit = useCallback((newUnit: TemperatureUnit) => {
    setUnitState(newUnit)
  }, [])

  return {
    unit,
    toggleUnit,
    setUnit,
    isImperial: unit === "imperial",
    unitLabel: unit === "imperial" ? "°F" : "°C",
    speedLabel: unit === "imperial" ? "mph" : "m/s",
  }
}

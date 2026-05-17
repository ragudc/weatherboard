"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import type { CurrentWeatherResponse } from "@/types/weather"

/**
 * Switches theme automatically when a new city is loaded.
 * Day at the searched city → light mode; Night → dark mode.
 * User can override manually via ThemeToggle at any time.
 * Re-applies on next city change.
 */
export function useAutoTheme(current: CurrentWeatherResponse | null): void {
  const { setTheme } = useTheme()
  const lastCityRef  = useRef<string | null>(null)

  useEffect(() => {
    if (!current) return

    const cityKey = `${current.coord.lat},${current.coord.lon}`
    if (cityKey === lastCityRef.current) return
    lastCityRef.current = cityKey

    const now     = Math.floor(Date.now() / 1000)
    const isNight = now < current.sys.sunrise || now > current.sys.sunset

    setTheme(isNight ? "dark" : "light")
  }, [current, setTheme])
}

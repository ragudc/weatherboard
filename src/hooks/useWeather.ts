"use client"

import { useState, useCallback } from "react"
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  TemperatureUnit,
} from "@/types/weather"

interface WeatherData {
  current: CurrentWeatherResponse | null
  forecast: ForecastResponse | null
  airPollution: AirPollutionResponse | null
}

interface UseWeatherReturn {
  data: WeatherData
  isLoading: boolean
  error: string | null
  fetchWeather: (city: string) => Promise<void>
  clearError: () => void
}

const initialData: WeatherData = {
  current: null,
  forecast: null,
  airPollution: null,
}

/**
 * useWeather — Hook principal de consumo de la API del clima
 * Realiza 3 peticiones paralelas: current, forecast y air pollution
 * Consume SOLO los endpoints internos de Next.js (/api/weather)
 */
export function useWeather(unit: TemperatureUnit = "imperial"): UseWeatherReturn {
  const [data, setData] = useState<WeatherData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(
    async (city: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const baseParams = new URLSearchParams({ city, unit })

        // Peticiones 1 y 2 en paralelo (current + forecast)
        const [currentRes, forecastRes] = await Promise.all([
          fetch(`/api/weather?${baseParams}&type=current`),
          fetch(`/api/weather?${baseParams}&type=forecast`),
        ])

        if (!currentRes.ok) {
          const err = await currentRes.json()
          throw new Error(err.error ?? "Failed to fetch current weather")
        }
        if (!forecastRes.ok) {
          const err = await forecastRes.json()
          throw new Error(err.error ?? "Failed to fetch forecast")
        }

        const current: CurrentWeatherResponse = await currentRes.json()
        const forecast: ForecastResponse = await forecastRes.json()

        // Petición 3: air pollution (requiere coordenadas del resultado anterior)
        const airParams = new URLSearchParams({
          type: "air",
          lat: String(current.coord.lat),
          lon: String(current.coord.lon),
          city,
        })

        const airRes = await fetch(`/api/weather?${airParams}`)
        const airPollution: AirPollutionResponse | null = airRes.ok
          ? await airRes.json()
          : null

        setData({ current, forecast, airPollution })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred"
        setError(message)
        setData(initialData)
      } finally {
        setIsLoading(false)
      }
    },
    [unit]
  )

  const clearError = useCallback(() => setError(null), [])

  return { data, isLoading, error, fetchWeather, clearError }
}

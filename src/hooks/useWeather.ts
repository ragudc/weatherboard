"use client"

import { useState, useCallback, useRef } from "react"
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
  currentCity: string | null
  fetchWeather: (city: string) => Promise<void>
  refetch: () => Promise<void>
  clearError: () => void
  clearData: () => void
}

const INITIAL_DATA: WeatherData = {
  current: null,
  forecast: null,
  airPollution: null,
}

/**
 * useWeather — Hook principal de consumo del API del clima
 *
 * Features:
 * - Peticiones paralelas con Promise.all (current + forecast)
 * - Air pollution en serie (requiere coords del current)
 * - refetch(): re-ejecuta la última búsqueda (útil al cambiar unidad)
 * - clearData(): limpia el estado para volver al EmptyState
 * - currentCity: ciudad actualmente cargada (para refetch)
 */
export function useWeather(unit: TemperatureUnit = "imperial"): UseWeatherReturn {
  const [data, setData] = useState<WeatherData>(INITIAL_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentCity, setCurrentCity] = useState<string | null>(null)

  // Ref para leer el unit más reciente dentro de fetchWeather sin recrearlo
  const unitRef = useRef(unit)
  unitRef.current = unit

  const fetchWeather = useCallback(async (city: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const baseParams = new URLSearchParams({
        city,
        unit: unitRef.current,
      })

      // Peticiones 1 y 2 en paralelo
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

      // Petición 3: air pollution (requiere coords del current)
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
      setCurrentCity(city)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
      setData(INITIAL_DATA)
    } finally {
      setIsLoading(false)
    }
  }, []) // Sin dependencias: usa unitRef para leer unit actualizado

  /**
   * refetch — Re-ejecuta la búsqueda de la ciudad actual con la unidad vigente
   * Se llama automáticamente cuando el usuario cambia °F ↔ °C
   */
  const refetch = useCallback(async () => {
    if (currentCity) await fetchWeather(currentCity)
  }, [currentCity, fetchWeather])

  const clearError = useCallback(() => setError(null), [])

  const clearData = useCallback(() => {
    setData(INITIAL_DATA)
    setCurrentCity(null)
    setError(null)
  }, [])

  return {
    data,
    isLoading,
    error,
    currentCity,
    fetchWeather,
    refetch,
    clearError,
    clearData,
  }
}

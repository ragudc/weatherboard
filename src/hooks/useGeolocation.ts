"use client"

import { useState, useEffect } from "react"
import type { GeocodingResult } from "@/types/weather"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  city: string | null
  country: string | null
  isLoading: boolean
  error: string | null
  isSupported: boolean
}

const GEO_ERROR_MESSAGES: Record<number, string> = {
  1: "Location access denied. Please allow location access or search manually.",
  2: "Location unavailable. Please search for a city manually.",
  3: "Location request timed out. Please try again.",
}

/**
 * useGeolocation — Detecta la ubicación del navegador y resuelve el nombre de ciudad
 * Flujo: navigator.geolocation → coords → /api/weather?type=geocode → city name
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    isLoading: false,
    error: null,
    isSupported: false,
  })

  useEffect(() => {
    const isSupported = "geolocation" in navigator
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        isSupported: false,
        error: "Geolocation is not supported by your browser.",
      }))
      return
    }

    setState((prev) => ({ ...prev, isSupported: true, isLoading: true }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const params = new URLSearchParams({
            type: "geocode",
            lat: String(latitude),
            lon: String(longitude),
          })
          const res = await fetch(`/api/weather?${params}`)

          if (!res.ok) throw new Error("Geocoding failed")

          const geo: GeocodingResult = await res.json()

          setState({
            latitude,
            longitude,
            city: geo.name,
            country: geo.country,
            isLoading: false,
            error: null,
            isSupported: true,
          })
        } catch {
          // Geocoding failure is non-critical — coords are still available
          setState({
            latitude,
            longitude,
            city: null,
            country: null,
            isLoading: false,
            error: null,
            isSupported: true,
          })
        }
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: GEO_ERROR_MESSAGES[error.code] ?? "An unknown location error occurred.",
        }))
      },
      { timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  return state
}

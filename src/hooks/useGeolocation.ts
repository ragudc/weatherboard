"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  city: string | null
  isLoading: boolean
  error: string | null
  isSupported: boolean
}

/**
 * useGeolocation — Obtiene la ubicación del navegador
 * Usa navigator.geolocation (solo funciona en Client Components con HTTPS)
 * TODO Sprint 3: Integrar reverse geocoding para obtener nombre de ciudad
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: null,
    isLoading: false,
    error: null,
    isSupported: false,
  })

  useEffect(() => {
    const isSupported = "geolocation" in navigator
    setState((prev) => ({ ...prev, isSupported }))

    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: null, // Se resolverá con reverse geocoding en Sprint 3
          isLoading: false,
          error: null,
          isSupported: true,
        })
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Location access denied. Please allow location access or search manually.",
          2: "Location unavailable. Please search for a city manually.",
          3: "Location request timed out. Please try again.",
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: messages[error.code] ?? "An unknown location error occurred.",
        }))
      },
      { timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  return state
}

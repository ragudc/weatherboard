# Skill: Consumo de Endpoints API

## Arquitectura de API en WeatherBoard

```
Componente React (Client)
        ↓  fetch()
/api/weather/route.ts  (Next.js API Route — servidor)
        ↓  fetch() con API key segura
OpenWeatherMap API (externo)
```

## Endpoints internos disponibles

| Método | URL | Parámetros | Descripción |
|---|---|---|---|
| GET | `/api/weather` | `city`, `unit`, `type=current` | Clima actual |
| GET | `/api/weather` | `city`, `unit`, `type=forecast` | Pronóstico 5 días |
| GET | `/api/weather` | `lat`, `lon`, `type=air` | Calidad del aire |

## Patrones por método HTTP

### GET — Lectura de datos (clima, forecast, AQI)
```tsx
const fetchWeather = async (city: string, unit: TemperatureUnit) => {
  const params = new URLSearchParams({ city, unit, type: "current" })
  const response = await fetch(`/api/weather?${params}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "Failed to fetch weather data")
  }

  return response.json() as Promise<CurrentWeatherResponse>
}
```

### GET — En Server Components (sin useEffect)
```tsx
import { getCurrentWeather } from "@/lib/api/openweathermap"

export default async function WeatherPage() {
  const data = await getCurrentWeather("New York", "imperial")
  return <CurrentWeather data={data} />
}
```

### POST — Patrón para futuros endpoints internos
```tsx
const postData = async <T>(endpoint: string, body: unknown): Promise<T> => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "POST request failed")
  }

  return response.json() as Promise<T>
}
```

### PUT — Patrón para actualización de recursos
```tsx
const putData = async <T>(endpoint: string, id: string, body: unknown): Promise<T> => {
  const response = await fetch(`${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "PUT request failed")
  }

  return response.json() as Promise<T>
}
```

### DELETE — Patrón para eliminación de recursos
```tsx
const deleteData = async (endpoint: string, id: string): Promise<void> => {
  const response = await fetch(`${endpoint}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? "DELETE request failed")
  }
}
```

## Hook personalizado para consumo en Client Components
```tsx
// src/hooks/useWeather.ts
import { useState, useCallback } from "react"
import { CurrentWeatherResponse, TemperatureUnit } from "@/types/weather"

interface UseWeatherReturn {
  data: CurrentWeatherResponse | null
  isLoading: boolean
  error: string | null
  fetchWeather: (city: string) => Promise<void>
}

export const useWeather = (unit: TemperatureUnit = "imperial"): UseWeatherReturn => {
  const [data, setData] = useState<CurrentWeatherResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(async (city: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ city, unit, type: "current" })
      const response = await fetch(`/api/weather?${params}`)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? "Unknown error")
      }
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setIsLoading(false)
    }
  }, [unit])

  return { data, isLoading, error, fetchWeather }
}
```

## Manejo de estados en la UI

Todo consumo de API debe manejar los 4 estados posibles:
```tsx
// ✅ Patrón completo obligatorio
if (isLoading) return <WeatherCardSkeleton />
if (error) return <ErrorState message={error} />
if (!data) return <EmptyState />
return <WeatherCard data={data} />
```

## Caché y revalidación
- Los fetches del servidor usan `next: { revalidate: 3600 }` (1 hora)
- Los fetches del cliente no necesitan configuración de caché adicional
- Nunca uses `cache: "no-store"` a menos que el dato deba ser en tiempo real

// ─── OpenWeatherMap ───────────────────────────────────────────────
export const OWM_BASE_URL = "https://api.openweathermap.org"

// ─── Endpoints utilizados (plan Free) ────────────────────────────
export const OWM_ENDPOINTS = {
  currentWeather: "/data/2.5/weather",
  forecast: "/data/2.5/forecast",
  airPollution: "/data/2.5/air_pollution",
} as const

// ─── Ciudades destacadas de EEUU (búsquedas rápidas) ─────────────
export const US_FEATURED_CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Miami",
  "San Francisco",
  "Seattle",
  "Denver",
  "Austin",
  "Boston",
] as const

// ─── Configuración de caché (segundos) ───────────────────────────
export const CACHE_REVALIDATE_SECONDS = 3600 // 1 hora

// ─── Unidad de temperatura por defecto para clientes de EEUU ─────
export const DEFAULT_TEMPERATURE_UNIT = "imperial" as const

// ─── Labels del índice de calidad del aire (AQI) ─────────────────
export const AQI_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
}

import {
  AirPollutionResponse,
  CurrentWeatherResponse,
  ForecastResponse,
  TemperatureUnit,
  WeatherApiError,
} from "@/types/weather"
import { CACHE_REVALIDATE_SECONDS, OWM_BASE_URL, OWM_ENDPOINTS } from "@/lib/constants"

// ─── Validación de API key en tiempo de ejecución ────────────────
const getApiKey = (): string => {
  const key = process.env.OPENWEATHERMAP_API_KEY
  if (!key) {
    throw new Error(
      "OPENWEATHERMAP_API_KEY is not defined in environment variables"
    )
  }
  return key
}

// ─── Helper: construir URL con query params ───────────────────────
const buildUrl = (
  endpoint: string,
  params: Record<string, string | number>
): string => {
  const url = new URL(`${OWM_BASE_URL}${endpoint}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })
  return url.toString()
}

// ─── Helper: fetch con manejo de errores tipado ───────────────────
const fetchFromOWM = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = data as WeatherApiError
    throw new Error(
      `OpenWeatherMap API error [${error.cod}]: ${error.message}`
    )
  }

  return data as T
}

// ─── Endpoint 1: Clima actual por nombre de ciudad ───────────────
export const getCurrentWeather = async (
  city: string,
  unit: TemperatureUnit = "imperial"
): Promise<CurrentWeatherResponse> => {
  const apiKey = getApiKey()
  const url = buildUrl(OWM_ENDPOINTS.currentWeather, {
    q: city,
    appid: apiKey,
    units: unit,
  })
  return fetchFromOWM<CurrentWeatherResponse>(url)
}

// ─── Endpoint 2: Pronóstico 5 días por nombre de ciudad ──────────
export const getForecast = async (
  city: string,
  unit: TemperatureUnit = "imperial"
): Promise<ForecastResponse> => {
  const apiKey = getApiKey()
  const url = buildUrl(OWM_ENDPOINTS.forecast, {
    q: city,
    appid: apiKey,
    units: unit,
    cnt: 40, // máximo permitido en plan Free (5 días × 8 intervalos)
  })
  return fetchFromOWM<ForecastResponse>(url)
}

// ─── Endpoint 3: Calidad del aire por coordenadas ────────────────
export const getAirPollution = async (
  lat: number,
  lon: number
): Promise<AirPollutionResponse> => {
  const apiKey = getApiKey()
  const url = buildUrl(OWM_ENDPOINTS.airPollution, {
    lat,
    lon,
    appid: apiKey,
  })
  return fetchFromOWM<AirPollutionResponse>(url)
}

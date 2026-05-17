import type { TemperatureUnit, ForecastItem } from "@/types/weather"

// ─── Temperatura ──────────────────────────────────────────────────

/**
 * Formatea una temperatura con su unidad
 * @example formatTemperature(72.4, "imperial") → "72°F"
 */
export const formatTemperature = (
  temp: number,
  unit: TemperatureUnit
): string => {
  const rounded = Math.round(temp)
  return unit === "imperial" ? `${rounded}°F` : `${rounded}°C`
}

/**
 * Formatea un rango de temperatura (min/max)
 * @example formatTempRange(65, 80, "imperial") → "65°F / 80°F"
 */
export const formatTempRange = (
  min: number,
  max: number,
  unit: TemperatureUnit
): string => {
  const u = unit === "imperial" ? "°F" : "°C"
  return `${Math.round(min)}${u} / ${Math.round(max)}${u}`
}

// ─── Viento ───────────────────────────────────────────────────────

/**
 * Formatea la velocidad del viento con su unidad
 * @example formatWindSpeed(15, "imperial") → "15 mph"
 */
export const formatWindSpeed = (
  speed: number,
  unit: TemperatureUnit
): string => {
  const rounded = Math.round(speed)
  return unit === "imperial" ? `${rounded} mph` : `${rounded} m/s`
}

const WIND_DIRECTIONS = [
  "N", "NNE", "NE", "ENE",
  "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW",
  "W", "WNW", "NW", "NNW",
] as const

/**
 * Convierte grados de viento a dirección cardinal
 * @example getWindDirection(225) → "SW"
 */
export const getWindDirection = (deg: number): string => {
  const index = Math.round(deg / 22.5) % 16
  return WIND_DIRECTIONS[index]
}

// ─── Fechas y Horas ───────────────────────────────────────────────

/**
 * Formatea timestamp Unix a hora local con timezone offset
 * @example formatTime(1716000000, -18000) → "3:45 PM"
 */
export const formatTime = (
  timestamp: number,
  timezoneOffset: number
): string => {
  const localMs = (timestamp + timezoneOffset) * 1000
  const date = new Date(localMs)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  })
}

/**
 * Formatea timestamp a solo la hora (para forecast horario)
 * @example formatHour(1716000000, -18000) → "3 PM"
 */
export const formatHour = (
  timestamp: number,
  timezoneOffset: number
): string => {
  const localMs = (timestamp + timezoneOffset) * 1000
  return new Date(localMs).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: "UTC",
  })
}

/**
 * Formatea timestamp a día de la semana abreviado
 * @example formatDay(1716000000) → "Mon"
 */
export const formatDay = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
  })
}

/**
 * Formatea timestamp a fecha larga
 * @example formatFullDate(1716000000) → "Monday, May 18"
 */
export const formatFullDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

/**
 * Formatea timestamp a fecha corta
 * @example formatShortDate(1716000000) → "May 18"
 */
export const formatShortDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

// ─── Condiciones climáticas ───────────────────────────────────────

/**
 * Determina si es de noche basado en el timestamp actual y sunrise/sunset
 */
export const isNightTime = (
  dt: number,
  sunrise: number,
  sunset: number
): boolean => dt < sunrise || dt > sunset

/**
 * Retorna la clase CSS variable de color para la condición climática
 * Usar como: style={{ color: `hsl(var(${getWeatherColorVar(condition)}))` }}
 */
export const getWeatherColorVar = (
  condition: string,
  isNight: boolean
): string => {
  if (isNight) return "--weather-night"
  const map: Record<string, string> = {
    Clear:        "--weather-sunny",
    Clouds:       "--weather-cloudy",
    Rain:         "--weather-rainy",
    Drizzle:      "--weather-rainy",
    Thunderstorm: "--weather-stormy",
    Snow:         "--weather-snowy",
    Mist:         "--weather-foggy",
    Fog:          "--weather-foggy",
    Haze:         "--weather-foggy",
    Smoke:        "--weather-foggy",
    Dust:         "--weather-foggy",
    Sand:         "--weather-foggy",
    Ash:          "--weather-foggy",
    Squall:       "--weather-stormy",
    Tornado:      "--weather-stormy",
  }
  return map[condition] ?? "--weather-cloudy"
}

// ─── Visibilidad y presión ────────────────────────────────────────

/**
 * Formatea visibilidad de metros a kilómetros
 * @example formatVisibility(10000) → "10 km"
 */
export const formatVisibility = (meters: number): string => {
  const km = meters / 1000
  return km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`
}

/**
 * Formatea presión atmosférica
 * @example formatPressure(1013) → "1,013 hPa"
 */
export const formatPressure = (hPa: number): string => {
  return `${hPa.toLocaleString("en-US")} hPa`
}

// ─── Probabilidad de precipitación ───────────────────────────────

/**
 * Convierte la probabilidad de precipitación (0-1) a porcentaje legible
 * @example formatPrecipitation(0.75) → "75%"
 */
export const formatPrecipitation = (pop: number): string => {
  return `${Math.round(pop * 100)}%`
}

// ─── Índice UV ────────────────────────────────────────────────────

type UvLevel = "Low" | "Moderate" | "High" | "Very High" | "Extreme"

/**
 * Clasifica el índice UV en nivel de riesgo
 */
export const getUvLevel = (uvi: number): UvLevel => {
  if (uvi <= 2)  return "Low"
  if (uvi <= 5)  return "Moderate"
  if (uvi <= 7)  return "High"
  if (uvi <= 10) return "Very High"
  return "Extreme"
}

// ─── Agrupación de datos de forecast ─────────────────────────────

interface DailySummary {
  dt: number
  condition: string
  description: string
  icon: string
  tempMax: number
  tempMin: number
  pop: number
}

/**
 * Agrupa los items del forecast (3h) por día y extrae resumen diario
 * Retorna máximo 5 días
 */
export const groupForecastByDay = (
  items: ForecastItem[]
): DailySummary[] => {
  const dayMap = new Map<string, ForecastItem[]>()

  items.forEach((item) => {
    const day = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    })
    if (!dayMap.has(day)) dayMap.set(day, [])
    dayMap.get(day)!.push(item)
  })

  return Array.from(dayMap.entries())
    .slice(0, 5)
    .map(([, dayItems]) => {
      const temps = dayItems.map((i) => i.main.temp)
      const midday = dayItems[Math.floor(dayItems.length / 2)]
      return {
        dt: midday.dt,
        condition: midday.weather[0]?.main ?? "Clear",
        description: midday.weather[0]?.description ?? "",
        icon: midday.weather[0]?.icon ?? "01d",
        tempMax: Math.max(...temps),
        tempMin: Math.min(...temps),
        pop: Math.max(...dayItems.map((i) => i.pop)),
      }
    })
}

// ─── Feels Like Label ─────────────────────────────────────────────

/**
 * Interpreta la sensación térmica en una etiqueta descriptiva en inglés
 * @example getFeelsLikeLabel(95, "imperial") → "Extremely Hot"
 */
export const getFeelsLikeLabel = (
  feelsLike: number,
  unit: TemperatureUnit
): string => {
  // Normalizar a Fahrenheit para comparación
  const f = unit === "imperial" ? feelsLike : (feelsLike * 9) / 5 + 32

  if (f <= 32)  return "Freezing"
  if (f <= 49)  return "Cold"
  if (f <= 59)  return "Cool"
  if (f <= 69)  return "Comfortable"
  if (f <= 79)  return "Warm"
  if (f <= 89)  return "Hot"
  if (f <= 99)  return "Very Hot"
  return "Extremely Hot"
}

// ─── Fecha local de la ciudad ─────────────────────────────────────

/**
 * Formatea la fecha actual en el timezone de la ciudad consultada
 * @param timezoneOffset - Offset en segundos desde UTC (viene de data.timezone)
 * @example formatCityDate(-18000) → "Monday, May 18"
 */
export const formatCityDate = (timezoneOffset: number): string => {
  const utcNow = Math.floor(Date.now() / 1000)
  const cityLocalMs = (utcNow + timezoneOffset) * 1000
  return new Date(cityLocalMs).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

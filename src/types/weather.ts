// ─── Coordenadas geográficas ──────────────────────────────────────
export interface Coordinates {
  lat: number
  lon: number
}

// ─── Condición climática ──────────────────────────────────────────
export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

// ─── Respuesta: Clima actual (/data/2.5/weather) ──────────────────
export interface CurrentWeatherResponse {
  coord: Coordinates
  weather: WeatherCondition[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  name: string
  cod: number
}

// ─── Item individual del pronóstico (/data/2.5/forecast) ─────────
export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: WeatherCondition[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility: number
  pop: number
  dt_txt: string
}

// ─── Respuesta: Pronóstico 5 días (/data/2.5/forecast) ───────────
export interface ForecastResponse {
  cod: string
  cnt: number
  list: ForecastItem[]
  city: {
    id: number
    name: string
    coord: Coordinates
    country: string
    timezone: number
    sunrise: number
    sunset: number
  }
}

// ─── Item de calidad del aire (/data/2.5/air_pollution) ──────────
export interface AirPollutionItem {
  dt: number
  main: {
    aqi: 1 | 2 | 3 | 4 | 5
  }
  components: {
    co: number
    no: number
    no2: number
    o3: number
    so2: number
    pm2_5: number
    pm10: number
    nh3: number
  }
}

// ─── Respuesta: Calidad del aire (/data/2.5/air_pollution) ───────
export interface AirPollutionResponse {
  coord: Coordinates
  list: AirPollutionItem[]
}

// ─── Tipo unión de errores de la API ─────────────────────────────
export interface WeatherApiError {
  cod: string | number
  message: string
}

// ─── Unidades de temperatura ──────────────────────────────────────
export type TemperatureUnit = "imperial" | "metric"
// imperial → °F, mph (default para US)
// metric   → °C, km/h

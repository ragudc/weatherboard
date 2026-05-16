import { NextRequest, NextResponse } from "next/server"
import {
  getCurrentWeather,
  getForecast,
  getAirPollution,
} from "@/lib/api/openweathermap"
import { TemperatureUnit } from "@/types/weather"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const city = searchParams.get("city")
  const unit = (searchParams.get("unit") as TemperatureUnit) ?? "imperial"
  const type = searchParams.get("type") ?? "current"

  // ─── Validación de parámetros requeridos ───────────────────────
  if (!city) {
    return NextResponse.json(
      { error: "Query parameter 'city' is required" },
      { status: 400 }
    )
  }

  try {
    // ─── Rama 1: clima actual ─────────────────────────────────────
    if (type === "current") {
      const data = await getCurrentWeather(city, unit)
      return NextResponse.json(data)
    }

    // ─── Rama 2: pronóstico 5 días ────────────────────────────────
    if (type === "forecast") {
      const data = await getForecast(city, unit)
      return NextResponse.json(data)
    }

    // ─── Rama 3: calidad del aire (requiere coordenadas) ──────────
    if (type === "air") {
      const lat = searchParams.get("lat")
      const lon = searchParams.get("lon")

      if (!lat || !lon) {
        return NextResponse.json(
          { error: "Parameters 'lat' and 'lon' are required for air pollution data" },
          { status: 400 }
        )
      }

      const data = await getAirPollution(parseFloat(lat), parseFloat(lon))
      return NextResponse.json(data)
    }

    // ─── Tipo no reconocido ───────────────────────────────────────
    return NextResponse.json(
      { error: `Unknown type '${type}'. Valid values: current | forecast | air` },
      { status: 400 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

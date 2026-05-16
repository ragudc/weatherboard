import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { CurrentWeatherResponse, TemperatureUnit } from "@/types/weather"

interface WeatherStatsProps {
  data: CurrentWeatherResponse
  unit: TemperatureUnit
  className?: string
}

export function WeatherStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-7 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * WeatherStats — Estadísticas secundarias del clima
 * Muestra: humedad, viento, sensación térmica, visibilidad
 * TODO Sprint 3: Implementar UI completa con iconos Lucide
 */
export function WeatherStats({ data, unit, className }: WeatherStatsProps) {
  const speedUnit = unit === "imperial" ? "mph" : "m/s"
  const visibilityKm = (data.visibility / 1000).toFixed(1)

  const stats = [
    { label: "Humidity",   value: `${data.main.humidity}%` },
    { label: "Wind Speed", value: `${Math.round(data.wind.speed)} ${speedUnit}` },
    { label: "Feels Like", value: `${Math.round(data.main.feels_like)}${unit === "imperial" ? "°F" : "°C"}` },
    { label: "Visibility", value: `${visibilityKm} km` },
  ]

  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {stats.map(({ label, value }) => (
        <Card key={label}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="mt-1 text-lg font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

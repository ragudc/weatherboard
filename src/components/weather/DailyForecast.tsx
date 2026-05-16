import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ForecastResponse, TemperatureUnit } from "@/types/weather"

interface DailyForecastProps {
  data: ForecastResponse
  unit: TemperatureUnit
  className?: string
}

export function DailyForecastSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </CardContent>
    </Card>
  )
}

/**
 * DailyForecast — Pronóstico de 5 días
 * Agrupa los intervalos de 3h y extrae el resumen diario
 * TODO Sprint 4: Implementar con WeatherIcon, min/max temp y probabilidad de lluvia
 */
export function DailyForecast({ data, unit, className }: DailyForecastProps) {
  const unitLabel = unit === "imperial" ? "°F" : "°C"

  // Tomar un item representativo por día (cada 8 intervalos de 3h = 24h)
  const dailyItems = data.list.filter((_, index) => index % 8 === 0).slice(0, 5)

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-base">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {dailyItems.map((item) => (
          <div
            key={item.dt}
            className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
          >
            <span className="text-sm font-medium w-20">
              {new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="text-base">🌡️</span>
            <span className="text-sm text-muted-foreground capitalize truncate flex-1 px-3">
              {item.weather[0]?.description}
            </span>
            <span className="text-sm font-semibold">
              {Math.round(item.main.temp_max)}{unitLabel}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

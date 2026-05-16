import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ForecastResponse, TemperatureUnit } from "@/types/weather"

interface HourlyForecastProps {
  data: ForecastResponse
  unit: TemperatureUnit
  className?: string
}

export function HourlyForecastSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-16 shrink-0 rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * HourlyForecast — Pronóstico por horas (scroll horizontal)
 * Muestra los primeros 8 intervalos de 3 horas (24 horas)
 * TODO Sprint 4: Implementar cards con hora, icono y temperatura
 */
export function HourlyForecast({ data, unit, className }: HourlyForecastProps) {
  const hourlyItems = data.list.slice(0, 8)
  const unitLabel = unit === "imperial" ? "°F" : "°C"

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-base">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Scroll horizontal — overflow SOLO en este contenedor */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-2">
            {hourlyItems.map((item) => (
              <div
                key={item.dt}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-center"
              >
                <span className="text-xs text-muted-foreground">
                  {new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })}
                </span>
                <span className="text-xl">🌡️</span>
                <span className="text-sm font-medium">
                  {Math.round(item.main.temp)}{unitLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

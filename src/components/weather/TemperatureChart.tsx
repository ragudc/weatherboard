"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ForecastResponse, TemperatureUnit } from "@/types/weather"

interface TemperatureChartProps {
  data: ForecastResponse
  unit: TemperatureUnit
  className?: string
}

export function TemperatureChartSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 md:h-64 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

/**
 * TemperatureChart — Gráfica de línea de temperatura (24h)
 * Usa Recharts: AreaChart con gradiente y tooltip custom
 * TODO Sprint 4: Implementar con Recharts AreaChart + eje X de horas
 */
export function TemperatureChart({ data, unit, className }: TemperatureChartProps) {
  const unitLabel = unit === "imperial" ? "°F" : "°C"
  const items = data.list.slice(0, 8)

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-base">
          Temperature Trend · Next 24h ({unitLabel})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 md:h-64 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              📊 Recharts AreaChart
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {items.length} data points · Implementation: Sprint 4
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

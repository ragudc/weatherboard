import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AQI_LABELS } from "@/lib/constants"
import type { AirPollutionResponse } from "@/types/weather"

interface AirQualityProps {
  data: AirPollutionResponse
  className?: string
}

export function AirQualitySkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-20 mb-3" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const aqiBadgeVariant: Record<
  1 | 2 | 3 | 4 | 5,
  "default" | "secondary" | "outline" | "destructive"
> = {
  1: "default",
  2: "secondary",
  3: "outline",
  4: "destructive",
  5: "destructive",
}

/**
 * AirQuality — Índice de Calidad del Aire (AQI)
 * TODO Sprint 4: Agregar barra de progreso visual del AQI y desglose de componentes
 */
export function AirQuality({ data, className }: AirQualityProps) {
  const latest = data.list[0]
  if (!latest) return null

  const aqi = latest.main.aqi
  const label = AQI_LABELS[aqi]
  const variant = aqiBadgeVariant[aqi]
  const { pm2_5, pm10, o3, no2 } = latest.components

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-base">Air Quality</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">{aqi}</span>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: "PM2.5", value: `${pm2_5.toFixed(1)} μg/m³` },
            { label: "PM10",  value: `${pm10.toFixed(1)} μg/m³` },
            { label: "O₃",   value: `${o3.toFixed(1)} μg/m³` },
            { label: "NO₂",  value: `${no2.toFixed(1)} μg/m³` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded bg-muted/30 px-2 py-1">
              <span className="text-xs text-muted-foreground">{label}: </span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

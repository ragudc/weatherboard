import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WeatherIcon } from "@/components/weather/WeatherIcon"
import { cn } from "@/lib/utils"
import type { CurrentWeatherResponse, TemperatureUnit } from "@/types/weather"

interface CurrentWeatherProps {
  data: CurrentWeatherResponse
  unit: TemperatureUnit
  className?: string
}

export function CurrentWeatherSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-48" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * CurrentWeather — Card del clima actual
 * TODO Sprint 3: Implementar UI completa con temperatura, condición, ciudad
 * TODO Sprint 5: Agregar fondo dinámico según condición climática
 */
export function CurrentWeather({ data, unit, className }: CurrentWeatherProps) {
  const condition = data.weather[0]?.main ?? "Clear"
  const description = data.weather[0]?.description ?? ""
  const temp = Math.round(data.main.temp)
  const unitLabel = unit === "imperial" ? "°F" : "°C"
  const isNight =
    Date.now() / 1000 > data.sys.sunset || Date.now() / 1000 < data.sys.sunrise

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center">
        <WeatherIcon condition={condition} isNight={isNight} size="xl" />
        <div className="flex flex-col gap-1">
          <h2 className="text-5xl font-bold tracking-tight">
            {temp}{unitLabel}
          </h2>
          <p className="text-lg capitalize text-muted-foreground">{description}</p>
          <p className="text-xl font-semibold">
            {data.name},{" "}
            <span className="text-muted-foreground">{data.sys.country}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

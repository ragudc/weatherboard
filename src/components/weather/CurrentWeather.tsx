import { motion } from "framer-motion"
import { MapPin, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { WeatherIcon } from "@/components/weather/WeatherIcon"
import { cn } from "@/lib/utils"
import {
  formatTemperature,
  formatCityDate,
  formatTime,
  isNightTime,
  getWeatherColorVar,
  getFeelsLikeLabel,
} from "@/lib/weather-utils"
import type { CurrentWeatherResponse, TemperatureUnit } from "@/types/weather"

// ─── Skeleton ─────────────────────────────────────────────────────

export function CurrentWeatherSkeleton() {
  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          {/* Icono placeholder */}
          <Skeleton className="mx-auto h-28 w-28 rounded-full md:mx-0 md:shrink-0" />

          {/* Texto placeholder */}
          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-16 w-48" />
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-3 mt-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          {/* Stats placeholder */}
          <div className="hidden md:flex flex-col gap-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Animación de entrada del hero ────────────────────────────────

const heroVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
}

// ─── Componente principal ─────────────────────────────────────────

interface CurrentWeatherProps {
  data: CurrentWeatherResponse
  unit: TemperatureUnit
  className?: string
}

export function CurrentWeather({ data, unit, className }: CurrentWeatherProps) {
  const now        = Math.floor(Date.now() / 1000)
  const condition  = data.weather[0]?.main        ?? "Clear"
  const desc       = data.weather[0]?.description ?? ""
  const night      = isNightTime(now, data.sys.sunrise, data.sys.sunset)
  const colorVar   = getWeatherColorVar(condition, night)
  const feelsLabel = getFeelsLikeLabel(data.main.feels_like, unit)

  const cityDate = formatCityDate(data.timezone)
  const cityTime = formatTime(now, data.timezone)

  return (
    <motion.div
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full", className)}
    >
      <Card
        className="w-full overflow-hidden relative"
        style={{
          background: `radial-gradient(ellipse at top left,
            color-mix(in oklch, var(${colorVar}) 13%, transparent) 0%,
            transparent 65%)`,
        }}
      >
        <CardContent className="p-5 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">

            {/* ── Icono animado ───────────────────────────────────── */}
            <div className="flex justify-center md:justify-start md:shrink-0">
              <WeatherIcon
                condition={condition}
                isNight={night}
                size="xl"
                animated
              />
            </div>

            {/* ── Temperatura y condición (bloque central) ────────── */}
            <div className="flex flex-col items-center gap-1 md:items-start md:flex-1">

              {/* Ciudad + país */}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">
                  {data.name},&nbsp;{data.sys.country}
                </span>
              </div>

              {/* Temperatura principal */}
              <p
                className="text-6xl xs:text-7xl md:text-8xl font-extrabold tracking-tighter leading-none"
                style={{ color: `var(${colorVar})` }}
                aria-label={`Current temperature: ${formatTemperature(data.main.temp, unit)}`}
              >
                {formatTemperature(data.main.temp, unit)}
              </p>

              {/* Condición */}
              <p className="text-lg md:text-xl capitalize font-medium text-foreground/80">
                {desc}
              </p>

              {/* Feels like */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  Feels like{" "}
                  <strong className="text-foreground">
                    {formatTemperature(data.main.feels_like, unit)}
                  </strong>
                </span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {feelsLabel}
                </Badge>
              </div>

              {/* Hi / Lo */}
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <ArrowUp className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                  <span aria-label={`High: ${formatTemperature(data.main.temp_max, unit)}`}>
                    {formatTemperature(data.main.temp_max, unit)}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <ArrowDown className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span aria-label={`Low: ${formatTemperature(data.main.temp_min, unit)}`}>
                    {formatTemperature(data.main.temp_min, unit)}
                  </span>
                </span>
              </div>
            </div>

            {/* ── Fecha y hora local de la ciudad ─────────────────── */}
            <div className="hidden md:flex flex-col items-end gap-1 shrink-0 text-right">
              <p className="text-sm text-muted-foreground">{cityDate}</p>
              <p className="text-2xl font-semibold tabular-nums">{cityTime}</p>
              <p className="text-xs text-muted-foreground">
                {night ? "🌙 Night" : "☀️ Day"}
              </p>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

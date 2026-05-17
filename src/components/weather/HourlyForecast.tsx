"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Droplets, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WeatherIcon } from "@/components/weather/WeatherIcon"
import { cn } from "@/lib/utils"
import {
  formatHour,
  formatTemperature,
  formatPrecipitation,
  isNightTime,
} from "@/lib/weather-utils"
import type { ForecastItem, ForecastResponse, TemperatureUnit } from "@/types/weather"

// ─── Skeleton ─────────────────────────────────────────────────────

export function HourlyForecastSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-hidden pb-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-28 w-16 shrink-0 rounded-xl"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Variantes de animación ───────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
}

const cardVariants = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
}

// ─── HourlyCard individual ────────────────────────────────────────

interface HourlyCardProps {
  item: ForecastItem
  unit: TemperatureUnit
  timezoneOffset: number
  sunrise: number
  sunset: number
}

function HourlyCard({
  item,
  unit,
  timezoneOffset,
  sunrise,
  sunset,
}: HourlyCardProps) {
  const condition = item.weather[0]?.main ?? "Clear"
  const night     = isNightTime(item.dt, sunrise, sunset)
  const hour      = formatHour(item.dt, timezoneOffset)
  const temp      = formatTemperature(item.main.temp, unit)
  const rainProb  = item.pop > 0.05 ? formatPrecipitation(item.pop) : null

  return (
    <motion.div variants={cardVariants}>
      <div
        className={cn(
          "flex shrink-0 flex-col items-center gap-2 rounded-xl border border-border",
          "bg-card px-3 py-3 text-center transition-colors hover:bg-accent/30",
          "w-18"
        )}
        aria-label={`${hour}: ${temp}, ${condition}${rainProb ? `, ${rainProb} rain` : ""}`}
      >
        {/* Hora */}
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {hour}
        </span>

        {/* Icono del clima */}
        <WeatherIcon
          condition={condition}
          isNight={night}
          size="sm"
          animated
        />

        {/* Temperatura */}
        <span className="text-sm font-semibold tabular-nums">{temp}</span>

        {/* Probabilidad de lluvia (solo si > 5%) */}
        {rainProb && (
          <span className="flex items-center gap-0.5 text-xs text-primary">
            <Droplets className="h-2.5 w-2.5" aria-hidden="true" />
            {rainProb}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────

interface HourlyForecastProps {
  data: ForecastResponse
  unit: TemperatureUnit
  className?: string
}

export function HourlyForecast({ data, unit, className }: HourlyForecastProps) {
  const scrollRef   = useRef<HTMLDivElement>(null)
  const hourlyItems = data.list.slice(0, 8) // 8 intervalos × 3h = 24 horas

  const { timezone, sunrise, sunset } = data.city

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          Hourly Forecast
          <span className="text-xs font-normal text-muted-foreground">
            — Next 24 hours
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-5">
        {/* Contenedor con fade en el borde derecho */}
        <div className="relative">

          {/* Indicador de scroll (solo decorativo) */}
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-linear-to-l from-card to-transparent"
            aria-hidden="true"
          />
          <ChevronRight
            className="pointer-events-none absolute right-1 top-1/2 z-20 -translate-y-1/2 h-4 w-4 text-muted-foreground/60"
            aria-hidden="true"
          />

          {/* Scroll horizontal — overflow SOLO aquí, nunca en el body */}
          <div
            ref={scrollRef}
            className="overflow-x-auto pb-2 scrollbar-thin"
            role="region"
            aria-label="Hourly weather forecast, scroll horizontally"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-2.5 min-w-max pr-10"
            >
              {hourlyItems.map((item) => (
                <HourlyCard
                  key={item.dt}
                  item={item}
                  unit={unit}
                  timezoneOffset={timezone}
                  sunrise={sunrise}
                  sunset={sunset}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { motion } from "framer-motion"
import { Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WeatherIcon } from "@/components/weather/WeatherIcon"
import { cn } from "@/lib/utils"
import {
  formatTemperature,
  formatDay,
  formatPrecipitation,
  groupForecastByDay,
} from "@/lib/weather-utils"
import type { ForecastResponse, TemperatureUnit } from "@/types/weather"

// ─── Skeleton ─────────────────────────────────────────────────────

export function DailyForecastSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-8 shrink-0" />
            <Skeleton className="h-7 w-7 shrink-0 rounded" />
            <Skeleton className="hidden md:block h-4 flex-1" />
            <Skeleton className="h-2 w-20 flex-1 rounded-full" />
            <Skeleton className="h-4 w-20 shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Animaciones ──────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const rowVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

// ─── Barra visual de rango de temperatura ─────────────────────────

interface TempRangeBarProps {
  tempMin: number
  tempMax: number
  overallMin: number
  overallMax: number
}

function TempRangeBar({
  tempMin,
  tempMax,
  overallMin,
  overallMax,
}: TempRangeBarProps) {
  const range = overallMax - overallMin || 1
  const leftPct  = ((tempMin - overallMin) / range) * 100
  const widthPct = ((tempMax - tempMin)    / range) * 100

  return (
    <div
      className="relative h-1.5 w-full rounded-full bg-muted"
      role="presentation"
      aria-hidden="true"
    >
      <div
        className="absolute top-0 h-full rounded-full"
        style={{
          left:  `${leftPct}%`,
          width: `${Math.max(widthPct, 4)}%`,
          background: `linear-gradient(
            to right,
            hsl(var(--primary) / 0.5),
            hsl(var(--primary))
          )`,
        }}
      />
    </div>
  )
}

// ─── Fila individual ──────────────────────────────────────────────

interface DayRowProps {
  dt: number
  condition: string
  tempMin: number
  tempMax: number
  pop: number
  overallMin: number
  overallMax: number
  unit: TemperatureUnit
  isToday: boolean
}

function DayRow({
  dt,
  condition,
  tempMin,
  tempMax,
  pop,
  overallMin,
  overallMax,
  unit,
  isToday,
}: DayRowProps) {
  const dayLabel = isToday ? "Today" : formatDay(dt)

  return (
    <motion.div
      variants={rowVariants}
      className="grid items-center gap-x-3 gap-y-0 py-1.5"
      style={{ gridTemplateColumns: "2.5rem 2rem 1fr auto auto" }}
      role="row"
      aria-label={`${dayLabel}: ${condition}, low ${formatTemperature(tempMin, unit)}, high ${formatTemperature(tempMax, unit)}`}
    >
      {/* Día */}
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          isToday ? "text-primary font-semibold" : "text-foreground"
        )}
      >
        {dayLabel}
      </span>

      {/* Icono */}
      <div className="flex justify-center">
        <WeatherIcon condition={condition} size="sm" animated={false} />
      </div>

      {/* Barra de temperatura */}
      <div className="flex items-center gap-2 min-w-0">
        {pop > 0.1 ? (
          <span className="hidden xs:flex shrink-0 items-center gap-0.5 text-xs text-primary w-10">
            <Droplets className="h-3 w-3" aria-hidden="true" />
            {formatPrecipitation(pop)}
          </span>
        ) : (
          <span className="hidden xs:block w-10 shrink-0" />
        )}

        <TempRangeBar
          tempMin={tempMin}
          tempMax={tempMax}
          overallMin={overallMin}
          overallMax={overallMax}
        />
      </div>

      {/* Temperatura mínima */}
      <span className="text-sm text-muted-foreground tabular-nums text-right w-12">
        {formatTemperature(tempMin, unit)}
      </span>

      {/* Temperatura máxima */}
      <span className="text-sm font-semibold tabular-nums text-right w-12">
        {formatTemperature(tempMax, unit)}
      </span>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────

interface DailyForecastProps {
  data: ForecastResponse
  unit: TemperatureUnit
  className?: string
}

export function DailyForecast({ data, unit, className }: DailyForecastProps) {
  const summaries  = groupForecastByDay(data.list)

  const allTemps   = summaries.flatMap((s) => [s.tempMin, s.tempMax])
  const overallMin = Math.min(...allTemps)
  const overallMax = Math.max(...allTemps)

  const todayDt = summaries[0]?.dt ?? 0

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          5-Day Forecast
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4" role="table" aria-label="5-day weather forecast">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col divide-y divide-border/50"
        >
          {summaries.map((summary) => (
            <DayRow
              key={summary.dt}
              dt={summary.dt}
              condition={summary.condition}
              tempMin={summary.tempMin}
              tempMax={summary.tempMax}
              pop={summary.pop}
              overallMin={overallMin}
              overallMax={overallMax}
              unit={unit}
              isToday={summary.dt === todayDt}
            />
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}

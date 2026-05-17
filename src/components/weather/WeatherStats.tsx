import { motion } from "framer-motion"
import {
  Droplets,
  Wind,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  formatWindSpeed,
  formatTemperature,
  formatVisibility,
  formatPressure,
  formatTime,
  getWindDirection,
} from "@/lib/weather-utils"
import type { CurrentWeatherResponse, TemperatureUnit } from "@/types/weather"

// ─── Skeleton ─────────────────────────────────────────────────────

export function WeatherStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="w-full">
          <CardContent className="flex flex-col gap-2 p-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-5 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Variantes de animación (stagger) ────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

// ─── Stat Card individual ─────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
}

function StatCard({ icon, label, value, subValue }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full w-full transition-colors hover:bg-accent/30">
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="text-muted-foreground" aria-hidden="true">
            {icon}
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-base font-semibold leading-tight">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────

interface WeatherStatsProps {
  data: CurrentWeatherResponse
  unit: TemperatureUnit
  className?: string
}

export function WeatherStats({ data, unit, className }: WeatherStatsProps) {
  const windDir    = getWindDirection(data.wind.deg)
  const sunriseTime = formatTime(data.sys.sunrise, data.timezone)
  const sunsetTime  = formatTime(data.sys.sunset,  data.timezone)

  const stats: StatCardProps[] = [
    {
      icon:     <Droplets className="h-5 w-5" />,
      label:    "Humidity",
      value:    `${data.main.humidity}%`,
      subValue: data.main.humidity > 70 ? "High — may feel muggy" : undefined,
    },
    {
      icon:     <Wind className="h-5 w-5" />,
      label:    "Wind",
      value:    formatWindSpeed(data.wind.speed, unit),
      subValue: `${windDir}${data.wind.gust ? ` · Gusts ${formatWindSpeed(data.wind.gust, unit)}` : ""}`,
    },
    {
      icon:     <Thermometer className="h-5 w-5" />,
      label:    "Feels Like",
      value:    formatTemperature(data.main.feels_like, unit),
      subValue: `Min ${formatTemperature(data.main.temp_min, unit)} · Max ${formatTemperature(data.main.temp_max, unit)}`,
    },
    {
      icon:     <Eye className="h-5 w-5" />,
      label:    "Visibility",
      value:    formatVisibility(data.visibility),
      subValue: data.visibility >= 10000 ? "Clear visibility" : "Reduced visibility",
    },
    {
      icon:     <Gauge className="h-5 w-5" />,
      label:    "Pressure",
      value:    formatPressure(data.main.pressure),
      subValue: data.main.pressure > 1013 ? "High pressure" : "Low pressure",
    },
    {
      icon:     <Sunrise className="h-5 w-5" />,
      label:    "Sunrise",
      value:    sunriseTime,
      subValue: `Sunset ${sunsetTime}`,
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6",
        className
      )}
      role="region"
      aria-label="Weather statistics"
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </motion.div>
  )
}

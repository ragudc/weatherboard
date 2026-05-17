"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WeatherIcon } from "@/components/weather/WeatherIcon"
import { cn } from "@/lib/utils"
import { formatHour, formatTemperature } from "@/lib/weather-utils"
import type { ForecastResponse, TemperatureUnit } from "@/types/weather"

// ─── Skeleton ─────────────────────────────────────────────────────

export function TemperatureChartSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-45 md:h-55 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

// ─── Tooltip personalizado ────────────────────────────────────────

interface ChartDataPoint {
  hour:      string
  temp:      number
  condition: string
  unit:      TemperatureUnit
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload as ChartDataPoint | undefined
  if (!point) return null

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-popover px-3 py-2.5 shadow-lg",
        "flex flex-col items-center gap-1"
      )}
    >
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <WeatherIcon condition={point.condition} size="sm" animated={false} />
        <p className="text-base font-bold tabular-nums">
          {formatTemperature(point.temp, point.unit)}
        </p>
      </div>
    </div>
  )
}

// ─── Dot personalizado ────────────────────────────────────────────

interface CustomDotProps {
  cx?: number
  cy?: number
  index?: number
}

function CustomDot({ cx, cy, index }: CustomDotProps) {
  if (index !== 0 || !cx || !cy) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="hsl(var(--primary))"
      stroke="hsl(var(--background))"
      strokeWidth={2}
      aria-label="Current temperature"
    />
  )
}

// ─── Componente principal ─────────────────────────────────────────

interface TemperatureChartProps {
  data: ForecastResponse
  unit: TemperatureUnit
  className?: string
}

export function TemperatureChart({ data, unit, className }: TemperatureChartProps) {
  const { timezone } = data.city

  const chartData: ChartDataPoint[] = data.list.slice(0, 8).map((item) => ({
    hour:      formatHour(item.dt, timezone),
    temp:      Math.round(item.main.temp),
    condition: item.weather[0]?.main ?? "Clear",
    unit,
  }))

  const temps     = chartData.map((d) => d.temp)
  const yMin      = Math.floor(Math.min(...temps) - 3)
  const yMax      = Math.ceil( Math.max(...temps) + 3)
  const unitLabel = unit === "imperial" ? "°F" : "°C"

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          Temperature Trend
          <span className="text-xs font-normal text-muted-foreground">
            — Next 24 hours ({unitLabel})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-5">
        <div className="h-45 md:h-55 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey="hour"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />

              <YAxis
                domain={[yMin, yMax]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}°`}
                width={36}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke:          "hsl(var(--border))",
                  strokeWidth:     1,
                  strokeDasharray: "4 2",
                }}
              />

              <Area
                type="monotone"
                dataKey="temp"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#tempGradient)"
                dot={<CustomDot />}
                activeDot={{
                  r:           5,
                  fill:        "hsl(var(--primary))",
                  stroke:      "hsl(var(--background))",
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

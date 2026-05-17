import { motion } from "framer-motion"
import { Wind } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { AQI_LABELS } from "@/lib/constants"
import type { AirPollutionResponse } from "@/types/weather"

// ─── Skeleton ─────────────────────────────────────────────────────

export function AirQualitySkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Configuración por nivel AQI ──────────────────────────────────

type AqiLevel = 1 | 2 | 3 | 4 | 5

const AQI_CONFIG: Record<AqiLevel, {
  colorVar:     string
  badgeVariant: "default" | "secondary" | "outline" | "destructive"
  description:  string
  pct:          number
}> = {
  1: {
    colorVar:     "--aqi-1",
    badgeVariant: "default",
    description:  "Air quality is satisfactory. Little or no risk.",
    pct:          20,
  },
  2: {
    colorVar:     "--aqi-2",
    badgeVariant: "secondary",
    description:  "Acceptable. Some pollutants may affect sensitive individuals.",
    pct:          40,
  },
  3: {
    colorVar:     "--aqi-3",
    badgeVariant: "outline",
    description:  "Sensitive groups may experience health effects.",
    pct:          60,
  },
  4: {
    colorVar:     "--aqi-4",
    badgeVariant: "destructive",
    description:  "Everyone may experience health effects. Reduce outdoor activity.",
    pct:          80,
  },
  5: {
    colorVar:     "--aqi-5",
    badgeVariant: "destructive",
    description:  "Health warnings. Everyone should avoid outdoor exertion.",
    pct:          100,
  },
}

// ─── Pollutant Item ───────────────────────────────────────────────

interface PollutantItemProps {
  name:       string
  value:      number
  unit?:      string
  threshold?: number
}

function PollutantItem({ name, value, unit = "μg/m³", threshold }: PollutantItemProps) {
  const isHigh = threshold !== undefined && value > threshold

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 rounded-md border px-2.5 py-2",
        isHigh
          ? "border-destructive/40 bg-destructive/5"
          : "border-border bg-muted/30"
      )}
    >
      <span className="text-xs text-muted-foreground">{name}</span>
      <span className={cn("text-sm font-semibold tabular-nums", isHigh && "text-destructive")}>
        {value.toFixed(1)}{" "}
        <span className="text-xs font-normal text-muted-foreground">{unit}</span>
      </span>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────

interface AirQualityProps {
  data: AirPollutionResponse
  className?: string
}

export function AirQuality({ data, className }: AirQualityProps) {
  const latest = data.list[0]
  if (!latest) return null

  const aqi    = latest.main.aqi as AqiLevel
  const config = AQI_CONFIG[aqi]
  const label  = AQI_LABELS[aqi]
  const { pm2_5, pm10, o3, no2 } = latest.components

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wind className="h-4 w-4" aria-hidden="true" />
          Air Quality
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pb-5">

        {/* ── AQI número + badge + barra ───────────────────────── */}
        <div className="flex items-center gap-4">

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4"
            style={{
              borderColor: `hsl(var(${config.colorVar}))`,
              color:        `hsl(var(${config.colorVar}))`,
            }}
            aria-label={`Air Quality Index: ${aqi} — ${label}`}
          >
            <span className="text-xl font-bold tabular-nums">{aqi}</span>
          </motion.div>

          <div className="flex flex-1 flex-col gap-2 min-w-0">

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={config.badgeVariant}
                style={
                  aqi <= 3
                    ? {
                        backgroundColor: `hsl(var(${config.colorVar}) / 0.15)`,
                        color:            `hsl(var(${config.colorVar}))`,
                        borderColor:      `hsl(var(${config.colorVar}) / 0.3)`,
                      }
                    : undefined
                }
              >
                {label}
              </Badge>
            </div>

            <div
              className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={aqi}
              aria-valuemin={1}
              aria-valuemax={5}
              aria-label={`AQI level: ${label}`}
            >
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${config.pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                style={{
                  background: `linear-gradient(
                    to right,
                    hsl(var(--aqi-1)),
                    hsl(var(${config.colorVar}))
                  )`,
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground leading-snug">
              {config.description}
            </p>
          </div>
        </div>

        <Separator />

        {/* ── Desglose de contaminantes ─────────────────────────── */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Pollutants
          </p>
          <div className="grid grid-cols-2 gap-2">
            <PollutantItem name="PM2.5"     value={pm2_5} threshold={15}  />
            <PollutantItem name="PM10"      value={pm10}  threshold={45}  />
            <PollutantItem name="O₃ (Ozone)" value={o3}  threshold={100} />
            <PollutantItem name="NO₂"       value={no2}  threshold={25}  />
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Info, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatTime } from "@/lib/weather-utils"
import type { WeatherAlert } from "@/types/weather"

// ─── Configuración por severidad ─────────────────────────────────

type Severity = WeatherAlert["severity"]

const SEVERITY_CONFIG: Record<Severity, {
  Icon:         React.ElementType
  badgeVariant: "default" | "secondary" | "destructive" | "outline"
  borderClass:  string
  bgClass:      string
  label:        string
}> = {
  advisory: {
    Icon:         Info,
    badgeVariant: "secondary",
    borderClass:  "border-primary/30",
    bgClass:      "bg-primary/5",
    label:        "Advisory",
  },
  watch: {
    Icon:         AlertTriangle,
    badgeVariant: "outline",
    borderClass:  "border-yellow-500/40",
    bgClass:      "bg-yellow-500/5",
    label:        "Watch",
  },
  warning: {
    Icon:         ShieldAlert,
    badgeVariant: "destructive",
    borderClass:  "border-destructive/50",
    bgClass:      "bg-destructive/5",
    label:        "Warning",
  },
}

// ─── Alert Card individual ────────────────────────────────────────

interface AlertCardProps {
  alert:           WeatherAlert
  timezoneOffset?: number
}

function AlertCard({ alert, timezoneOffset = 0 }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false)
  const config    = SEVERITY_CONFIG[alert.severity]
  const { Icon }  = config
  const startTime = formatTime(alert.start, timezoneOffset)
  const endTime   = formatTime(alert.end,   timezoneOffset)

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        config.borderClass,
        config.bgClass
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <Icon
            className={cn(
              "mt-0.5 h-4 w-4 shrink-0",
              alert.severity === "warning"
                ? "text-destructive"
                : alert.severity === "watch"
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-primary"
            )}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold leading-tight">
                {alert.event}
              </span>
              <Badge variant={config.badgeVariant} className="text-xs">
                {config.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {startTime} — {endTime}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={expanded}
          aria-label={expanded ? "Hide details" : "Show details"}
        >
          {expanded
            ? <ChevronUp   className="h-4 w-4" aria-hidden="true" />
            : <ChevronDown className="h-4 w-4" aria-hidden="true" />
          }
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="description"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-xs leading-relaxed text-foreground/80 border-t border-border/50 pt-2.5">
              {alert.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────

interface WeatherAlertsProps {
  alerts?:         WeatherAlert[]
  timezoneOffset?: number
  className?:      string
}

export function WeatherAlerts({
  alerts = [],
  timezoneOffset = 0,
  className,
}: WeatherAlertsProps) {
  if (alerts.length === 0) return null

  const severityOrder: Record<Severity, number> = {
    warning:  0,
    watch:    1,
    advisory: 2,
  }
  const sorted = [...alerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  )

  const hasWarnings = sorted.some((a) => a.severity === "warning")

  return (
    <Card
      className={cn(
        "w-full",
        hasWarnings && "border-destructive/40",
        className
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className={cn(
            "flex items-center gap-2 text-base",
            hasWarnings && "text-destructive"
          )}
        >
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          Active Weather Alerts
          <Badge
            variant={hasWarnings ? "destructive" : "secondary"}
            className="ml-auto text-xs"
          >
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-5">
        {sorted.map((alert, index) => (
          <div key={`${alert.event}-${alert.start}`}>
            <AlertCard alert={alert} timezoneOffset={timezoneOffset} />
            {index < sorted.length - 1 && (
              <Separator className="mt-3 opacity-50" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

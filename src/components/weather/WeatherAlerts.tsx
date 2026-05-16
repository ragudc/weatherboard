import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface WeatherAlert {
  event: string
  description: string
  start: number
  end: number
}

interface WeatherAlertsProps {
  alerts?: WeatherAlert[]
  className?: string
}

/**
 * WeatherAlerts — Alertas climáticas activas
 * La API de alertas está disponible en el plan One Call (Free)
 * TODO Sprint 4: Integrar con endpoint One Call API para alertas reales
 */
export function WeatherAlerts({ alerts = [], className }: WeatherAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <Card className={cn("w-full border-destructive/50", className)}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-destructive">
          ⚠️ Active Weather Alerts
          <Badge variant="destructive">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="rounded-md bg-destructive/10 border border-destructive/20 p-3"
          >
            <p className="text-sm font-semibold text-destructive">{alert.event}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {alert.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

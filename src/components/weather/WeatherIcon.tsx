import { cn } from "@/lib/utils"

interface WeatherIconProps {
  condition: string
  isNight?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  className?: string
}

const sizeMap: Record<NonNullable<WeatherIconProps["size"]>, string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl",
}

const conditionEmojiMap: Record<string, { day: string; night: string }> = {
  Clear:        { day: "☀️",  night: "🌙" },
  Clouds:       { day: "☁️",  night: "☁️" },
  Rain:         { day: "🌧️",  night: "🌧️" },
  Drizzle:      { day: "🌦️",  night: "🌦️" },
  Thunderstorm: { day: "⛈️",  night: "⛈️" },
  Snow:         { day: "❄️",  night: "❄️" },
  Mist:         { day: "🌫️",  night: "🌫️" },
  Fog:          { day: "🌫️",  night: "🌫️" },
  Haze:         { day: "🌁",  night: "🌁" },
}

/**
 * WeatherIcon — Icono visual de condición climática
 * TODO Sprint 4: Reemplazar emojis por animaciones con Framer Motion
 */
export function WeatherIcon({
  condition,
  isNight = false,
  size = "md",
  className,
}: WeatherIconProps) {
  const icons = conditionEmojiMap[condition] ?? { day: "🌡️", night: "🌡️" }
  const icon = isNight ? icons.night : icons.day

  return (
    <span
      className={cn(sizeMap[size], "select-none leading-none", className)}
      role="img"
      aria-label={`${condition} weather icon`}
    >
      {icon}
    </span>
  )
}

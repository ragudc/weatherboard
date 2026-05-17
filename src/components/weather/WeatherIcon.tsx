"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Mapas de configuración ───────────────────────────────────────

const SIZE_MAP = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl",
} as const

const CONDITION_EMOJI: Record<string, { day: string; night: string }> = {
  Clear:        { day: "☀️",  night: "🌙"  },
  Clouds:       { day: "☁️",  night: "☁️"  },
  Rain:         { day: "🌧️",  night: "🌧️"  },
  Drizzle:      { day: "🌦️",  night: "🌦️"  },
  Thunderstorm: { day: "⛈️",  night: "⛈️"  },
  Snow:         { day: "❄️",  night: "❄️"  },
  Mist:         { day: "🌫️",  night: "🌫️"  },
  Fog:          { day: "🌫️",  night: "🌫️"  },
  Haze:         { day: "🌁",  night: "🌁"  },
  Smoke:        { day: "💨",  night: "💨"  },
  Dust:         { day: "💨",  night: "💨"  },
  Sand:         { day: "💨",  night: "💨"  },
  Ash:          { day: "💨",  night: "💨"  },
  Squall:       { day: "🌬️",  night: "🌬️"  },
  Tornado:      { day: "🌪️",  night: "🌪️"  },
}

// ─── Variantes de animación por condición ─────────────────────────

type AnimationConfig = {
  animate: Record<string, number | number[]>
  transition: Record<string, number | string | boolean>
}

const ANIMATION_MAP: Record<string, AnimationConfig> = {
  Clear: {
    animate: { rotate: 360 },
    transition: { duration: 12, repeat: Infinity, ease: "linear" },
  },
  Clouds: {
    animate: { x: [0, 8, 0] },
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
  Rain: {
    animate: { y: [0, 5, 0] },
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  },
  Drizzle: {
    animate: { y: [0, 4, 0] },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
  Thunderstorm: {
    animate: { scale: [1, 1.12, 1], opacity: [1, 0.85, 1] },
    transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
  },
  Snow: {
    animate: { y: [0, 4, 0], x: [0, 3, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  Mist: {
    animate: { opacity: [1, 0.6, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  Fog: {
    animate: { opacity: [1, 0.6, 1] },
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  Tornado: {
    animate: { rotate: [0, 15, -15, 0] },
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
  },
}

const DEFAULT_ANIMATION: AnimationConfig = {
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
}

// ─── Componente ───────────────────────────────────────────────────

interface WeatherIconProps {
  condition: string
  isNight?: boolean
  size?: keyof typeof SIZE_MAP
  animated?: boolean
  className?: string
}

export function WeatherIcon({
  condition,
  isNight = false,
  size = "md",
  animated = true,
  className,
}: WeatherIconProps) {
  const emojis = CONDITION_EMOJI[condition] ?? { day: "🌡️", night: "🌡️" }
  const icon   = isNight ? emojis.night : emojis.day

  // Las animaciones no aplican en modo nocturno (ambiente más tranquilo)
  const config  = (!isNight && animated)
    ? (ANIMATION_MAP[condition] ?? DEFAULT_ANIMATION)
    : { animate: {}, transition: {} }

  return (
    <motion.span
      role="img"
      aria-label={`${condition}${isNight ? " night" : ""} weather icon`}
      className={cn(
        SIZE_MAP[size],
        "select-none leading-none inline-block",
        className
      )}
      animate={config.animate}
      transition={config.transition}
    >
      {icon}
    </motion.span>
  )
}

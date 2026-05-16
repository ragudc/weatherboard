# Skill: TypeScript Patterns

## Configuración del proyecto
- `strict: true` en `tsconfig.json` — es obligatorio
- Nunca uses `any` — usa `unknown` y narrowing
- Todas las interfaces van en `src/types/`

## Patrones obligatorios

### Props de componentes
```tsx
// ✅ Siempre nombra la interface como ComponentNameProps
interface CurrentWeatherProps {
  data: CurrentWeatherResponse
  unit: TemperatureUnit
  className?: string
}

export const CurrentWeather = ({ data, unit, className }: CurrentWeatherProps) => {}
```

### Narrowing de errores
```tsx
// ✅ Correcto
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error"
}

// ❌ Incorrecto
} catch (error: any) {
  console.log(error.message)
}
```

### Tipos de retorno explícitos en funciones de utilidad
```tsx
// ✅ Con tipo de retorno explícito
export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  return unit === "imperial" ? `${Math.round(temp)}°F` : `${Math.round(temp)}°C`
}
```

### Enums como const objects (preferido sobre `enum`)
```tsx
// ✅ Preferido en este proyecto
export const WeatherType = {
  Clear: "Clear",
  Clouds: "Clouds",
  Rain: "Rain",
  Snow: "Snow",
  Thunderstorm: "Thunderstorm",
} as const

export type WeatherType = typeof WeatherType[keyof typeof WeatherType]
```

### Tipos de i18n (next-intl)
```tsx
// Importar el tipo de locale desde routing para autocompletado
import { routing } from "@/i18n/routing"

type Locale = typeof routing.locales[number] // "en" | "es"
```

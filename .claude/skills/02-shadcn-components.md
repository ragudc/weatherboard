# Skill: shadcn/ui Components

## Componentes instalados en WeatherBoard
Ubicación: `src/components/ui/`

| Componente | Import | Uso principal |
|---|---|---|
| Card | `@/components/ui/card` | Tarjetas de forecast, clima actual |
| Badge | `@/components/ui/badge` | Alertas climáticas, etiquetas AQI |
| Skeleton | `@/components/ui/skeleton` | Loading states de todos los componentes |
| Tooltip | `@/components/ui/tooltip` | Info adicional sobre iconos de clima |
| Select | `@/components/ui/select` | Selector de ciudad destacada |
| Input | `@/components/ui/input` | Campo de búsqueda de ciudad |
| Button | `@/components/ui/button` | Botones de acción y búsqueda |
| Separator | `@/components/ui/separator` | Divisores entre secciones |
| Switch | `@/components/ui/switch` | Toggle °F / °C |

## Patrones de uso obligatorios

### Utility function `cn()`
Siempre usa `cn()` para combinar clases condicionales:
```tsx
import { cn } from "@/lib/utils"

// ✅ Correcto
<div className={cn("base-class", condition && "conditional-class", className)}>

// ❌ Incorrecto
<div className={`base-class ${condition ? "conditional-class" : ""}`}>
```

### Card — Patrón estándar
```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

<Card className={cn("w-full", className)}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    {/* contenido */}
  </CardContent>
</Card>
```

### Skeleton — Loading states
Todo componente que carga datos DEBE tener su Skeleton correspondiente:
```tsx
import { Skeleton } from "@/components/ui/skeleton"

const WeatherCardSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-[140px]" />
      <Skeleton className="h-4 w-[100px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-16 w-full" />
    </CardContent>
  </Card>
)
```

### Badge — Variantes disponibles
```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">Current</Badge>
<Badge variant="secondary">Moderate</Badge>
<Badge variant="destructive">Storm Warning</Badge>
<Badge variant="outline">Fair</Badge>
```

### Button — Con estado de carga
```tsx
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    "Search"
  )}
</Button>
```

### Switch — Toggle °F / °C
```tsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

<div className="flex items-center gap-2">
  <Label htmlFor="unit-toggle">°F</Label>
  <Switch
    id="unit-toggle"
    checked={unit === "metric"}
    onCheckedChange={(checked) => setUnit(checked ? "metric" : "imperial")}
  />
  <Label htmlFor="unit-toggle">°C</Label>
</div>
```

## Reglas de extensión de componentes
Siempre acepta y propaga la prop `className` en componentes propios:
```tsx
interface WeatherCardProps {
  className?: string
  // ... otras props
}

export const WeatherCard = ({ className, ...props }: WeatherCardProps) => (
  <Card className={cn("default-styles", className)}>
```

## Nunca modifiques los archivos en `src/components/ui/`
Los archivos de `src/components/ui/` son generados por shadcn CLI.
Para extender un componente, crea un wrapper en `src/components/weather/`.

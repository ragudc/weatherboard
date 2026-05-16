import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { US_FEATURED_CITIES } from "@/lib/constants"

interface EmptyStateProps {
  onCitySelect: (city: string) => void
  onRequestLocation?: () => void
  className?: string
}

/**
 * EmptyState — Pantalla inicial cuando no hay datos de clima cargados
 * Muestra ciudades destacadas de EEUU como accesos rápidos
 */
export function EmptyState({
  onCitySelect,
  onRequestLocation,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-8 py-16 px-4 text-center",
        className
      )}
    >
      {/* Hero icon */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-7xl sm:text-8xl select-none" aria-hidden="true">
          🌤️
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Welcome to WeatherBoard
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-sm">
          Real-time weather for US cities — search above or use your location
          to get started.
        </p>
      </div>

      {/* Botón de geolocalización */}
      {onRequestLocation && (
        <Button
          variant="outline"
          onClick={onRequestLocation}
          className="gap-2"
          aria-label="Use my current location"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Use My Location
        </Button>
      )}

      {/* Ciudades destacadas */}
      <div className="w-full max-w-lg">
        <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-1">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          Popular US Cities
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {US_FEATURED_CITIES.map((city) => (
            <Button
              key={city}
              variant="secondary"
              size="sm"
              onClick={() => onCitySelect(city)}
              className="text-xs"
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

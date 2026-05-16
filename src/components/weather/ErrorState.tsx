import { AlertTriangle, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  onClear?: () => void
  className?: string
}

const getFriendlyMessage = (raw: string): { title: string; hint: string } => {
  if (
    raw.toLowerCase().includes("city not found") ||
    raw.toLowerCase().includes("404")
  ) {
    return {
      title: "City Not Found",
      hint: 'Check the city name spelling. Try "New York" instead of "NewYork".',
    }
  }
  if (
    raw.toLowerCase().includes("401") ||
    raw.toLowerCase().includes("api key")
  ) {
    return {
      title: "API Error",
      hint: "There was an issue with the weather service. Please try again later.",
    }
  }
  if (
    raw.toLowerCase().includes("network") ||
    raw.toLowerCase().includes("fetch")
  ) {
    return {
      title: "Connection Error",
      hint: "Check your internet connection and try again.",
    }
  }
  return {
    title: "Something Went Wrong",
    hint: raw,
  }
}

/**
 * ErrorState — Pantalla de error con mensaje amigable y opciones de recuperación
 */
export function ErrorState({
  message,
  onRetry,
  onClear,
  className,
}: ErrorStateProps) {
  const { title, hint } = getFriendlyMessage(message)

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 py-16 px-4 text-center",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-3">
        <AlertTriangle
          className="h-14 w-14 text-destructive"
          aria-hidden="true"
        />
        <h2 className="text-xl sm:text-2xl font-semibold text-destructive">
          {title}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-sm">
          {hint}
        </p>
      </div>

      <div className="flex flex-col xs:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2" aria-label="Retry">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </Button>
        )}
        {onClear && (
          <Button
            variant="outline"
            onClick={onClear}
            className="gap-2"
            aria-label="Search for a different city"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search Another City
          </Button>
        )}
      </div>
    </div>
  )
}

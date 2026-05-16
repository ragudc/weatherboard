import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
}

/**
 * Footer — Pie de página de WeatherBoard
 *
 * Contiene:
 * - Créditos de la API (OpenWeatherMap)
 * - Link al portafolio del desarrollador
 * - Año actual
 *
 * TODO Sprint 5: Implementar UI completa con links y estilos finales
 */
export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "w-full border-t border-border bg-background py-6 mt-auto",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {currentYear} WeatherBoard. Data powered by{" "}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              OpenWeatherMap
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

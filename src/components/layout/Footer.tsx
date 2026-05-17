import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
}

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
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-0">

          <p className="text-sm text-muted-foreground">
            © {currentYear}{" "}
            <a
              href="https://github.com/ragudc"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline transition-colors"
            >
              Roberto Agudelo
            </a>
            {" "}· Data by{" "}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline hover:text-foreground transition-colors"
            >
              OpenWeatherMap
            </a>
          </p>

          <p className="text-xs text-muted-foreground">
            Next.js · TypeScript · Tailwind CSS · Recharts
          </p>

        </div>
      </div>
    </footer>
  )
}

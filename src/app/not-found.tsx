import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * not-found.tsx — Página 404 personalizada (Next.js App Router)
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="text-8xl select-none" aria-hidden="true">🌫️</span>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl font-medium">Page Not Found</p>
        <p className="text-muted-foreground max-w-sm">
          Looks like this page got lost in the clouds. Let&apos;s get you back
          to the forecast.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back to WeatherBoard</Link>
      </Button>
    </div>
  )
}

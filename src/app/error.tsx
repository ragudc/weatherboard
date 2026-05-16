"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * error.tsx — Error boundary a nivel de ruta (Next.js App Router)
 * Se activa cuando un Server Component lanza una excepción no capturada
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route-level error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Unexpected Error</h1>
        <p className="text-muted-foreground max-w-md">
          WeatherBoard ran into an unexpected issue. This has been logged and
          we&apos;re working on it.
        </p>
      </div>
      <Button onClick={reset} aria-label="Try again">
        Try Again
      </Button>
    </div>
  )
}

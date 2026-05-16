"use client"

import { useState, type FormEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (city: string) => void
  isLoading?: boolean
  defaultValue?: string
  className?: string
}

/**
 * SearchBar — Campo de búsqueda de ciudad
 * TODO Sprint 3: Agregar autocompletado con ciudades de US_FEATURED_CITIES
 * TODO Sprint 3: Agregar búsqueda por geolocalización
 */
export function SearchBar({
  onSearch,
  isLoading = false,
  defaultValue = "",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <div
      role="search"
      className={cn("flex w-full items-center gap-2", className)}
      onKeyDown={(e) =>
        e.key === "Enter" && handleSubmit(e as unknown as FormEvent<HTMLDivElement>)
      }
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search US city... (e.g. Miami, Denver)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search for a city"
          disabled={isLoading}
        />
      </div>
      <Button
        onClick={() => query.trim() && onSearch(query.trim())}
        disabled={isLoading || !query.trim()}
        size="default"
        aria-label="Search weather"
      >
        {isLoading ? "Loading..." : "Search"}
      </Button>
    </div>
  )
}

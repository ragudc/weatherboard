"use client"

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react"
import { Search, X, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { US_FEATURED_CITIES } from "@/lib/constants"

interface SearchBarProps {
  onSearch: (city: string) => void
  isLoading?: boolean
  defaultValue?: string
  className?: string
}

export function SearchBar({
  onSearch,
  isLoading = false,
  defaultValue = "",
  className,
}: SearchBarProps) {
  const [query, setQuery]             = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<readonly string[]>([])
  const [isOpen, setIsOpen]           = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)
  const listboxId    = "city-suggestions-listbox"

  // ─── Sincronizar defaultValue externo (ej: ciudad detectada por geo) ──
  useEffect(() => {
    if (defaultValue && defaultValue !== query) setQuery(defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  // ─── Filtrar sugerencias al escribir ─────────────────────────────
  useEffect(() => {
    const trimmed = query.trim().toLowerCase()
    setSuggestions(
      trimmed === ""
        ? US_FEATURED_CITIES
        : US_FEATURED_CITIES.filter((c) =>
            c.toLowerCase().includes(trimmed)
          )
    )
    setActiveIndex(-1)
  }, [query])

  // ─── Cerrar dropdown al hacer click fuera ─────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ─── Acciones ─────────────────────────────────────────────────────
  const submit = useCallback(() => {
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
      setIsOpen(false)
    }
  }, [query, onSearch])

  const selectCity = useCallback(
    (city: string) => {
      setQuery(city)
      setIsOpen(false)
      onSearch(city)
    },
    [onSearch]
  )

  const clearQuery = useCallback(() => {
    setQuery("")
    setIsOpen(false)
    inputRef.current?.focus()
  }, [])

  // ─── Navegación por teclado ───────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") setIsOpen(true)
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectCity(suggestions[activeIndex])
        } else {
          submit()
        }
        break
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
      case "Tab":
        setIsOpen(false)
        break
    }
  }

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">

          {/* Icono de búsqueda */}
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            ref={inputRef}
            type="search"
            placeholder="Search US city... (e.g. Miami, Denver)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-8"
            role="combobox"
            aria-label="Search for a city"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
            }
            autoComplete="off"
            disabled={isLoading}
          />

          {/* Botón limpiar */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Botón Search */}
        <Button
          onClick={submit}
          disabled={isLoading || !query.trim()}
          aria-label="Search weather for city"
          className="shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="hidden xs:inline">Loading...</span>
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="US city suggestions"
          className={cn(
            "absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto",
            "rounded-md border border-border bg-popover shadow-md",
            "animate-in fade-in-0 zoom-in-95 duration-100"
          )}
        >
          {suggestions.map((city, index) => (
            <li
              key={city}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                "transition-colors",
                index === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-foreground"
              )}
              onMouseDown={(e) => {
                // preventDefault evita que el input pierda el foco antes del click
                e.preventDefault()
                selectCity(city)
              }}
            >
              <MapPin
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span>{city}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

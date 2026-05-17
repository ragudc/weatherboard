"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { EmptyState } from "@/components/weather/EmptyState"
import { ErrorState } from "@/components/weather/ErrorState"
import { CurrentWeather, CurrentWeatherSkeleton } from "@/components/weather/CurrentWeather"
import { WeatherStats, WeatherStatsSkeleton } from "@/components/weather/WeatherStats"
import { HourlyForecast, HourlyForecastSkeleton } from "@/components/weather/HourlyForecast"
import { DailyForecast, DailyForecastSkeleton } from "@/components/weather/DailyForecast"
import { TemperatureChart, TemperatureChartSkeleton } from "@/components/weather/TemperatureChart"
import { WeatherAlerts } from "@/components/weather/WeatherAlerts"
import { AirQuality, AirQualitySkeleton } from "@/components/weather/AirQuality"
import { useWeather } from "@/hooks/useWeather"
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit"
import { useGeolocation } from "@/hooks/useGeolocation"
import { getDerivedAlerts } from "@/lib/weather-utils"
import type { TemperatureUnit, WeatherAlert } from "@/types/weather"

export default function HomePage() {
  const { unit, setUnit } = useTemperatureUnit()
  const {
    data,
    isLoading,
    error,
    currentCity,
    fetchWeather,
    refetch,
    clearError,
    clearData,
  } = useWeather(unit)
  const geo = useGeolocation()

  // Auto-fetch cuando la geolocalización resuelve una ciudad
  useEffect(() => {
    if (geo.city && !currentCity && !isLoading) {
      fetchWeather(geo.city)
    }
  }, [geo.city, currentCity, isLoading, fetchWeather])

  // Re-fetch al cambiar unidad (solo si hay datos cargados)
  useEffect(() => {
    if (currentCity) refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])

  const handleSearch = (city: string) => fetchWeather(city)

  const handleUnitChange = (newUnit: TemperatureUnit) => setUnit(newUnit)

  const handleRequestLocation = () => {
    if (geo.city) fetchWeather(geo.city)
  }

  // ─── Derivaciones del estado ────────────────────────────────────
  const derivedAlerts: WeatherAlert[] = data.current
    ? getDerivedAlerts(data.current, unit)
    : []

  const hasData = !!data.current
  const showEmpty = !hasData && !isLoading && !error
  const showError = !!error && !isLoading

  return (
    <div className="flex min-h-screen flex-col">

      {/* ─── Header ──────────────────────────────────────────────── */}
      <Header
        unit={unit}
        onUnitChange={handleUnitChange}
        onSearch={handleSearch}
        isSearchLoading={isLoading}
        currentCity={currentCity}
      />

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main
        className="flex-1"
        aria-live="polite"
        aria-busy={isLoading}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">

          {/* ── Empty State ───────────────────────────────────────── */}
          {showEmpty && (
            <EmptyState
              onCitySelect={handleSearch}
              onRequestLocation={geo.isSupported ? handleRequestLocation : undefined}
            />
          )}

          {/* ── Error State ───────────────────────────────────────── */}
          {showError && (
            <ErrorState
              message={error}
              onRetry={currentCity ? refetch : undefined}
              onClear={() => { clearError(); clearData() }}
            />
          )}

          {/* ── Loading State (Skeletons) ─────────────────────────── */}
          {isLoading && (
            <div className="flex flex-col gap-4 md:gap-6">
              <CurrentWeatherSkeleton />
              <WeatherStatsSkeleton />
              <HourlyForecastSkeleton />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2">
                  <DailyForecastSkeleton />
                </div>
                <AirQualitySkeleton />
              </div>
              <TemperatureChartSkeleton />
            </div>
          )}

          {/* ── Weather Dashboard ─────────────────────────────────── */}
          {hasData && !isLoading && data.current && data.forecast && (
            <div className="flex flex-col gap-4 md:gap-6">

              {/* Fila 1: Clima actual */}
              <CurrentWeather
                data={data.current}
                unit={unit}
              />

              {/* Fila 2: Stats secundarias */}
              <WeatherStats
                data={data.current}
                unit={unit}
              />

              {/* Fila 3: Pronóstico horario */}
              <HourlyForecast
                data={data.forecast}
                unit={unit}
              />

              {/* Fila 4: Grid — Forecast 5 días + Air Quality */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2">
                  <DailyForecast
                    data={data.forecast}
                    unit={unit}
                  />
                </div>
                {data.airPollution && (
                  <AirQuality data={data.airPollution} />
                )}
              </div>

              {/* Fila 5: Gráfica de temperatura */}
              <TemperatureChart
                data={data.forecast}
                unit={unit}
              />

              {/* Fila 6: Alertas derivadas de condiciones extremas */}
              <WeatherAlerts
                alerts={derivedAlerts}
                timezoneOffset={data.current?.timezone ?? 0}
              />

            </div>
          )}

        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

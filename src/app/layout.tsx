import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

/* ─── Fuentes ────────────────────────────────────────────────────── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

/* ─── Metadata SEO ───────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default:  "WeatherBoard — Real-Time US Weather Dashboard",
    template: "%s | WeatherBoard",
  },
  description:
    "Beautiful real-time weather dashboard for US cities. Hourly forecasts, 7-day outlooks, air quality index, and smart weather alerts — powered by OpenWeatherMap.",
  keywords: [
    "weather dashboard",
    "US weather forecast",
    "real-time weather",
    "air quality index",
    "weather alerts",
    "hourly forecast",
    "weather app",
  ],
  authors:  [{ name: "WeatherBoard" }],
  creator:  "WeatherBoard",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title:       "WeatherBoard — Real-Time US Weather Dashboard",
    description: "Beautiful real-time weather forecasts for US cities.",
    type:        "website",
    locale:      "en_US",
    siteName:    "WeatherBoard",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "WeatherBoard — Real-Time US Weather Dashboard",
    description: "Real-time weather forecasts for US cities.",
  },
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true },
  },
  category: "technology",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

/* ─── Root Layout ────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

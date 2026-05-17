<div align="center">

# 🌤️ WeatherBoard

**Real-Time US Weather Dashboard**

A beautiful, fast, and accessible weather dashboard for US cities — built with Next.js 16, TypeScript, and Tailwind CSS v4.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

[**Live Demo →**](https://weatherboard-steel.vercel.app) · [Report Bug](https://github.com/ragudc/weatherboard/issues)

</div>

---

## ✨ Features

- **Real-Time Data** — Current conditions, hourly & 5-day forecast via OpenWeatherMap
- **Air Quality Index** — AQI levels with pollutant breakdown (PM2.5, PM10, O₃, NO₂)
- **Smart Alerts** — Automatic weather alerts derived from extreme conditions
- **Temperature Chart** — 24-hour trend visualization with Recharts AreaChart
- **Auto Dark Mode** — Theme switches to dark/light based on local sunrise/sunset at searched city
- **Geolocation** — Auto-detects your city with one click
- **City Autocomplete** — Instant suggestions for 10 major US cities
- **Imperial & Metric** — Toggle between °F/mph and °C/m/s with auto-refetch
- **Fully Accessible** — WCAG 2.1 AA, keyboard navigation, ARIA labels
- **Mobile First** — Responsive from 320px to 2560px, zero horizontal scroll

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (New York style) |
| Charts | Recharts |
| Animations | Framer Motion |
| Weather API | OpenWeatherMap (Free tier) |
| Deployment | Vercel |
| Analytics | Vercel Analytics |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20 (via [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io) package manager
- Free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/ragudc/weatherboard.git
cd weatherboard

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenWeatherMap API key
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenWeatherMap API — Free plan
# Get your key at: https://home.openweathermap.org/api_keys
OPENWEATHERMAP_API_KEY=your_api_key_here

# App URL (change to your production URL on deploy)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Important:** Never use the `NEXT_PUBLIC_` prefix for the API key.
> It is only accessed server-side through Next.js API Routes.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Note: A new OpenWeatherMap API key can take up to 2 hours to activate.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/weather/route.ts    # Secure proxy for OpenWeatherMap
│   ├── icon.tsx                # Dynamic favicon
│   ├── opengraph-image.tsx     # OG image for social sharing
│   ├── layout.tsx              # Root layout with ThemeProvider + Analytics
│   └── page.tsx                # Home page with all hooks wired
├── components/
│   ├── layout/                 # Header, Footer, ThemeToggle, ThemeProvider
│   └── weather/                # All weather display components
├── hooks/                      # useWeather, useGeolocation, useAutoTheme, useTemperatureUnit
├── lib/
│   ├── api/                    # OpenWeatherMap API functions
│   ├── constants.ts            # App constants (cities, endpoints, cache)
│   └── weather-utils.ts        # Formatting & calculation utilities
└── types/
    └── weather.ts              # TypeScript interfaces for all API responses
```

---

## 🌐 Deploy on Vercel

The easiest way to deploy WeatherBoard is with [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ragudc/weatherboard)

> Live: [weatherboard-steel.vercel.app](https://weatherboard-steel.vercel.app)

### Manual Deploy

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

**Add your environment variable in the Vercel dashboard:**
- Go to Project Settings → Environment Variables
- Add `OPENWEATHERMAP_API_KEY` with your API key
- Redeploy

---

## 📊 Performance

Lighthouse scores (production build):

| Metric | Score |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 95 |

---

## 📝 API Reference

WeatherBoard exposes a single internal API route that proxies OpenWeatherMap:

```
GET /api/weather?city={city}&type={type}&unit={unit}
```

| Parameter | Values | Required |
|---|---|---|
| `city` | Any US city name | Yes (for current/forecast) |
| `type` | `current` \| `forecast` \| `air` \| `geocode` | Yes |
| `unit` | `imperial` (°F) \| `metric` (°C) | No (default: imperial) |
| `lat`, `lon` | Coordinates | Yes (for `air` and `geocode`) |

---

## 📄 License

MIT — feel free to use this project as a reference or template.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/ragudc">Roberto Agudelo</a>
</div>

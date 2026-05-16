# 🌤️ WeatherBoard — Claude Code Guidelines

## Stack Tecnológico
- Framework: Next.js 15 (App Router)
- Lenguaje: TypeScript 5 (strict mode)
- Estilos: Tailwind CSS v4
- Componentes UI: shadcn/ui (New York, Slate)
- Iconos: Lucide React
- Gráficas: Recharts
- Animaciones: Framer Motion
- Fechas: date-fns
- API externa: OpenWeatherMap (plan Free)
- i18n: next-intl (en → default, es → optional)
- Package manager: pnpm

## Reglas Globales Irrompibles
1. Nunca uses `any` en TypeScript — usa tipos explícitos o `unknown`
2. Nunca hardcodees colores — usa solo CSS variables de shadcn (`--primary`, `--background`, etc.)
3. Nunca llames a OpenWeatherMap directamente desde componentes React — solo desde `/api/weather/route.ts`
4. Nunca expongas `OPENWEATHERMAP_API_KEY` con prefijo `NEXT_PUBLIC_`
5. Siempre aplica mobile-first: escribe estilos base para móvil y luego breakpoints hacia arriba
6. Nunca apliques `overflow-x: hidden` al `body` o al layout raíz
7. Nunca hardcodees texto visible al usuario — siempre usa `t("key")` de next-intl

## Skills de Referencia
@.claude/skills/01-tailwind-v4.md
@.claude/skills/02-shadcn-components.md
@.claude/skills/03-responsive-design.md
@.claude/skills/04-api-consumption.md
@.claude/skills/05-typescript-patterns.md
@.claude/skills/06-nextjs-app-router.md
@.claude/skills/07-git-conventions.md
@.claude/skills/08-accessibility.md
@.claude/skills/09-i18n.md

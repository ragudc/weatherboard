# Skill: Next.js 15 App Router Patterns

## Decisión Server Component vs Client Component

| Criterio | Server Component | Client Component |
|---|---|---|
| Acceso a `process.env` privadas | ✅ | ❌ |
| Fetch directo a OpenWeatherMap | ✅ | ❌ |
| useState / useEffect | ❌ | ✅ |
| Interactividad (onClick, onChange) | ❌ | ✅ |
| Geolocalización del navegador | ❌ | ✅ |
| `useTranslations` de next-intl | ❌ | ✅ |
| `getTranslations` de next-intl | ✅ | ❌ |

## Regla de oro
**Todo lo que pueda ser Server Component, debe serlo.**
Solo agrega `"use client"` cuando sea estrictamente necesario.

## Marcador obligatorio
```tsx
// En la PRIMERA línea del archivo, antes de cualquier import
"use client"

import { useState } from "react"
```

## Estructura de rutas con i18n (next-intl)
```
src/app/
├── [locale]/
│   ├── layout.tsx       ← layout raíz con NextIntlClientProvider
│   ├── page.tsx         ← home (Server Component)
│   └── error.tsx        ← error boundary
└── api/
    └── weather/
        └── route.ts     ← sin locale, solo en inglés
```

## Metadatos SEO (Server Component)
```tsx
// src/app/[locale]/layout.tsx
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  }
}
```

## Layout raíz con next-intl
```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as "en" | "es")) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

## Manejo de errores en App Router
```tsx
// src/app/[locale]/error.tsx
"use client"

import { useTranslations } from "next-intl"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common")
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-destructive">{t("error")}</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset}>{t("retry")}</button>
    </div>
  )
}
```

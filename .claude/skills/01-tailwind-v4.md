# Skill: Tailwind CSS v4

## Configuración en WeatherBoard
Tailwind v4 usa configuración CSS-first. No existe `tailwind.config.ts`.
La configuración vive en `src/app/globals.css` usando directivas `@theme`.

## Breakpoints personalizados del proyecto
Los breakpoints se definen en `globals.css` bajo `@theme`:

| Prefijo | Min-width | Rango aproximado | Tipo de pantalla |
|---------|-----------|------------------|------------------|
| (base)  | 0px       | 0px – 639px      | Mobile (base, sin prefijo) |
| `xs:`   | 320px     | 320px – 639px    | Mobile pequeño (custom) |
| `sm:`   | 640px     | 640px – 767px    | Mobile grande / landscape |
| `md:`   | 768px     | 768px – 1023px   | Tablet |
| `lg:`   | 1024px    | 1024px – 1279px  | Laptop |
| `xl:`   | 1280px    | 1280px – 1535px  | Desktop |
| `2xl:`  | 1536px    | 1536px+          | Desktop grande |

Configuración en `globals.css`:
```css
@import "tailwindcss";

@theme {
  --breakpoint-xs: 20rem;    /* 320px */
  --breakpoint-sm: 40rem;    /* 640px */
  --breakpoint-md: 48rem;    /* 768px */
  --breakpoint-lg: 64rem;    /* 1024px */
  --breakpoint-xl: 80rem;    /* 1280px */
  --breakpoint-2xl: 96rem;   /* 1536px */
}
```

## Reglas de uso

### ✅ Correcto
```tsx
// Mobile first: base → xs → sm → md → lg → xl → 2xl
<div className="text-sm xs:text-base md:text-lg xl:text-xl">
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
<div className="p-4 md:p-6 xl:p-8">
```

### ❌ Incorrecto
```tsx
// Desktop first (prohibido en este proyecto)
<div className="text-xl md:text-lg sm:text-base">

// Colores hardcodeados (prohibido)
<div className="bg-blue-500 text-white">

// Usar style inline para spacing (prohibido)
<div style={{ padding: '16px' }}>
```

## Sintaxis Tailwind v4 actualizada

### Variables CSS del proyecto
```tsx
// Variables de color (definidas por shadcn en globals.css)
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"
className="border-border"
className="text-destructive"
```

### Variantes de rango (disponibles en v4)
```tsx
// Aplica SOLO entre sm y md (rango específico)
className="sm:max-md:text-center"

// Aplica SOLO en mobile (por debajo de md)
className="max-md:hidden"

// Aplica SOLO en desktop
className="max-lg:hidden"
```

### Animaciones con Tailwind v4
```tsx
// Transiciones
className="transition-all duration-300 ease-in-out"
className="hover:scale-105 active:scale-95"

// Opacity condicional
className="opacity-0 group-hover:opacity-100"
```

## Orden de clases (enforced by prettier-plugin-tailwindcss)
1. Layout (display, position, z-index)
2. Flexbox / Grid
3. Sizing (width, height)
4. Spacing (margin, padding)
5. Typography
6. Background / Border
7. Effects (shadow, opacity)
8. Transitions / Animations
9. Responsive prefixes (sm:, md:, etc.)
10. State prefixes (hover:, focus:, dark:)

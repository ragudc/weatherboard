# Skill: Responsive Web Design — Mobile First

## Filosofía del proyecto
WeatherBoard aplica mobile-first estricto:
1. Se escribe el estilo BASE para la pantalla más pequeña (320px)
2. Se agregan breakpoints hacia arriba para pantallas más grandes
3. Nunca se usa `max-width` como estrategia principal de layout

## Breakpoints del proyecto

| Prefijo Tailwind | Min-width | Dispositivos objetivo |
|---|---|---|
| (sin prefijo) | 0px | Todos los móviles desde 320px |
| `xs:` | 320px | Mobile pequeño (iPhone SE, etc.) |
| `sm:` | 640px | Mobile grande / landscape |
| `md:` | 768px | Tablets (iPad, etc.) |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Monitores grandes |

## Patrones de layout por breakpoint

### Grid adaptativo (patrón principal de WeatherBoard)
```tsx
// 1 columna en mobile → 2 en tablet → 4 en desktop
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">

// Sidebar + contenido
<div className="flex flex-col lg:flex-row gap-4">
  <aside className="w-full lg:w-64 shrink-0">
  <main className="flex-1 min-w-0">
```

### Tipografía responsive
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
<p className="text-sm md:text-base leading-relaxed">
<span className="text-xs md:text-sm text-muted-foreground">
```

### Espaciado responsive
```tsx
<section className="px-4 sm:px-6 lg:px-8 py-6 md:py-10">
<div className="gap-3 md:gap-4 xl:gap-6">
<div className="p-4 md:p-6">
```

### Visibilidad por breakpoint
```tsx
// Solo visible en mobile
<div className="block md:hidden">

// Solo visible en tablet y arriba
<div className="hidden md:block">

// Solo visible en desktop
<div className="hidden lg:flex">

// Oculto solo en mobile
<div className="hidden xs:block">
```

## Reglas críticas de scroll

| Elemento | Regla |
|---|---|
| `body` | ❌ Nunca `overflow-x: hidden` |
| Layout raíz | ❌ Nunca `overflow-x: hidden` |
| Tablas de datos | ✅ `overflow-x: auto` solo en el contenedor directo |
| Forecast horizontal | ✅ `overflow-x: auto` solo en el wrapper del scroll |

### Patrón correcto para scroll horizontal
```tsx
// ✅ Correcto: scroll solo en el contenedor
<div className="w-full overflow-x-auto">
  <div className="flex gap-3 min-w-max pb-2">
    {items.map(item => <ForecastCard key={item.dt} {...item} />)}
  </div>
</div>

// ❌ Incorrecto: scroll en el layout
<main className="overflow-x-hidden"> {/* NUNCA */}
```

## Componentes con comportamiento diferente por breakpoint

### SearchBar
- Mobile: full width, ocupa toda la línea
- md+: max-width contenido, centrado

### CurrentWeather Card
- Mobile: stack vertical (icono arriba, datos abajo)
- md+: layout horizontal (icono izquierda, datos derecha)

### DailyForecast
- Mobile: scroll horizontal con cards
- lg+: grid de 7 columnas

### TemperatureChart
- Mobile: altura 200px, sin eje Y
- md+: altura 300px, con eje Y completo

## Checklist antes de hacer commit de cualquier componente
- [ ] ¿El componente se ve bien en 375px (iPhone 14)?
- [ ] ¿El componente se ve bien en 768px (iPad)?
- [ ] ¿El componente se ve bien en 1440px (Desktop)?
- [ ] ¿No hay scroll horizontal involuntario en mobile?
- [ ] ¿Los textos son legibles en mobile (min 14px)?

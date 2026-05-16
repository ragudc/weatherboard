# Skill: Accessibility (a11y)

## Estándar objetivo: WCAG 2.1 AA

## Reglas obligatorias

### Imágenes e iconos
```tsx
// Icono decorativo → aria-hidden
<CloudIcon className="h-6 w-6" aria-hidden="true" />

// Icono con significado → aria-label traducido
<button aria-label={t("search.button")}>
  <SearchIcon className="h-5 w-5" aria-hidden="true" />
</button>
```

### Contraste de colores
- Texto normal: ratio mínimo 4.5:1
- Texto grande (18px+): ratio mínimo 3:1
- Siempre usa CSS variables de shadcn que ya pasan WCAG AA

### Formularios y controles
```tsx
// Siempre asocia label con input usando texto traducido
<Label htmlFor="city-search">{t("search.label")}</Label>
<Input id="city-search" placeholder={t("search.placeholder")} />

// Switch con label asociado y traducido
<Switch id="unit-toggle" aria-label={t("units.toggleLabel")} />
```

### Estados de carga accesibles
```tsx
// Anunciar loading a screen readers
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <WeatherSkeleton /> : <WeatherCard data={data} />}
</div>
```

### Navegación por teclado
- Todos los elementos interactivos deben ser accesibles con Tab
- Nunca elimines el outline de focus sin reemplazarlo
- shadcn/ui ya incluye focus-visible styles — no los sobreescribas

### Language switcher accesible
```tsx
// El botón de idioma debe anunciar el cambio
<button
  aria-label={locale === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
  onClick={toggleLocale}
>
  {locale === "en" ? "ES" : "EN"}
</button>
```

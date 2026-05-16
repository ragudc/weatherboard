# Skill: Git Conventions

## Formato de commits (Conventional Commits)
```
tipo(scope): descripción corta en inglés
```

## Tipos permitidos
| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `chore` | Configuración, dependencias |
| `style` | Cambios de estilos/CSS |
| `refactor` | Refactorización sin cambio de funcionalidad |
| `docs` | Documentación |
| `test` | Tests |
| `perf` | Mejora de rendimiento |

## Ejemplos de commits correctos
```
feat(weather): add current weather card component
fix(api): handle city not found error from OpenWeatherMap
style(forecast): fix mobile card overflow on small screens
chore(deps): add framer-motion dependency
refactor(hooks): extract useWeather into separate file
docs(readme): add screenshots and setup instructions
feat(i18n): add Spanish translations for weather namespace
```

## Scopes del proyecto
`weather` | `forecast` | `api` | `ui` | `hooks` | `types` | `config` | `layout` | `chart` | `search` | `i18n`

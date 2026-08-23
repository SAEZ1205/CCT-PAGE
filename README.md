# CCT-PAGE

Sitio web del Centro Cultural de Telecomunicaciones (CCT-UNI).

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Node 24 LTS

## Regla principal

La raíz del repositorio **es el proyecto**. No hay copias anidadas ni implementaciones `v2`, `v3`, `final`, `backup`, `copy`, etc. Cada bloque visible tiene un solo dueño.

Para cambiar una imagen consulta [`IMAGE_MAP.md`](./IMAGE_MAP.md). La operación preferida es reemplazar el asset conservando exactamente el mismo nombre y extensión.

## Estructura actual

```text
CCT-PAGE/
├─ assets/                              # imágenes, videos y recursos
├─ scripts/
│  ├─ check-architecture.mjs            # contrato estructural
│  ├─ check-dist.mjs                    # smoke test de producción
│  └─ deep-audit.mjs                    # auditoría de deuda/acoplamiento
├─ src/
│  ├─ features/
│  │  ├─ home/career.ts                 # Conoce tu carrera
│  │  ├─ home/calendar.ts               # calendario de Inicio
│  │  ├─ nosotros/nosotros.ts           # Nosotros
│  │  ├─ formation/formation.ts         # Formación + Academias
│  │  ├─ formation/openCourse.ts        # Open Course
│  │  ├─ community/community.ts         # Comunidad
│  │  ├─ events/events.ts               # Eventos
│  │  └─ shared/ui.ts                   # UI compartida
│  ├─ pages/
│  │  └─ <pagina>/markup.html           # markup canónico por vista
│  ├─ layout/                           # header/footer/modales separados
│  ├─ legacy/runtime.ts                 # puente controlado hacia site.js
│  └─ styles/sections/                  # CSS canónico por sección
├─ site.js                              # compatibilidad global: navegación/modales
├─ course.html/css/js                   # página autónoma Open Course
├─ styles.css                           # base visual histórica global
├─ package.json
├─ package-lock.json                    # dependencias reproducibles
└─ vite.config.ts
```

## Eliminado del runtime principal

```text
src/legacy/snapshot.html
src/legacy/extract.ts
career.js
calendar.js
nosotros.js
formation.js
community.js
events.js
src/styles/compat-fixes.css
```

Las siete vistas ya no se extraen desde un documento HTML monolítico: cada una vive en su propio `markup.html` y React las ensambla desde `src/App.tsx`.

“Conoce tu carrera” y el calendario de Inicio ya son TypeScript y sus estilos viven en `src/styles/sections/inicio.css`; no se autoejecutan como scripts externos ni inyectan CSS en el `<head>`.

## Desarrollo local

Primera vez:

```bash
npm ci
npm run dev
```

Siguientes veces:

```bash
git pull
npm ci
npm run dev
```

En Windows también puedes ejecutar `INICIAR_CCT.bat`.

## Build y verificaciones

```bash
npm run build
```

Ese comando ejecuta:

1. `check:architecture`: owners, markup canónico, runtime, assets y ausencia de dobles.
2. `tsc --noEmit`: TypeScript.
3. `vite build`: genera `dist/`.
4. `check:dist`: valida la salida publicada, rutas, assets y JavaScript.

Para una auditoría estructural adicional:

```bash
node scripts/deep-audit.mjs
```

La salida final se genera en `dist/`. CI y GitHub Pages instalan dependencias con `npm ci` usando `package-lock.json`.

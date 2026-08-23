# CCT-PAGE

Sitio web del Centro Cultural de Telecomunicaciones (CCT-UNI).

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS

## Regla principal
La raíz del repositorio **es el proyecto**. No hay copias anidadas de `CCT-PAGE` ni archivos `v2`, `v3`, `final`, `final2`, etc. Una sección tiene una sola implementación activa.

Para cambios de imágenes consulta [`IMAGE_MAP.md`](./IMAGE_MAP.md). La regla preferida es reemplazar el asset conservando su mismo nombre y extensión, sin crear otra capa de código.

## Estructura

```text
CCT-PAGE/
├─ assets/                         # imágenes, videos y recursos
├─ scripts/
│  ├─ check-architecture.mjs       # evita dobles, assets rotos y owners incorrectos
│  └─ check-dist.mjs               # smoke test de la salida real de producción
├─ src/
│  ├─ features/
│  │  ├─ nosotros/nosotros.ts      # Nosotros
│  │  ├─ formation/formation.ts    # Formación + Academias
│  │  ├─ formation/openCourse.ts   # Open Course
│  │  ├─ community/community.ts    # Comunidad
│  │  └─ events/events.ts          # Eventos
│  ├─ pages/                       # vistas montadas por React
│  ├─ legacy/                      # snapshot temporal + runtime global
│  └─ styles/
│     └─ sections/                 # un CSS canónico por sección
├─ site.js                         # navegación y comportamiento global
├─ career.js                       # Conoce tu carrera (Inicio)
├─ calendar.js                     # calendario general (Inicio)
├─ course.html/css/js              # aula de Open Course
├─ styles.css                      # diseño visual base
├─ package.json
├─ package-lock.json               # dependencias reproducibles
└─ vite.config.ts
```

## Qué ya no existe en el runtime

```text
nosotros.js
formation.js
community.js
events.js
src/styles/compat-fixes.css
assets/nosotros-slide-*.b64
```

Nosotros, Formación, Comunidad y Eventos se inicializan desde TypeScript después del runtime global. Open Course solo lo controla `src/features/formation/openCourse.ts` y sus estilos viven en `src/styles/sections/formacion.css`.

`src/legacy/snapshot.html` todavía conserva el markup base aprobado mientras se migra gradualmente a JSX, pero no ejecuta lógica ni vuelve a modificar las secciones.

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

Ese único comando ejecuta, en orden:

1. `check:architecture`: comprueba owners, vistas, rutas de assets, ausencia de copias/versiones y carga segura del runtime.
2. `tsc --noEmit`: valida TypeScript.
3. `vite build`: genera `dist/`.
4. `check:dist`: valida la salida real, rutas relativas, assets copiados y sintaxis de JavaScript.

La salida se genera en `dist/`. CI y GitHub Pages instalan dependencias con `npm ci` usando `package-lock.json`.

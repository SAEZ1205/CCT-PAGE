# CCT-PAGE

Sitio web del Centro Cultural de Telecomunicaciones (CCT-UNI).

## Stack

- React 18
- TypeScript en modo `strict`
- Vite
- Tailwind CSS
- Node 24 LTS
- `package-lock.json` + `npm ci`

## Regla principal

La raíz del repositorio **es el proyecto**. No hay copias anidadas ni implementaciones `v2`, `v3`, `final`, `backup`, `copy`, etc. Cada bloque visible tiene un solo dueño.

Para cambiar una imagen consulta [`IMAGE_MAP.md`](./IMAGE_MAP.md). La operación preferida es reemplazar el asset conservando exactamente el mismo nombre y extensión.

## Estructura actual

```text
CCT-PAGE/
├─ assets/                              # imágenes, videos y recursos
├─ scripts/
│  ├─ check-frontend-readiness.mjs      # contrato de frontend / producción
│  ├─ check-architecture.mjs            # contrato estructural
│  ├─ check-dist.mjs                    # salida final de producción
│  ├─ check-browser.mjs                 # Chrome real
│  └─ deep-audit.mjs                    # auditoría de deuda/acoplamiento
├─ src/
│  ├─ components/
│  │  ├─ TrustedStaticShell.tsx         # único límite React → HTML estático aprobado
│  │  └─ AppErrorBoundary.tsx           # recuperación ante fallos de render
│  ├─ features/
│  │  ├─ home/career.ts                 # Conoce tu carrera
│  │  ├─ home/calendar.ts               # calendario de Inicio
│  │  ├─ nosotros/nosotros.ts           # Nosotros
│  │  ├─ formation/formation.ts         # Formación + Academias
│  │  ├─ formation/openCourse.ts        # Open Course dentro de Formación
│  │  ├─ community/community.ts         # Comunidad
│  │  ├─ events/events.ts               # Eventos
│  │  └─ shared/ui.ts                   # UI compartida
│  ├─ pages/
│  │  └─ <pagina>/markup.html           # markup canónico por vista
│  ├─ layout/                           # header/footer/modales separados
│  ├─ legacy/runtime.ts                 # puente controlado hacia site.js
│  └─ styles/sections/                  # CSS canónico por sección
├─ site.js                              # núcleo legacy congelado: navegación/modales existentes
├─ course.html/css/js                   # página autónoma Open Course
├─ styles.css                           # base visual histórica congelada
├─ package.json
├─ package-lock.json                    # dependencias reproducibles
├─ .nvmrc                               # Node 24
└─ vite.config.ts
```

## React y markup existente

Las siete vistas mantienen temporalmente el HTML visual aprobado en archivos independientes. `src/App.tsx` los ensambla y **solo** `TrustedStaticShell.tsx` puede usar el límite de HTML estático de React.

Esto es deliberado: evita una reescritura masiva que pueda cambiar el diseño aprobado y, al mismo tiempo, impide repartir HTML crudo por nuevos componentes. Las nuevas interfaces interactivas deben implementarse en React/TypeScript; la migración del contenido existente a JSX se hace por sección, no de golpe.

`AppErrorBoundary` protege el root para que un error de render no termine silenciosamente en una pantalla blanca.

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

No deben volver a crearse.

## Desarrollo local

Primera vez o después de actualizar dependencias:

```bash
npm ci
npm run dev
```

Para retomar trabajo:

```bash
git pull
npm ci
npm run dev
```

En Windows también puedes ejecutar `INICIAR_CCT.bat`. El proyecto está estandarizado en Node 24.x.

## Flujo recomendado para frontend

### Imagen

```text
IMAGE_MAP.md → reemplazar mismo asset → npm run check:all
```

### Texto / estructura visual existente

```text
src/pages/<pagina>/markup.html → CSS canónico de esa sección → npm run check:all
```

### Interacción o componente nuevo

```text
React/TypeScript → CSS canónico → npm run check:all
```

No agregar lógica nueva a `site.js`, handlers inline nuevos ni nuevos owners basados en `innerHTML`.

## Verificaciones

Para una revisión completa local:

```bash
npm run check:all
```

Incluye:

1. `audit:deep`: mide deuda y acoplamiento.
2. `check:frontend`: congela el legacy y revisa seguridad/mantenibilidad básica.
3. `check:architecture`: owners, vistas, runtime y assets.
4. `tsc --noEmit`: TypeScript estricto.
5. `vite build`: genera `dist/`.
6. `check:dist`: valida la salida que realmente se publica.
7. `check:browser`: abre Chrome real y prueba las 7 vistas, fallback de ruta y Open Course.

CI además ejecuta auditoría de vulnerabilidades de dependencias de producción. GitHub Pages ejecuta el smoke test de Chrome **antes** de desplegar.

## Producción

- Vercel usa `npm run build` y `dist/`.
- `vercel.json` define headers básicos de seguridad.
- GitHub Pages publica el mismo `dist/` después de pasar build y navegador real.
- Las rutas internas de la SPA usan hash, por lo que funcionan tanto en dominio raíz como bajo una subruta de GitHub Pages.

Consulta también [`ARCHITECTURE_REACT.md`](./ARCHITECTURE_REACT.md) para las reglas detalladas del proyecto.

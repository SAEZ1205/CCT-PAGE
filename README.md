# CCT-PAGE

Sitio web del Centro Cultural de Telecomunicaciones (CCT-UNI).

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS

## Regla principal
La raíz del repositorio **es el proyecto**. No hay copias anidadas de `CCT-PAGE` ni archivos `v2`, `v3`, `final`, `final2`, etc. Una sección tiene una sola implementación activa.

## Estructura

```text
CCT-PAGE/
├─ assets/                         # imágenes, videos y recursos
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

Nosotros, Formación, Comunidad y Eventos se inicializan desde TypeScript después del runtime global. Open Course solo lo controla `src/features/formation/openCourse.ts`.

`src/legacy/snapshot.html` todavía conserva el markup base aprobado mientras se migra gradualmente a JSX, pero no ejecuta lógica ni vuelve a modificar las secciones.

## Desarrollo local

Primera vez:
```bash
npm install
npm run dev
```

Siguientes veces:
```bash
git pull
npm run dev
```

En Windows también puedes ejecutar `INICIAR_CCT.bat`.

## Build
```bash
npm run build
```

La salida se genera en `dist/`. El build debe pasar antes de fusionar cambios grandes a `main`.

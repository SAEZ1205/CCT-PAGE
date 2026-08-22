# CCT-PAGE

Sitio web del Centro Cultural de Telecomunicaciones (CCT-UNI).

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS

## Regla principal
La raíz del repositorio **es el proyecto**. No hay copias de `CCT-PAGE` ni proyectos anidados.

## Estructura

```text
CCT-PAGE/
├─ assets/                 # imágenes, videos y recursos
├─ src/                    # React + TypeScript
│  ├─ features/            # funcionalidades modernas (Open Course, etc.)
│  ├─ pages/               # vistas principales
│  ├─ legacy/              # snapshot temporal para conservar el DOM aprobado
│  └─ styles/
├─ site.js                 # navegación y comportamiento general
├─ career.js               # Conoce tu carrera
├─ calendar.js             # calendario de Inicio
├─ nosotros.js             # personalización final de Nosotros
├─ formation.js            # Academia CCT + certificaciones
├─ course.html/css/js      # aula de Open Course
├─ styles.css              # diseño visual base
├─ package.json
└─ vite.config.ts
```

Los antiguos archivos numerados (`*-v2.js`, `*-v3.js`, etc.) ya no forman parte del runtime. Cada área tiene una única fuente activa.

Open Course ya no tiene un script legacy adicional: vive en `src/features/formation/openCourse.ts`, por lo que React/TypeScript es su única fuente de verdad.

## Desarrollo local

La primera vez:
```bash
npm install
npm run dev
```

Las siguientes veces:
```bash
git pull
npm run dev
```

En Windows también puedes ejecutar `INICIAR_CCT.bat`.

## Build
```bash
npm run build
```

La salida se genera en `dist/`.

## Seguridad de cambios
Antes de esta limpieza se creó la rama `backup-pre-cleanup-2026-08-22`, que conserva el estado visual previo completo para comparar o recuperar cualquier detalle.

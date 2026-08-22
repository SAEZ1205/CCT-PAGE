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
├─ src/                    # aplicación React + TypeScript
│  ├─ pages/               # vistas principales
│  ├─ features/            # funcionalidades modernas
│  ├─ legacy/              # snapshot temporal para conservar el DOM visual
│  └─ styles/
├─ site.js                 # comportamiento general
├─ career.js               # Conoce tu carrera
├─ calendar.js             # calendario de Inicio
├─ nosotros.js             # personalización final de Nosotros
├─ formation.js            # hero + academias de Formación
├─ open-course.js          # tarjetas Open Course
├─ course.html/css/js      # aula de cursos
├─ styles.css              # estilos visuales base
├─ package.json
└─ vite.config.ts
```

Los antiguos archivos numerados (`*-v2.js`, `*-v3.js`, etc.) ya no forman parte del runtime. Cada área tiene una única fuente activa, evitando que un archivo antiguo vuelva a sobrescribir cambios nuevos.

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
Antes de esta limpieza se creó la rama `backup-pre-cleanup-2026-08-22`, que conserva el estado visual previo completo por si alguna vez fuese necesario comparar o recuperar algo.

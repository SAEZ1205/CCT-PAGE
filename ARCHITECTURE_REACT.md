# Arquitectura React del CCT

## Objetivo
El proyecto debe tener **un solo dueño por sección**. No se crean archivos `v2`, `v3`, `final`, `final2`, ni scripts que vuelvan a modificar una sección después de que otra capa ya la construyó.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS con prefijo `tw-` y preflight desactivado

## Estructura activa

### React
`src/App.tsx` monta el DOM base y, cuando termina el runtime global, inicializa las features TypeScript de cada sección.

### Snapshot temporal
`src/legacy/snapshot.html` conserva únicamente el **markup base** del frontend aprobado. `src/legacy/extract.ts` extrae las vistas para montarlas desde React.

El snapshot **no ejecuta scripts, no cambia imágenes y no vuelve a escribir secciones**. Es un paso temporal hasta migrar el markup completo a JSX.

### Runtime global legacy
Solo quedan tres scripts históricos cargados por `src/legacy/runtime.ts`:

```text
site.js        navegación, modales y comportamiento global
career.js      bloque Conoce tu carrera de Inicio
calendar.js    calendario general de Inicio
```

No se cargan scripts legacy para Nosotros, Formación, Comunidad ni Eventos.

### Secciones TypeScript
Cada sección tiene una única feature activa:

```text
src/features/nosotros/nosotros.ts        Nosotros
src/features/formation/formation.ts      Hero + Academias
src/features/formation/openCourse.ts     Open Course
src/features/community/community.ts      Comunidad
src/features/events/events.ts            Eventos
```

`formation.ts` no modifica Open Course. `openCourse.ts` es su único dueño.

### Estilos

```text
styles.css                               base histórica visual
src/styles/tailwind.css                  solo Tailwind + shell React
src/styles/sections/nosotros.css         Nosotros
src/styles/sections/formacion.css        Formación
src/styles/sections/comunidad.css        Comunidad
src/styles/sections/eventos.css          Eventos
```

Ya no existe `compat-fixes.css` ni CSS inyectado por scripts de esas cuatro secciones.

## Assets
Las imágenes se consumen como archivos normales desde `assets/` mediante Vite. No se usan archivos `.b64` ni `fetch()` para construir imágenes en tiempo de ejecución.

## Regla para cambios futuros
1. Cambiar la sección en su feature TypeScript.
2. Cambiar su estilo en su CSS canónico.
3. Cambiar imágenes reemplazando o apuntando a un asset normal.
4. No crear una segunda implementación del mismo bloque.
5. Antes de fusionar a `main`, ejecutar `npm run build`.

## Build
```bash
npm run build
```

La configuración de Vite usa rutas relativas (`base: './'`) para evitar depender de `process.env` y funcionar tanto en local como en despliegues estáticos.

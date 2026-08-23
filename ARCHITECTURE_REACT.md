# Arquitectura React del CCT

## Objetivo
El proyecto debe tener **un solo dueño por sección**. No se crean archivos `v2`, `v3`, `final`, `final2`, `old`, `backup`, `copy`, etc., ni scripts que vuelvan a modificar una sección después de que otra capa ya la construyó.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS con prefijo `tw-` y preflight desactivado
- Dependencias bloqueadas mediante `package-lock.json`

## Estructura activa

### React
`src/App.tsx` monta el DOM base y, cuando termina el runtime global, inicializa las features TypeScript de cada sección. Cada feature se inicializa de forma aislada: si una sección falla, las demás siguen arrancando.

### Snapshot temporal
`src/legacy/snapshot.html` conserva únicamente el **markup base** del frontend aprobado. `src/legacy/extract.ts` extrae las vistas para montarlas desde React.

El snapshot **no ejecuta scripts, no cambia imágenes y no vuelve a escribir secciones**. Es un paso temporal hasta migrar el markup completo a JSX.

El chequeo automático exige exactamente una copia de cada vista: Inicio, Nosotros, Formación, Comunidad, Eventos, TELCON y Recursos.

### Runtime global legacy
Solo quedan tres scripts históricos cargados por `src/legacy/runtime.ts`:

```text
site.js        navegación, modales y comportamiento global
career.js      bloque Conoce tu carrera de Inicio
calendar.js    calendario general de Inicio
```

`site.js` ya no se arranca mediante un `DOMContentLoaded` artificial. El runtime espera al evento nativo y luego ejecuta únicamente `ALLOWED_SITE_INITIALIZERS`, una lista blanca de funciones globales permitidas.

`index.html` **no puede** cargar `site.js`, `career.js` ni `calendar.js` directamente. El build falla si alguien vuelve a hacerlo.

No deben añadirse a la lista blanca inicializadores antiguos de Academias, Formación, Comunidad o Eventos. Esas áreas pertenecen a TypeScript.

### Secciones TypeScript
Cada sección tiene una única feature activa:

```text
src/features/nosotros/nosotros.ts        Nosotros
src/features/formation/formation.ts      Hero + Academias
src/features/formation/openCourse.ts     Open Course
src/features/community/community.ts      Comunidad
src/features/events/events.ts            Eventos
src/features/shared/ui.ts                motion + accesibilidad compartida
```

`formation.ts` no modifica Open Course. `openCourse.ts` es su único dueño y tiene guard idempotente para no volver a renderizar el bloque si ya está inicializado.

### Estilos

```text
styles.css                               base histórica visual
src/styles/tailwind.css                  solo Tailwind + shell React
src/styles/sections/nosotros.css         Nosotros
src/styles/sections/formacion.css        Formación + Open Course
src/styles/sections/comunidad.css        Comunidad
src/styles/sections/eventos.css          Eventos
```

Ya no existe `compat-fixes.css`. Las features TypeScript no pueden crear `<style>` dinámicamente: `check:architecture` lo bloquea para evitar otra capa visual escondida.

## Assets
Las imágenes se consumen como archivos normales desde `assets/` mediante Vite. No se usan archivos `.b64` ni `fetch()` para construir imágenes en tiempo de ejecución.

Para reemplazar una imagen aprobada, la opción más segura es **sustituir el archivo conservando exactamente el mismo nombre y extensión**. Así no hace falta tocar TypeScript, JavaScript ni CSS.

El mapa de assets visibles está documentado en [`IMAGE_MAP.md`](./IMAGE_MAP.md).

La verificación de arquitectura reconoce tanto rutas directas `assets/...` como los helpers `asset('archivo.webp')` usados por `career.js` y `calendar.js`.

## Regla para cambios futuros
1. Identificar el asset o sección canónica.
2. Para una imagen simple, reemplazar el asset manteniendo el mismo nombre.
3. Si cambia lógica, editar la feature TypeScript dueña de la sección.
4. Si cambia estilo, editar su CSS canónico.
5. No crear una segunda implementación del mismo bloque.
6. No volver a disparar `DOMContentLoaded` manualmente.
7. Ejecutar `npm run build` antes de fusionar a `main`.

## Guardas automáticas

### Arquitectura

```bash
npm run check:architecture
```

Bloquea o comprueba:
- archivos versionados/copias (`v2`, `final`, `old`, `backup`, `copy`, etc.);
- `.b64`;
- scripts legacy prohibidos;
- carga directa de scripts legacy desde `index.html`;
- orden seguro del runtime (`DOMContentLoaded` nativo antes de `site.js`);
- inicializadores legacy reactivados;
- vistas duplicadas o faltantes en el snapshot;
- CSS dinámico dentro de `src/features`;
- guard idempotente de Open Course;
- configuración `base: './'` de Vite;
- archivos estáticos que deben copiarse a `dist`;
- rutas directas y dinámicas de imágenes/videos inexistentes.

### Producción

```bash
npm run check:dist
```

Se ejecuta después de Vite y comprueba la salida real:
- `dist/index.html` no puede apuntar a `/src/main.tsx`;
- no puede haber rutas locales absolutas que rompan GitHub Pages;
- todos los assets fuente deben llegar a `dist/assets` y no estar vacíos;
- referencias locales de HTML/CSS deben existir;
- todos los JavaScript de `dist` deben tener sintaxis válida;
- los archivos estáticos requeridos (`site.js`, `career.js`, `calendar.js`, `course.*`) deben existir.

## Dependencias y CI

`package-lock.json` fija el grafo exacto de dependencias. CI y GitHub Pages usan:

```bash
npm ci
```

Así una compilación futura no cambia de dependencias sin que cambie también el lockfile.

## Build

```bash
npm run build
```

Ejecuta arquitectura → TypeScript → Vite → smoke test de `dist`.

La configuración de Vite usa rutas relativas (`base: './'`) para funcionar en local, GitHub Pages y otros despliegues estáticos.

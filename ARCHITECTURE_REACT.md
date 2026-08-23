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
`src/App.tsx` monta el DOM base y, cuando termina el runtime global, inicializa las features TypeScript de cada sección. Cada feature se inicializa de forma aislada: si una sección falla, las demás siguen arrancando.

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

`site.js` ya no se arranca mediante un `DOMContentLoaded` artificial. El runtime espera al evento nativo y luego ejecuta únicamente `ALLOWED_SITE_INITIALIZERS`, una lista blanca de funciones globales permitidas.

No deben añadirse a esa lista inicializadores antiguos de Academias, Formación, Comunidad o Eventos. Esas áreas pertenecen a TypeScript.

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

Para reemplazar una imagen aprobada, la opción más segura es **sustituir el archivo conservando exactamente el mismo nombre y extensión**. Así no hace falta tocar TypeScript, JavaScript ni CSS.

Si se cambia el nombre del archivo, se actualiza únicamente la fuente canónica que lo referencia. `npm run build` verifica que las rutas de assets activas existan.

## Regla para cambios futuros
1. Cambiar la sección en su feature TypeScript.
2. Cambiar su estilo en su CSS canónico.
3. Para una imagen simple, preferir reemplazar el asset manteniendo el mismo nombre.
4. No crear una segunda implementación del mismo bloque.
5. No volver a disparar `DOMContentLoaded` manualmente.
6. Antes de fusionar a `main`, ejecutar `npm run build`.

## Guardas automáticas

```bash
npm run check:architecture
```

Esta comprobación bloquea:
- archivos `v2`, `v3`, `final`, etc.;
- `.b64`;
- scripts legacy prohibidos;
- inicializadores antiguos dentro de la lista blanca;
- rutas de imágenes o videos inexistentes.

`npm run build` ejecuta esta comprobación automáticamente antes de TypeScript y Vite.

## Build
```bash
npm run build
```

La configuración de Vite usa rutas relativas (`base: './'`) para funcionar en local, GitHub Pages y otros despliegues estáticos.

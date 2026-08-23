# Arquitectura React del CCT

## Objetivo

El proyecto debe tener **un solo dueño por bloque visible**. Una corrección simple —por ejemplo reemplazar una imagen— no debe crear una segunda versión de una sección, un script auxiliar, CSS inyectado ni un snapshot paralelo.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS con prefijo `tw-` y preflight desactivado
- Node 24 LTS
- dependencias bloqueadas por `package-lock.json`

## Fuente de verdad del markup

El snapshot monolítico fue retirado. Ya no existen:

```text
src/legacy/snapshot.html
src/legacy/extract.ts
```

Cada vista conserva su HTML aprobado en un archivo independiente:

```text
src/pages/inicio/markup.html
src/pages/nosotros/markup.html
src/pages/formacion/markup.html
src/pages/comunidad/markup.html
src/pages/eventos/markup.html
src/pages/telcon/markup.html
src/pages/recursos/markup.html
```

Cada `src/pages/<pagina>/index.ts` importa únicamente su `markup.html?raw`. De esta forma editar una vista no obliga a tocar un documento gigante que contiene toda la aplicación.

El layout también está separado:

```text
src/layout/before-main.html   header + elementos previos al main
src/layout/footer.html        footer
src/layout/after-main.html    modales y elementos posteriores al main
src/layout/markup.ts          importa esos tres fragmentos
```

Ningún fragmento canónico puede contener `<script>`.

## React y features

`src/App.tsx` ensambla los fragmentos y después inicializa cada feature de forma aislada. Si una feature falla, las demás siguen intentando arrancar.

Dueños activos:

```text
src/features/home/career.ts                 Inicio · Conoce tu carrera
src/features/home/calendar.ts               Inicio · calendario general
src/features/nosotros/nosotros.ts           Nosotros
src/features/formation/formation.ts         Formación · hero + academias
src/features/formation/openCourse.ts        Formación · Open Course
src/features/community/community.ts         Comunidad
src/features/events/events.ts               Eventos
src/features/shared/ui.ts                    motion + accesibilidad común
```

Las features deben ser idempotentes cuando reconstruyen un bloque: una segunda llamada no puede duplicar el contenido ni agregar listeners repetidos.

## Runtime de compatibilidad

Queda un solo script histórico global:

```text
site.js
```

Su función es mantener navegación, modales y acciones que todavía están conectadas mediante handlers HTML existentes. `site.js` **no se autoejecuta** con `DOMContentLoaded`.

`src/legacy/runtime.ts` espera al DOM nativo, carga `site.js` y ejecuta únicamente una lista blanca reducida de inicializadores globales. El build bloquea la reaparición de inicializadores retirados de Formación, Eventos, Comunidad o Inicio.

Ya no existen ni se distribuyen:

```text
career.js
calendar.js
```

Sus comportamientos pasaron a TypeScript y sus estilos a CSS canónico.

## Estilos

```text
styles.css                               base histórica visual global
src/styles/tailwind.css                  Tailwind + shell React
src/styles/sections/inicio.css           Inicio dinámico migrado
src/styles/sections/nosotros.css         Nosotros
src/styles/sections/formacion.css        Formación + Open Course
src/styles/sections/comunidad.css        Comunidad
src/styles/sections/eventos.css          Eventos
course.css                               página autónoma de Open Course
```

`styles.css` sigue siendo la base visual histórica. No ejecuta lógica ni modifica el DOM. Se mantiene porque su cascada forma parte de la apariencia aprobada; las nuevas correcciones específicas deben ir al CSS canónico de la sección correspondiente, no agregar más parches al archivo global.

Las features TypeScript **no pueden crear `<style>` dinámicamente**. `check:architecture` falla si vuelve a aparecer ese patrón.

## Assets e imágenes

Los recursos visibles viven en `assets/`. Para un reemplazo visual simple:

1. identificar el asset en `IMAGE_MAP.md`;
2. reemplazar el archivo conservando el mismo nombre y extensión;
3. ejecutar `npm run build`;
4. no tocar TS/JS/CSS si no es necesario.

No se permiten `.b64`, archivos `-v2`, `-final`, `-copy`, etc. Tampoco deben coexistir dos formatos del mismo asset solo para conservar una versión vieja.

## Página autónoma Open Course

`course.html`, `course.css` y `course.js` forman una página estática independiente que se abre desde las tarjetas de Open Course. No intervienen en el arranque del SPA principal.

## Guardas automáticas

### `npm run check:architecture`

Comprueba, entre otros puntos:

- que existan las siete fuentes de markup canónicas;
- que cada vista tenga exactamente un `data-view` y un `#view-*`;
- que no reaparezcan `snapshot.html`, `extract.ts`, `career.js` o `calendar.js`;
- que no haya scripts embebidos en los fragmentos;
- que `site.js` no tenga autoarranque `DOMContentLoaded` ni funciones retiradas;
- que runtime cargue únicamente el núcleo permitido;
- que `App.tsx` inicialice los owners TypeScript actuales;
- que `main.tsx` cargue todos los CSS canónicos;
- que ninguna feature inyecte CSS dinámico;
- que Vite mantenga `base: './'`;
- que los assets referenciados existan;
- que no aparezcan implementaciones `v2`, `final`, `old`, `backup`, `copy`, etc.;
- que la cantidad de handlers inline no aumente sobre el límite temporal existente.

### `npm run check:dist`

Después de Vite valida lo que realmente se va a publicar:

- archivos obligatorios de producción;
- ausencia de `career.js` y `calendar.js` retirados;
- bundle ESM relativo para GitHub Pages;
- ausencia de rutas locales absolutas;
- todos los assets copiados y no vacíos;
- referencias HTML/CSS locales existentes;
- sintaxis válida de todos los JavaScript del `dist`.

### Auditoría profunda

`scripts/deep-audit.mjs` mide deuda estructural: handlers inline, tamaño de `site.js`, `!important`, assets duplicados, imports legacy y adopción del markup canónico. Sirve para evitar que el proyecto vuelva a crecer hacia una arquitectura híbrida descontrolada.

## Flujo de cambios

Para una imagen:

```text
asset existente -> reemplazar mismo archivo -> npm run build
```

Para lógica:

```text
feature dueña -> editar TypeScript -> npm run build
```

Para estilo:

```text
CSS canónico de la sección -> editar -> npm run build
```

Nunca crear una segunda implementación del mismo bloque para “no tocar la anterior”.

## Build

```bash
npm ci
npm run build
```

Orden efectivo:

```text
check:architecture
→ TypeScript
→ Vite
→ check:dist
```

La salida estática vive en `dist/` y usa rutas relativas para funcionar tanto en Vercel como bajo la subruta de GitHub Pages.

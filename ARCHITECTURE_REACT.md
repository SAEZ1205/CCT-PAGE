# Arquitectura frontend del CCT

## Objetivo

El proyecto debe permitir cambios de frontend simples y predecibles sin reactivar capas antiguas, duplicar implementaciones ni provocar pantallas en blanco. Cada bloque visible tiene un solo dueño y las reglas importantes están automatizadas en CI.

## Stack

- React 18
- TypeScript `strict`
- Vite
- Tailwind CSS con prefijo `tw-` y preflight desactivado
- Node 24 LTS (`package.json` + `.nvmrc`)
- dependencias reproducibles mediante `package-lock.json` + `npm ci`

## Estrategia de migración

La interfaz aprobada nació como HTML/CSS/JavaScript y se está migrando a React de forma incremental. **No se hará una reescritura masiva de toda la interfaz a JSX solo por purismo**, porque eso aumenta el riesgo visual sin aportar valor inmediato.

La regla actual es:

1. el markup estático aprobado puede permanecer temporalmente en plantillas por vista;
2. React lo monta a través de un único límite controlado;
3. toda interacción o componente NUEVO debe escribirse en React/TypeScript;
4. el legacy existente queda congelado y solo puede reducirse, nunca crecer;
5. cada sección se puede migrar a JSX de forma aislada cuando sea conveniente.

## Fuente de verdad del markup

No existe snapshot monolítico. Cada vista tiene su propio archivo:

```text
src/pages/inicio/markup.html
src/pages/nosotros/markup.html
src/pages/formacion/markup.html
src/pages/comunidad/markup.html
src/pages/eventos/markup.html
src/pages/telcon/markup.html
src/pages/recursos/markup.html
```

El layout global está separado en:

```text
src/layout/before-main.html
src/layout/footer.html
src/layout/after-main.html
src/layout/markup.ts
```

Los fragmentos canónicos no pueden contener `<script>` ni `<style>`.

## Límite React → HTML estático

El único archivo autorizado para usar `dangerouslySetInnerHTML` es:

```text
src/components/TrustedStaticShell.tsx
```

El componente solo recibe strings importados desde archivos versionados dentro del repositorio. Nunca debe recibir contenido de usuario, URL, API, formulario o almacenamiento local.

`src/App.tsx` ensambla el markup y lo entrega a `TrustedStaticShell`; no puede inyectar HTML directamente.

Esta frontera única permite mantener la apariencia aprobada mientras las páginas se migran gradualmente a componentes JSX.

## Protección contra pantalla blanca

`src/main.tsx` monta la aplicación dentro de:

```text
src/components/AppErrorBoundary.tsx
```

Si React falla durante render, se muestra una interfaz de recuperación con botón de recarga en lugar de dejar una página vacía.

`index.html` conserva además un fallback previo al arranque de React para errores que ocurran antes del primer render.

## Owners interactivos actuales

```text
src/features/home/career.ts                 Inicio · Conoce tu carrera
src/features/home/calendar.ts               Inicio · calendario
src/features/nosotros/nosotros.ts           Nosotros
src/features/formation/formation.ts         Formación · hero + academias
src/features/formation/openCourse.ts        Formación · Open Course
src/features/community/community.ts         Comunidad
src/features/events/events.ts               Eventos
src/features/shared/ui.ts                    motion + accesibilidad común
```

Estos archivos son una zona de transición: algunos todavía reconstruyen bloques con APIs DOM/`innerHTML`. `check:frontend` permite ese patrón solamente en esta lista histórica y prohíbe crear nuevos owners imperativos. Las nuevas funcionalidades deben preferir React/JSX.

## Runtime legacy congelado

Queda un solo núcleo global:

```text
site.js
```

Su función es mantener navegación, modales y acciones conectadas a handlers HTML existentes. No se autoejecuta con `DOMContentLoaded`.

`src/legacy/runtime.ts` espera el DOM nativo, carga `site.js` y ejecuta solamente una lista blanca de inicializadores.

`site.js` está congelado en un presupuesto máximo de 58,650 bytes. El build falla si crece. La dirección permitida es reducirlo conforme las interacciones se migren a React.

No existen ni deben reaparecer:

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

## Handlers inline

Existen 106 atributos de evento inline heredados en el markup aprobado. Están congelados como deuda transicional: CI falla si el número aumenta.

Las funciones invocadas por estos handlers se verifican contra el runtime para evitar botones apuntando a funciones inexistentes.

Las interacciones nuevas deben usar React/TypeScript, no nuevos `onclick="..."`.

## Estilos

```text
styles.css                               base visual histórica global
src/styles/tailwind.css                  Tailwind + shell/error recovery
src/styles/sections/inicio.css           Inicio
src/styles/sections/nosotros.css         Nosotros
src/styles/sections/formacion.css        Formación + Open Course
src/styles/sections/comunidad.css        Comunidad
src/styles/sections/eventos.css          Eventos
course.css                               aula Open Course autónoma
```

`styles.css` está congelado en 125,128 bytes. No debe recibir features nuevas; las modificaciones modernas pertenecen al CSS canónico de su sección.

El proyecto mantiene temporalmente 445 declaraciones `!important`; CI impide que esa cantidad aumente. La dirección futura es reducirlas durante refactors controlados.

Las features no pueden crear `<style>` dinámico.

## Assets

Los recursos visibles viven en `assets/` y [`IMAGE_MAP.md`](./IMAGE_MAP.md) documenta los principales.

Para reemplazar una imagen:

```text
localizar asset → sustituir mismo nombre/extensión → npm run check:all
```

No crear `imagen-v2`, `imagen-final`, copias `.b64` ni formatos paralelos para conservar versiones viejas.

Guardas actuales:

- asset individual > 6 MiB: error;
- imagen > 2 MiB: advertencia de rendimiento;
- nombres de implementación versionados/copia: error;
- referencias a assets inexistentes: error.

## Open Course

`course.html`, `course.css` y `course.js` forman el aula autónoma de Open Course. No participan en el montaje React principal, pero sí forman parte del producto publicado.

El smoke test de Chrome abre `course.html` y verifica que `course.js` renderice módulos y lección.

## Seguridad y publicación

`index.html` contiene metadata básica para buscadores/social y favicon.

Vercel añade headers básicos:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `X-Frame-Options: SAMEORIGIN`

Los enlaces con `target="_blank"` deben usar `rel="noopener"`; CI lo valida.

El CI ejecuta `npm audit --omit=dev --audit-level=high` para dependencias de producción.

## Guardas automáticas

### `npm run check:frontend`

Comprueba, entre otros puntos:

- un solo límite `dangerouslySetInnerHTML`;
- `AppErrorBoundary` activo;
- legacy `site.js` y `styles.css` sin crecimiento;
- ningún nuevo owner TypeScript basado en `innerHTML`;
- handlers inline sin crecimiento;
- `!important` sin crecimiento;
- imágenes con `alt`;
- enlaces externos seguros;
- URLs HTTP/javascript prohibidas;
- metadatos básicos;
- Node 24 y lockfile;
- headers de Vercel;
- presupuesto de tamaño de assets.

### `npm run check:architecture`

Comprueba owners, archivos requeridos/prohibidos, unicidad de vistas, runtime, inicializadores, CSS canónicos y referencias a assets.

### `npm run check:dist`

Valida la salida de producción real: archivos requeridos, rutas relativas, assets copiados, referencias HTML/CSS y sintaxis JavaScript.

### `npm run check:browser`

Arranca `dist` y usa Chrome headless real para verificar:

- Inicio
- Nosotros
- Formación
- Comunidad
- Eventos
- TELCON
- Recursos
- fallback de una ruta inexistente a Inicio
- aula `course.html`
- que React haya retirado el fallback inicial
- que no aparezca el Error Boundary
- que los módulos TypeScript de Inicio se inicialicen

## Flujo de cambios

### Cambio simple de imagen

```text
IMAGE_MAP.md → mismo asset → npm run check:all
```

### Cambio de contenido/estructura existente

```text
markup de la vista → CSS canónico de esa vista → npm run check:all
```

### Componente o interacción nueva

```text
React/TypeScript → CSS canónico → npm run check:all
```

No agregar nueva lógica a `site.js`, no crear scripts globales auxiliares y no crear una segunda implementación del mismo bloque.

## Verificación completa

```bash
npm ci
npm run check:all
```

`check:all` ejecuta auditoría profunda, contrato frontend, TypeScript, Vite, validación de `dist` y navegador real.

GitHub Actions repite estas verificaciones en pull requests. GitHub Pages ejecuta Chrome antes de desplegar; por tanto un cambio que rompe el arranque del frontend no debe llegar al sitio publicado.

# Arquitectura React del CCT

La interfaz visual se conserva. La migración separa la aplicación por vistas sin rediseñar el frontend.

## Stack
- React
- TypeScript
- Vite
- Tailwind CSS (prefijo `tw-` y preflight desactivado para no alterar el diseño existente)

## Estructura

```text
src/
  App.tsx
  main.tsx
  layout/
    markup.ts
  legacy/
    extract.ts
    runtime.ts
    snapshot.html
  pages/
    inicio/
    nosotros/
    formacion/
    comunidad/
    eventos/
    telcon/
    recursos/
  styles/
    tailwind.css
```

Cada vista principal vive en su propia carpeta. `snapshot.html` es una capa de compatibilidad temporal que conserva exactamente el DOM previo mientras se migra cada sección a JSX puro de forma gradual, sin cambiar el frontend.

`script-original.js`, `career-v3.js` y `styles.css` se mantienen como compatibilidad visual durante esta etapa. Vite copia los recursos estáticos necesarios al build.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

El build queda en `dist/`.

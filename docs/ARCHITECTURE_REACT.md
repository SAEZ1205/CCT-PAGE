# Arquitectura React CCT

El sitio ya no ejecuta la versión HTML/JS antigua detrás de React.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS (prefijo `tw-`, preflight desactivado)

## Estructura
```text
src/
  App.tsx
  content/
    site-template.html
    extract.ts
  features/
    site/
    inicio/
    nosotros/
    formation/
  pages/
    inicio/
    nosotros/
    formacion/
    comunidad/
    eventos/
    telcon/
    recursos/
  styles/
```

`site-template.html` conserva únicamente el markup visual base para mantener el frontend mientras se migra cada vista a JSX. No se cargan scripts de esa plantilla: `extract.ts` elimina scripts y handlers inline. Toda la navegación y las ediciones activas se ejecutan desde TypeScript/React en `src/features`.

Open Course se monta con un root React independiente dentro de Formación, por lo que ningún script antiguo puede volver a reemplazar sus tarjetas.

Los antiguos `script-original.js`, `formation-v*.js`, `career-v3.js`, `calendar-v2.js`, `nosotros-v*.js` y `src/legacy/*` fueron retirados del runtime y del repositorio.

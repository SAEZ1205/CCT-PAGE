# Arquitectura React del CCT

La aplicación conserva el frontend existente, pero elimina la cadena de archivos versionados que se sobrescribían entre sí.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS con prefijo `tw-` y preflight desactivado

## Capas

### 1. React
`src/App.tsx` compone las vistas y controla el montaje principal.

### 2. Snapshot de compatibilidad
`src/legacy/snapshot.html` conserva temporalmente el DOM visual ya aprobado. `extract.ts` separa las vistas para que React las monte sin rediseñarlas. Esta capa existe para mantener fidelidad visual mientras cada sección se migra gradualmente a JSX puro.

### 3. Runtime estable
Ya no se cargan `nosotros-v2/v3` ni `formation-v2/v3/v4/v5/v6` simultáneamente.

Solo existen estas fuentes activas:

```text
site.js          comportamiento general y navegación
career.js        Conoce tu carrera
calendar.js      calendario de Inicio
nosotros.js      Nosotros
formation.js     hero y academias de Formación
open-course.js   Open Course
```

`src/legacy/runtime.ts` las carga en orden y de forma aislada. Si un módulo secundario falla, el resto de la página sigue inicializando en lugar de quedar completamente en blanco.

### 4. Estilos
- `styles.css`: diseño base aprobado.
- `src/styles/tailwind.css`: Tailwind sin reset global.
- `src/styles/compat-fixes.css`: solo correcciones puntuales de compatibilidad; no debe convertirse en otra capa de parches.

## Norma para cambios futuros
Un cambio de Nosotros se hace en `nosotros.js`; uno de Formación en `formation.js` u `open-course.js`; calendario en `calendar.js`. No se deben crear archivos `v2`, `v3`, `final`, `final2`, etc.

## Build
```bash
npm run build
```

# Arquitectura React del CCT

La aplicación conserva el frontend existente y elimina la cadena de archivos versionados que se sobrescribían entre sí.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS con prefijo `tw-` y preflight desactivado

## Capas

### React
`src/App.tsx` monta las vistas y espera a que el runtime base termine antes de inicializar las funciones React/TypeScript que dependen del DOM.

### Snapshot de compatibilidad
`src/legacy/snapshot.html` conserva temporalmente el DOM visual ya aprobado. `extract.ts` separa las vistas para que React las monte sin rediseñarlas. No es una segunda aplicación ni una versión activa: es el markup fuente que permite preservar el frontend durante la migración gradual.

### Runtime estable
Solo existe una fuente activa por área:

```text
site.js        navegación y comportamiento general
career.js      Conoce tu carrera
calendar.js    calendario de Inicio
nosotros.js    Nosotros
formation.js   Academia CCT y certificaciones
```

`src/legacy/runtime.ts` las carga en orden y de forma aislada. Si un módulo secundario falla, el resto continúa inicializando.

### Funciones React/TypeScript
Open Course vive únicamente en:

```text
src/features/formation/openCourse.ts
```

Ya no existe un segundo script que reconstruya sus tarjetas ni un MutationObserver peleando contra otra capa.

### Estilos
- `styles.css`: diseño base aprobado.
- `src/styles/tailwind.css`: Tailwind sin reset global.
- `src/styles/compat-fixes.css`: solo correcciones mínimas de compatibilidad.

## Norma para cambios futuros
No crear `v2`, `v3`, `final`, `final2`, etc. Un cambio se realiza en el archivo estable de su área o en su feature React/TypeScript correspondiente.

## Build
```bash
npm run build
```

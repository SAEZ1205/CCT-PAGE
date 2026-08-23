# Checklist de lanzamiento — CCT-PAGE

Esta lista **no bloquea el desarrollo del frontend**. Se usa cuando el sitio vaya a pasar de desarrollo/staging a su dominio institucional definitivo.

## Arquitectura / frontend

- [x] React 18 + TypeScript strict + Vite.
- [x] Un solo límite controlado para el markup estático aprobado (`TrustedStaticShell`).
- [x] Error Boundary para evitar pantalla blanca ante fallos de render.
- [x] Markup canónico separado por vista.
- [x] Owners de frontend definidos por sección.
- [x] `site.js` legacy congelado y sin funciones top-level sin referencias detectadas.
- [x] `styles.css` histórico congelado.
- [x] Nuevos handlers inline y nuevos owners imperativos bloqueados por CI.
- [x] Build, `dist` y navegador real verificados automáticamente.
- [x] Ruta inexistente probada en Chrome.
- [x] Open Course autónomo probado en Chrome.
- [x] Dependencias de producción auditadas en CI.

## Antes de conectar el dominio final

- [ ] Reemplazar el número provisional de WhatsApp (`51999999999`) por el contacto oficial del CCT.
- [ ] Definir la URL canónica definitiva cuando exista el dominio y añadir `canonical` / `og:url`.
- [ ] Definir una imagen social/OG institucional final si se desea vista previa enriquecida al compartir enlaces.
- [ ] Revisar y publicar el texto definitivo de privacidad/cookies y datos de contacto institucional.
- [ ] Optimizar `assets/hero_telescopes.png` (actualmente ~5.33 MiB) preservando el diseño aprobado; CI ya advierte por imágenes >2 MiB.
- [ ] Verificar el dominio final en desktop y móvil después de configurar DNS/TLS.
- [ ] Confirmar que todos los enlaces institucionales definitivos (WhatsApp, redes, formularios, Drive, convocatorias) ya no sean placeholders o demos.

## Seguridad futura

Los headers básicos de seguridad ya están configurados para Vercel. Una Content-Security-Policy estricta puede añadirse más adelante cuando los handlers inline heredados y el script inline de arranque hayan sido migrados; no debe activarse a ciegas porque hoy rompería comportamiento legítimo existente.

## Regla de lanzamiento

Antes de publicar una versión importante:

```bash
npm ci
npm run check:all
```

Además, el PR debe tener CI verde y el despliegue debe revisarse en el host/dominio real una vez disponible.

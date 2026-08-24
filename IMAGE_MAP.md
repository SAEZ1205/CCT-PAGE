# Mapa canónico de imágenes · CCT-PAGE

Este archivo existe para que un cambio visual simple siga siendo **un cambio simple**.

## Regla principal

Si quieres cambiar una imagen y mantener la misma función visual, **reemplaza el archivo dentro de `assets/` conservando exactamente el mismo nombre y extensión**.

Ejemplo:

```text
assets/equipo-cct-2026.webp
```

En la sección Nosotros existen dos fotos canónicas del cuadro de la Junta Directiva. Si llega una nueva foto para una de esas posiciones, se sustituye el archivo correspondiente. No se crea `equipo-v2.webp`, `equipo-final.webp`, otro script ni otro CSS.

El build comprueba que los assets referenciados existan y que todos los archivos de `assets/` lleguen al `dist` final.

## Inicio

| Elemento visible | Asset canónico |
|---|---|
| Video principal del hero | `assets/hero_bg.mp4` |
| Poster/fondo del hero | `assets/hero_telescopes.png` |
| Imagen de red/hero auxiliar | `assets/hero_network.png` |
| Logo/wordmark del header | `assets/logo_wordmark.png` |
| Búho de “Conoce tu carrera” | `assets/owl-book.webp` |
| Fibra óptica | `assets/career-fibra-optica.svg` |
| Redes | `assets/career-redes.svg` |
| 5G | `assets/career-5g.svg` |
| Ciberseguridad | `assets/career-ciberseguridad.svg` |
| Inalámbrico | `assets/career-inalambrico.svg` |
| Radiofrecuencia | `assets/career-radiofrecuencia.svg` |
| Satélites | `assets/career-satelites.svg` |
| Insignia usada en Tele-Calendar | `assets/cct-insignia.png` |

## Nosotros

| Elemento visible | Asset canónico |
|---|---|
| Junta Directiva · foto 1 | `assets/equipo-cct-2026.webp` |
| Junta Directiva · foto 2 | `assets/equipo-cct-2026-grupal.webp` |
| Jorge | `assets/team/jorge.png` |
| Johann | `assets/team/johann.png` |
| Fernando | `assets/team/fernando.png` |
| Alexandra | `assets/team/alexandra.png` |
| Eliane | `assets/team/eliane.png` |
| Kevin | `assets/team/kevin.png` |
| Patrick | `assets/team/patrick.png` |
| Andy | `assets/team/andy.png` |
| María | `assets/team/maria.png` |
| Juan | `assets/team/juan.png` |

Las dos fotos de la Junta Directiva comparten un único cuadro y `src/features/nosotros/nosotros.ts` las alterna cada 6 segundos con un fundido suave. Para cambiar cualquiera de ellas en el futuro basta reemplazar el asset correspondiente.

## Formación

| Elemento visible | Asset canónico |
|---|---|
| Fondo/Tierra del hero | `assets/formation-earth.webp` |
| CCNA 1 | `assets/ccna_itn.png` |
| CCNA 2 | `assets/ccna_srwe.png` |
| CCNA 3 | `assets/ccna_ensa.png` |
| Fortinet FCP | `assets/fortinet_fcp.png` |
| CCNP Security | `assets/ccnp_security.png` |
| Open Course · soporte/ciberseguridad | `assets/course-support.webp` |
| Open Course · laboratorio/redes | `assets/course-network-lab.webp` |
| Open Course · wireless | `assets/course-wireless.webp` |

## Comunidad

| Elemento visible | Asset canónico |
|---|---|
| Teleinforma Amazon | `assets/teleinforma-amazon.webp` |
| Tarjeta Teleinforma | `assets/teleinforma_card.png` |
| Huawei | `assets/flyer-huawei-courses.webp` |
| Comunidad/grupo | `assets/event-community-group.webp` |
| Auditorio | `assets/event-auditorium.webp` |
| Feria STEM | `assets/feria-stem-2023.webp` |
| Visita técnica | `assets/visit-network-operations.webp` |
| Búho guía | `assets/owl-guide.webp` |

## Eventos

| Elemento visible | Asset canónico |
|---|---|
| Flyer destacado Huawei | `assets/flyer-huawei-courses.webp` |
| Auditorio | `assets/event-auditorium.webp` |
| Comunidad | `assets/event-community-group.webp` |
| Feria/difusión | `assets/feria-stem-2023.webp` |
| Búho de eventos | `assets/owl-front.webp` |

## Antes de aceptar un cambio de imagen

1. Identificar el asset en esta tabla.
2. Reemplazar **ese mismo archivo** cuando sea posible.
3. No crear otra implementación de la sección.
4. Ejecutar `npm run build`.
5. El build debe terminar con:
   - arquitectura estable;
   - TypeScript sin errores;
   - Vite build exitoso;
   - `dist` verificado.

Si un cambio necesita nombre/extensión diferente por una razón real, se modifica únicamente la referencia canónica correspondiente y se vuelve a ejecutar el build.

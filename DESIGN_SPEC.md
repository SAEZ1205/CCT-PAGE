# CCT-UNI Website - Design Specification

## 1. OVERVIEW

La web del Centro Cultural de Telecomunicaciones (CCT-UNI) está diseñada con un **lenguaje visual editorial limpio**, inspirado en el estilo IEC Telecom. El diseño evita el uso de componentes genéricos (cards redondeadas clonadas) y favorece:

- Secciones limpias con jerarquía tipográfica marcada
- Contenido en listas y bloques de texto amplios
- Mosaicos con imágenes de fondo y overlays
- Separadores sutiles en vez de bordes pesados
- CTAs claros con degradados institucionales
- Footer oscuro sólido

---

## 2. DESIGN TOKENS

### 2.1 Color Palette (Granate Institucional)

```css
/* Primary Colors */
--primary: #7A1F2B          /* Granate principal */
--primary-dark: #4A0F18     /* Granate oscuro (header/footer) */
--primary-light: #A13A47    /* Granate claro (acentos) */

/* Backgrounds */
--bg-white: #FFFFFF         /* Fondo principal */
--bg-surface: #F6F7F9       /* Fondo secundario/alternado */

/* Text */
--text-primary: #101828     /* Texto principal (negro) */
--text-secondary: #344054   /* Texto secundario (gris oscuro) */
--text-tertiary: #667085    /* Texto terciario (gris medio) */

/* Borders */
--border-light: #E4E7EC     /* Bordes sutiles */
```

**Uso recomendado:**
- `primary`: CTAs principales, enlaces, iconos de acción
- `primary-dark`: Header, footer, fondos de énfasis
- `primary-light`: Highlights, badges, fondos suaves
- `bg-surface`: Secciones alternadas para crear ritmo visual
- Textos: usar `text-primary` para títulos y contenido principal, `text-secondary` para subtítulos y descripciones, `text-tertiary` para metadatos

### 2.2 Typography

**Familias:**
```css
--font-display: 'Montserrat', sans-serif   /* Títulos, headings, UI */
--font-body: 'Crimson Text', serif         /* Cuerpo, párrafos */
```

**Escala tipográfica:**
```css
h1: 3.5rem (56px)    /* Hero titles */
h2: 2.5rem (40px)    /* Section titles */
h3: 1.75rem (28px)   /* Subsection titles */
h4: 1.25rem (20px)   /* Card titles */
Body: 18px           /* Cuerpo principal */
Small: 15px          /* Metadatos, descripciones */
```

**Pesos:**
- Regular (400): Cuerpo de texto
- SemiBold (600): Subtítulos, énfasis
- Bold (700): Títulos principales
- ExtraBold (800): Hero, títulos de impacto

**Line-height:**
- Headings: 1.2
- Body: 1.7
- UI elements: 1.5

### 2.3 Spacing

Sistema de spacing basado en múltiplos de 8px:

```css
--spacing-xs: 0.5rem (8px)
--spacing-sm: 1rem (16px)
--spacing-md: 1.5rem (24px)
--spacing-lg: 2rem (32px)
--spacing-xl: 3rem (48px)
--spacing-2xl: 4rem (64px)
--spacing-3xl: 6rem (96px)
```

**Aplicación:**
- `xs`: Gaps internos pequeños
- `sm`: Padding de botones, gaps entre elementos relacionados
- `md`: Padding de cards, separación entre componentes
- `lg`: Márgenes entre secciones relacionadas
- `xl`: Padding interno de secciones
- `2xl`: Separación entre grupos de secciones
- `3xl`: Padding vertical de secciones principales

### 2.4 Border Radius (Minimal)

```css
--radius-none: 0
--radius-sm: 2px      /* Botones pequeños, badges */
--radius-md: 4px      /* Botones principales, inputs */
--radius-lg: 6px      /* Cards, contenedores */
--radius-xl: 8px      /* Modales */
```

**Filosofía:** Evitar bordes excesivamente redondeados. Los contenedores principales usan 0-6px, botones 2-4px, modales máximo 8px.

### 2.5 Shadows (Subtle)

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
```

**Uso:**
- `sm`: Separadores sutiles, hover states ligeros
- `md`: Cards, header sticky
- `lg`: Modales, elementos flotantes, hover states importantes

### 2.6 Layout

```css
--container-max: 1280px
--header-height: 80px
```

**Grid System:**
- Desktop: 12 columnas con gap de 32px
- Tablet: 8 columnas con gap de 24px
- Mobile: 4 columnas con gap de 16px

---

## 3. COMPONENTS

### 3.1 Buttons

**Primary Button** (CTA principal con degradado)
```css
background: linear-gradient(135deg, #7A1F2B 0%, #4A0F18 100%);
color: white;
padding: 14px 32px;
border-radius: 4px;
font-size: 16px;
font-weight: 600;
```

**Secondary Button** (Outline)
```css
background: white;
color: #7A1F2B;
border: 2px solid #7A1F2B;
padding: 14px 32px;
border-radius: 4px;
```

**Text Button**
```css
color: #7A1F2B;
font-weight: 600;
text-decoration: underline;
```

**Estados:**
- Hover: `transform: translateY(-2px)` + `box-shadow`
- Active: `transform: scale(0.98)`
- Disabled: `opacity: 0.5` + `cursor: not-allowed`

### 3.2 Cards & Tiles

**Story Card** (Editorial)
- Imagen full-width arriba (280px height)
- Contenido: quote + autor + CTA
- NO usar bordes pesados, solo sombra sutil en hover
- Border-radius: 6px

**Highlight Tile** (Mosaico con background-image)
- Background-image con overlay granate
- Contenido en bottom con degradado de negro
- Min-height: 400px
- Hover: `transform: scale(1.02)`

**Area Card** (Informativa)
- Border sutil (1px solid #E4E7EC)
- Padding generoso (48px)
- Ícono arriba con background degradado
- Hover: border cambia a primary + shadow + translateY

### 3.3 Forms

**Inputs**
```css
padding: 12px 16px;
border: 1px solid #E4E7EC;
border-radius: 4px;
font-size: 15px;
```

**Focus State:**
```css
border-color: #7A1F2B;
outline: none;
```

**Multi-step Form:**
- Stepper horizontal arriba con números circulares
- Secciones con display: none/block
- Validación en tiempo real
- Botones Anterior/Siguiente/Enviar

### 3.4 Modals

**Estructura:**
```
.modal-overlay (fixed, fullscreen, background rgba)
  └─ .modal-container (centered, max-width 600px/800px)
      ├─ .modal-close (top-right, circular)
      ├─ .modal-header
      ├─ .modal-body
      └─ .modal-actions (optional)
```

**Animación:**
- Overlay: `opacity: 0 → 1`
- Container: `transform: scale(0.9) → scale(1)`

### 3.5 Navigation

**Desktop:**
- Horizontal sticky header
- Links con padding, hover con background rgba
- CTA buttons destacados

**Mobile (<1024px):**
- Burger menu (3 líneas)
- Mobile menu: full-width dropdown con flex-direction: column
- Botones ocupan 100% width

### 3.6 Lists (Editorial Style)

**News List:**
- Primera noticia destacada (imagen + título + descripción + fecha)
- Resto en formato lista: solo título + fecha
- Separador de 1px entre items
- Hover: background change

**Event List:**
- Grid: fecha (box granate) | info | CTA
- Fecha: día + mes en formato vertical
- Hover: shadow + translateX

**Course List:**
- Header: título + badge de estado
- Meta: duración + modalidad + fecha
- Border sutil, hover cambia a primary

---

## 4. SECTIONS STRUCTURE

### 4.1 Hero Section

```
- Video background (autoplay muted loop)
- Overlay granate con opacidad 0.85-0.90
- Contenido centrado:
  - Título (4rem, font-weight: 800)
  - Subtítulo (1.5rem)
  - 2 CTAs (primary + secondary)
- Height: 90vh (min 600px)
```

### 4.2 Section Header (Editorial)

```
- Tag superior (uppercase, 13px, letter-spacing: 1.5px, color primary)
- Título principal (2.75rem, font-weight: 800)
- Descripción opcional (1.15rem, color secondary)
- Margin-bottom: 48px
```

### 4.3 Alternating Backgrounds

- Sección 1: White
- Sección 2: Surface (#F6F7F9)
- Sección 3: White
- Y así sucesivamente

### 4.4 Footer

```
- Background: primary-dark sólido
- Padding: 96px 0 48px
- Grid: 1.5fr 1fr 1fr 1fr (logo + 3 columnas)
- Color texto: rgba(255,255,255,0.85)
- Links hover: color white + padding-left
- Border-top en footer-bottom
```

---

## 5. RESPONSIVE BREAKPOINTS

```css
/* Desktop */
> 1024px: Layout normal, nav horizontal

/* Tablet */
<= 1024px:
- Ocultar nav horizontal
- Mostrar burger menu
- Grid 2 columnas → 1 columna en algunas secciones
- Hero: 3rem font-size

/* Mobile */
<= 768px:
- Hero: 2.25rem
- Single column layouts
- Footer: 1 columna
- Event items: stack vertical

/* Small mobile */
<= 480px:
- Hero: 70vh height
- Stats: 1 columna
- Buttons: full-width
```

---

## 6. INTERACTIONS

### 6.1 Hover States

**Cards:**
```css
transform: translateY(-4px);
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
```

**Buttons:**
```css
transform: translateY(-2px);
box-shadow: 0 8px 20px rgba(122, 31, 43, 0.3);
```

**Links:**
```css
color: change to white/primary;
padding-left: +4px (smooth);
```

### 6.2 Transitions

Default transition para todos los elementos interactivos:
```css
transition: all 0.3s ease;
```

Excepciones:
- Micro-interacciones: `0.2s`
- Animaciones complejas: `0.4s`

### 6.3 Scroll Animations

Elementos de sección:
```css
opacity: 0;
transform: translateY(20px);
transition: all 0.6s ease;
```

Al entrar en viewport:
```css
opacity: 1;
transform: translateY(0);
```

---

## 7. ACCESSIBILITY

### 7.1 Color Contrast

Todos los pares de color cumplen WCAG AA:
- Primary (#7A1F2B) sobre white: ✓
- White sobre primary-dark: ✓
- Text-primary sobre white: ✓

### 7.2 Keyboard Navigation

- Tab order lógico
- Focus states visibles (border: 2px solid primary)
- Modales cierran con ESC
- Skip to main content link (opcional)

### 7.3 ARIA Labels

- Botones de navegación: `aria-label`
- Modales: `role="dialog"` + `aria-labelledby`
- Forms: labels asociados con `for` attribute
- Images: alt text descriptivo

### 7.4 Responsive Text

- Font-size mínimo: 14px (mobile)
- Line-height mínimo: 1.5
- Clickable areas: mínimo 44x44px

---

## 8. PERFORMANCE

### 8.1 Image Optimization

- Usar lazy loading: `loading="lazy"`
- Formatos modernos: WebP con fallback
- Responsive images: `srcset` + `sizes`
- Placeholder: background-color durante carga

### 8.2 CSS

- CSS Variables para todos los tokens
- Evitar `@import`, usar `<link>`
- Minificar en producción
- Critical CSS inline para above-the-fold

### 8.3 JavaScript

- Debounce scroll events
- IntersectionObserver para lazy loading
- Event delegation donde sea posible
- Minificar en producción

---

## 9. CONTENT GUIDELINES

### 9.1 Tone of Voice

**Directo y claro** (estilo UNI):
- Evitar lenguaje florido o marketing excesivo
- Usar voz activa
- Frases cortas y directas
- Datos concretos sobre promesas vagas

Ejemplo ✓: "Organizamos TELCON, el congreso más importante del país"
Ejemplo ✗: "Somos el centro cultural líder que busca transformar la experiencia estudiantil mediante..."

### 9.2 Copy Length

- Hero: Max 15 palabras título, 20 palabras subtítulo
- Section headers: Max 8 palabras
- Card descriptions: 2-3 líneas (max 100 caracteres)
- CTAs: 2-4 palabras

### 9.3 Formatting

- Títulos: Title Case en inglés, Sentence case en español
- Fechas: "15 de Marzo, 2026" o "15 Mar 2026"
- Números: usar separadores de miles (1,500 no 1500)
- Listas: máximo 5-7 items, usar viñetas simples

---

## 10. ASSETS PLACEHOLDERS

### 10.1 Logo CCT-UNI
```html
<!-- SVG inline con iniciales CCT en cuadrado granate -->
<svg width="48" height="48" viewBox="0 0 48 48">
  <rect fill="#7A1F2B" width="48" height="48" rx="4"/>
  <text x="24" y="32" font-family="Montserrat" font-weight="700" 
        font-size="20" fill="white" text-anchor="middle">CCT</text>
</svg>
```

### 10.2 Imágenes Recomendadas

**Hero Video:**
- Resolución: 1920x1080 mínimo
- Duración: 10-30 segundos loop
- Peso: <5MB optimizado
- Tema: tecnología, telecomunicaciones, estudiantes

**Fotos de Eventos:**
- Resolución: 1600x900 (16:9)
- Formato: JPG optimizado o WebP
- Tema: estudiantes trabajando, conferencias, talleres

**Portraits (Entrevistas):**
- Resolución: 800x800 (1:1)
- Formato: JPG optimizado
- Iluminación profesional preferida

### 10.3 Iconografía

Usar SVG inline o fuente de iconos (ej: Feather Icons, Lucide):
- Stroke-width: 2px
- Tamaño: 20-24px standard, 40-48px para areas cards
- Color: heredar del contenedor

---

## 11. IMPLEMENTATION NOTES

### 11.1 File Structure

```
/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── images/
│   ├── videos/
│   └── fonts/ (si son custom)
└── README.md
```

### 11.2 Browser Support

- Chrome/Edge: últimas 2 versiones
- Firefox: últimas 2 versiones
- Safari: últimas 2 versiones
- Mobile browsers: iOS Safari 13+, Chrome Android 80+

**Fallbacks:**
- CSS Grid: Flexbox fallback
- CSS Variables: valores directos en fallback
- Video background: imagen estática en mobile

### 11.3 Dependencies

**Fonts:**
- Google Fonts: Montserrat (400,500,600,700,800) + Crimson Text (400,600,400i)

**No frameworks required**, vanilla HTML/CSS/JS.

**Optional enhancements:**
- Swiper.js para carruseles avanzados
- AOS (Animate On Scroll) para animaciones
- Formspree o Google Forms para formularios

---

## 12. DEPLOYMENT CHECKLIST

- [ ] Minificar CSS y JS
- [ ] Optimizar todas las imágenes
- [ ] Generar favicon.ico + app icons
- [ ] Configurar meta tags (title, description, OG)
- [ ] Configurar analytics (opcional)
- [ ] Probar en todos los breakpoints
- [ ] Validar HTML/CSS
- [ ] Revisar accesibilidad (Lighthouse)
- [ ] Configurar redirects (si aplica)
- [ ] SSL/HTTPS habilitado

---

## 13. MAINTENANCE

### 13.1 Actualización de Contenido

**Teleinforma (noticias):**
- Agregar nueva noticia destacada
- Mover anterior destacada a lista
- Mantener máximo 6 noticias en lista

**Eventos:**
- Actualizar Telecalendar mensualmente
- Archivar eventos pasados
- Mantener próximos 4-5 eventos visibles

**Cursos:**
- Actualizar badges de estado (abierto/pronto/cerrado)
- Cambiar fechas de inicio
- Rotar curso destacado cada mes

### 13.2 Performance Monitoring

Revisar mensualmente:
- PageSpeed Insights score (target: >90)
- Lighthouse score (target: >90 en todas las categorías)
- Peso total de página (<3MB)
- Tiempo de carga (<3s en 3G)

---

## 14. FUTURE ENHANCEMENTS

Posibles mejoras para fases posteriores:

1. **Sistema de Gestión de Contenido (CMS)**
   - Admin panel para actualizar noticias/eventos
   - Editor WYSIWYG para Teleinforma
   - Gestión de convocatorias

2. **Features Avanzados**
   - Sistema de inscripción online integrado
   - Dashboard de usuario (mis cursos, mis eventos)
   - Notificaciones push para eventos
   - Integración con Google Calendar nativa

3. **Multilenguaje**
   - Español (default)
   - Inglés (opcional para visitantes internacionales)

4. **PWA**
   - Service worker
   - Offline mode
   - App installable

---

**Documento creado:** Febrero 2026  
**Versión:** 1.0  
**Autor:** Claude (Anthropic)  
**Para:** CCT-UNI

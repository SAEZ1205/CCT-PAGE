# CCT-PAGE

Sitio web del Centro Cultural de Telecomunicaciones (CCT-UNI).

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS

## Estructura

```text
CCT-PAGE/
├─ assets/          # imágenes y recursos visuales
├─ src/             # aplicación React
│  ├─ features/     # lógica de Inicio, Nosotros, Formación, etc.
│  ├─ pages/        # vistas del sitio
│  ├─ layout/       # header/footer y estructura
│  └─ main.tsx      # entrada de React
├─ docs/            # documentación de diseño y contenido
├─ index.html
├─ package.json
├─ vite.config.ts
└─ styles.css
```

No existe una segunda copia del proyecto dentro de otra carpeta. La raíz del repositorio es la aplicación.

## Abrir localmente

```bash
npm install
npm run dev
```

Vite mostrará una dirección similar a `http://localhost:5173/`.

## Compilar

```bash
npm run build
```

La salida se genera en `dist/`.

## Publicación

GitHub Pages compila automáticamente el proyecto desde `main` mediante `.github/workflows/deploy-pages.yml`.

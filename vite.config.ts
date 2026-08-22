import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  // Rutas relativas: funciona en local, GitHub Pages y despliegues estáticos sin depender de process.env.
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'assets/**/*', dest: 'assets' },
        { src: 'site.js', dest: '' },
        { src: 'career.js', dest: '' },
        { src: 'calendar.js', dest: '' },
        { src: 'course.html', dest: '' },
        { src: 'course.css', dest: '' },
        { src: 'course.js', dest: '' },
      ],
    }),
  ],
});

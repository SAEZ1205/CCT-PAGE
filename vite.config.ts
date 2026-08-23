import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'assets/**/*', dest: 'assets' },
        { src: 'site.js', dest: '' },
        { src: 'course.html', dest: '' },
        { src: 'course.css', dest: '' },
        { src: 'course.js', dest: '' },
      ],
    }),
  ],
});

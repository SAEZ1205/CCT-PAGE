import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/CCT-PAGE/' : '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'assets/**/*', dest: 'assets' },
        { src: 'script-original.js', dest: '' },
        { src: 'career-v3.js', dest: '' },
        { src: 'calendar-v2.js', dest: '' },
        { src: 'nosotros-v2.js', dest: '' },
        { src: 'nosotros-v3.js', dest: '' },
        { src: 'formation-v2.js', dest: '' },
        { src: 'formation-v3.js', dest: '' },
        { src: 'formation-v4.js', dest: '' },
        { src: 'formation-v5.js', dest: '' },
        { src: 'course.html', dest: '' },
        { src: 'course.css', dest: '' },
        { src: 'course.js', dest: '' }
      ]
    })
  ]
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const isGitHubActions = Boolean((globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env?.GITHUB_ACTIONS);

export default defineConfig({
  base: isGitHubActions ? '/CCT-PAGE/' : '/',
  plugins:[react(),viteStaticCopy({targets:[
    {src:'assets/**/*',dest:'assets'},
    {src:'site.js',dest:''},{src:'career.js',dest:''},{src:'calendar.js',dest:''},
    {src:'nosotros.js',dest:''},{src:'formation.js',dest:''},{src:'community.js',dest:''},{src:'events.js',dest:''},
    {src:'course.html',dest:''},{src:'course.css',dest:''},{src:'course.js',dest:''}
  ]})]
});

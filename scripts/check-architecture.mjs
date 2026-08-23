import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const ignoredDirs = new Set(['.git', 'node_modules', 'dist']);
const sourceExtensions = new Set(['.html', '.css', '.js', '.ts', '.tsx']);
const assetExtensions = '(?:png|jpe?g|webp|svg|mp4)';

function fail(message) {
  errors.push(message);
}

function walk(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else result.push(full);
  }
  return result;
}

function readProjectFile(path) {
  const full = join(root, path);
  return existsSync(full) ? readFileSync(full, 'utf8') : '';
}

const allFiles = walk(root);
const projectPaths = allFiles.map((file) => relative(root, file).replaceAll('\\', '/'));

const requiredFiles = [
  'package.json',
  'package-lock.json',
  'index.html',
  'vite.config.ts',
  'site.js',
  'career.js',
  'calendar.js',
  'course.html',
  'course.css',
  'course.js',
  'src/App.tsx',
  'src/main.tsx',
  'src/legacy/runtime.ts',
  'src/legacy/snapshot.html',
  'src/features/nosotros/nosotros.ts',
  'src/features/formation/formation.ts',
  'src/features/formation/openCourse.ts',
  'src/features/community/community.ts',
  'src/features/events/events.ts',
  'src/features/shared/ui.ts',
  'src/styles/sections/nosotros.css',
  'src/styles/sections/formacion.css',
  'src/styles/sections/comunidad.css',
  'src/styles/sections/eventos.css',
];

for (const path of requiredFiles) {
  if (!existsSync(join(root, path))) fail(`Falta archivo requerido: ${path}`);
}

const forbiddenExact = [
  'nosotros.js',
  'formation.js',
  'community.js',
  'events.js',
  'src/styles/compat-fixes.css',
];

for (const path of forbiddenExact) {
  if (projectPaths.includes(path)) fail(`Archivo legacy prohibido presente: ${path}`);
}

for (const path of projectPaths) {
  if (/\.b64$/i.test(path)) fail(`Asset base64 prohibido: ${path}`);
  if (/(?:^|\/)[^/]*(?:[-_.](?:v\d+|final\d*|old|backup|copy|copia|nuevo|new))\.(?:js|ts|tsx|css|html)$/i.test(path)) {
    fail(`Copia/versionado de implementación prohibido: ${path}`);
  }
}

const runtime = readProjectFile('src/legacy/runtime.ts');
if (runtime) {
  if (/dispatchEvent\s*\(\s*new\s+Event\s*\(\s*['"]DOMContentLoaded['"]/.test(runtime)) {
    fail('El runtime no puede volver a disparar DOMContentLoaded artificialmente.');
  }

  const readyIndex = runtime.indexOf('await nativeDomReady');
  const siteLoadIndex = runtime.indexOf("loadSafely(runtime('site.js'))");
  if (readyIndex < 0 || siteLoadIndex < 0 || readyIndex > siteLoadIndex) {
    fail('site.js debe cargarse únicamente después de esperar el DOMContentLoaded nativo.');
  }

  const allowedBlock = runtime.match(/const\s+ALLOWED_SITE_INITIALIZERS\s*=\s*\[([\s\S]*?)\]\s*as\s+const/);
  if (!allowedBlock) {
    fail('No se encontró la lista blanca ALLOWED_SITE_INITIALIZERS.');
  } else {
    const forbiddenInitializers = [
      'initAcademyEnrollments',
      'initCctV2Experience',
      'initEditorialAgenda',
      'initAcademyOrbit',
      'initTeleinformaFilters',
      'initEventosBoomerang',
    ];
    for (const name of forbiddenInitializers) {
      if (allowedBlock[1].includes(`'${name}'`) || allowedBlock[1].includes(`"${name}"`)) {
        fail(`Inicializador legacy duplicado habilitado: ${name}`);
      }
    }
  }
}

const indexHtml = readProjectFile('index.html');
if (indexHtml) {
  if (!/<div\s+id=["']root["']/.test(indexHtml)) fail('index.html no contiene #root.');
  if (!/<script[^>]+type=["']module["'][^>]+src=["']\/src\/main\.tsx["']/.test(indexHtml)) {
    fail('index.html debe tener una única entrada Vite hacia /src/main.tsx.');
  }
  if (/<script[^>]+src=["'][^"']*(?:site|career|calendar)\.js(?:\?[^"']*)?["']/i.test(indexHtml)) {
    fail('Los scripts legacy no pueden cargarse directamente desde index.html; los controla runtime.ts.');
  }
}

const snapshot = readProjectFile('src/legacy/snapshot.html');
if (snapshot) {
  const expectedViews = ['inicio', 'nosotros', 'formacion', 'comunidad', 'eventos', 'telcon', 'recursos'];
  for (const view of expectedViews) {
    const dataMatches = [...snapshot.matchAll(new RegExp(`data-view=["']${view}["']`, 'g'))].length;
    const idMatches = [...snapshot.matchAll(new RegExp(`id=["']view-${view}["']`, 'g'))].length;
    if (dataMatches !== 1) fail(`snapshot.html debe contener exactamente una vista data-view="${view}"; encontradas: ${dataMatches}`);
    if (idMatches !== 1) fail(`snapshot.html debe contener exactamente un #view-${view}; encontrados: ${idMatches}`);
  }
}

const mainTsx = readProjectFile('src/main.tsx');
for (const stylesheet of ['nosotros.css', 'formacion.css', 'comunidad.css', 'eventos.css']) {
  if (mainTsx && !mainTsx.includes(`./styles/sections/${stylesheet}`)) {
    fail(`src/main.tsx no importa el CSS canónico ${stylesheet}`);
  }
}

const featureFiles = allFiles.filter((file) => relative(root, file).replaceAll('\\', '/').startsWith('src/features/') && ['.ts', '.tsx'].includes(extname(file)));
for (const file of featureFiles) {
  const path = relative(root, file).replaceAll('\\', '/');
  const content = readFileSync(file, 'utf8');
  if (/createElement\s*\(\s*['"]style['"]\s*\)/.test(content) || /insertAdjacentHTML\([^)]*<style/i.test(content)) {
    fail(`CSS oculto inyectado desde feature TypeScript: ${path}. Muévelo al CSS canónico de la sección.`);
  }
}

const openCourse = readProjectFile('src/features/formation/openCourse.ts');
if (openCourse) {
  if (!/dataset\.openCourseReact\s*===\s*['"]ready['"]/.test(openCourse)) {
    fail('Open Course debe tener guard idempotente antes de volver a renderizarse.');
  }
}

const viteConfig = readProjectFile('vite.config.ts');
if (viteConfig) {
  if (!/base\s*:\s*['"]\.\/['"]/.test(viteConfig)) fail("Vite debe conservar base: './' para GitHub Pages.");
  for (const staticFile of ['site.js', 'career.js', 'calendar.js', 'course.html', 'course.css', 'course.js']) {
    if (!viteConfig.includes(`src: '${staticFile}'`)) fail(`vite.config.ts no copia ${staticFile} a dist.`);
  }
}

const activeSources = allFiles.filter((file) => {
  const path = relative(root, file).replaceAll('\\', '/');
  if (path.startsWith('assets/')) return false;
  if (path.startsWith('scripts/')) return false;
  if (path.endsWith('.md') || path.endsWith('.txt')) return false;
  return sourceExtensions.has(extname(path));
});

const referencedAssets = new Set();
const directAssetRegex = new RegExp(`(?:\\.\\.\\/)*assets\\/([A-Za-z0-9_./-]+\\.${assetExtensions.slice(3, -1)})`, 'gi');
const helperAssetRegex = new RegExp(`\\basset\\(\\s*['"]([^'"]+\\.${assetExtensions.slice(3, -1)})['"]\\s*\\)`, 'gi');
const literalAssetRegex = new RegExp(`\\b(?:image|photo|src)\\s*:\\s*['"](?!https?:|data:)([^'"]+\\.${assetExtensions.slice(3, -1)})['"]`, 'gi');

for (const file of activeSources) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(directAssetRegex)) referencedAssets.add(match[1]);
  for (const match of content.matchAll(helperAssetRegex)) referencedAssets.add(match[1]);
  for (const match of content.matchAll(literalAssetRegex)) {
    if (!match[1].includes('/') || match[1].startsWith('team/')) referencedAssets.add(match[1]);
  }
}

for (const asset of referencedAssets) {
  const full = join(root, 'assets', asset);
  if (!existsSync(full) || !statSync(full).isFile()) fail(`Asset referenciado pero inexistente: assets/${asset}`);
}

if (errors.length) {
  console.error('\n[CCT] Verificación de arquitectura FALLÓ:\n');
  errors.forEach((message) => console.error(` - ${message}`));
  console.error('\nCorrige estos puntos antes de compilar o desplegar.\n');
  process.exit(1);
}

console.log(`[CCT] Arquitectura estable: ${requiredFiles.length} archivos base, ${referencedAssets.size} assets verificados, vistas únicas y sin capas duplicadas.`);

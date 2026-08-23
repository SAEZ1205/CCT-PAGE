import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];
const ignoredDirs = new Set(['.git', 'node_modules', 'dist']);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function read(path) {
  const full = join(root, path);
  return existsSync(full) ? readFileSync(full, 'utf8') : '';
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const files = walk(root);
const paths = files.map((file) => relative(root, file).replaceAll('\\', '/'));
const pages = ['inicio', 'nosotros', 'formacion', 'comunidad', 'eventos', 'telcon', 'recursos'];
const canonicalMarkupPaths = [
  'src/layout/before-main.html',
  ...pages.map((page) => `src/pages/${page}/markup.html`),
  'src/layout/footer.html',
  'src/layout/after-main.html',
];

for (const path of [
  'src/components/TrustedStaticShell.tsx',
  'src/components/AppErrorBoundary.tsx',
  '.nvmrc',
  ...canonicalMarkupPaths,
]) {
  if (!existsSync(join(root, path))) fail(`Falta archivo de frontend requerido: ${path}`);
}

const tsSources = paths.filter((path) => path.startsWith('src/') && ['.ts', '.tsx'].includes(extname(path)));
const dangerousOwners = [];
for (const path of tsSources) {
  const count = (read(path).match(/\bdangerouslySetInnerHTML\s*=\s*\{/g) || []).length;
  if (count) dangerousOwners.push([path, count]);
}
const dangerousTotal = dangerousOwners.reduce((sum, [, count]) => sum + count, 0);
if (dangerousTotal !== 1 || dangerousOwners[0]?.[0] !== 'src/components/TrustedStaticShell.tsx') {
  fail(`dangerouslySetInnerHTML debe existir exactamente una vez y solo en TrustedStaticShell.tsx. Encontrado: ${JSON.stringify(dangerousOwners)}.`);
}

const app = read('src/App.tsx');
if (!app.includes("./components/TrustedStaticShell")) fail('App.tsx debe montar el markup mediante TrustedStaticShell.');
if (/\bdangerouslySetInnerHTML\s*=\s*\{/.test(app)) fail('App.tsx no puede usar dangerouslySetInnerHTML directamente.');

const main = read('src/main.tsx');
if (!main.includes('AppErrorBoundary')) fail('main.tsx debe proteger la aplicación con AppErrorBoundary.');

const transitionalInnerHtmlFiles = new Set([
  'src/features/community/community.ts',
  'src/features/events/events.ts',
  'src/features/formation/formation.ts',
  'src/features/formation/openCourse.ts',
  'src/features/home/calendar.ts',
  'src/features/home/career.ts',
  'src/features/nosotros/nosotros.ts',
]);
for (const path of tsSources) {
  const content = read(path);
  if (/\.innerHTML\s*=/.test(content) && !transitionalInnerHtmlFiles.has(path)) {
    fail(`Nuevo owner imperativo con innerHTML fuera de la zona transicional: ${path}. Usa React/JSX o reutiliza un owner existente.`);
  }
}

const sitePath = join(root, 'site.js');
const site = existsSync(sitePath) ? read('site.js') : '';
if (existsSync(sitePath)) {
  const size = statSync(sitePath).size;
  if (size > 52736) fail(`site.js creció a ${size} bytes. El núcleo legacy está congelado en 52736 bytes y no debe recibir lógica nueva.`);
  if (/\beval\s*\(|new\s+Function\s*\(|document\.write\s*\(/.test(site)) {
    fail('site.js contiene una API de ejecución dinámica prohibida (eval/new Function/document.write).');
  }
}

const cssPaths = paths.filter((path) => path.endsWith('.css'));
const importantTotal = cssPaths.reduce((sum, path) => sum + (read(path).match(/!important/g) || []).length, 0);
if (importantTotal > 445) fail(`Aumentaron los !important: ${importantTotal} (máximo transicional 445).`);
const legacyCss = join(root, 'styles.css');
if (existsSync(legacyCss) && statSync(legacyCss).size > 125128) {
  fail(`styles.css histórico creció. Máximo permitido: 125128 bytes.`);
}

let markup = '';
for (const path of canonicalMarkupPaths) {
  const content = read(path);
  markup += `\n${content}`;
  if (/<script\b/i.test(content)) fail(`${path} no puede contener <script>.`);
  if (/<style\b/i.test(content)) fail(`${path} no puede contener <style>.`);
  if (/javascript\s*:/i.test(content)) fail(`${path} contiene un enlace javascript: prohibido.`);
  if (/\bhttp:\/\//i.test(content)) fail(`${path} contiene una URL HTTP no cifrada.`);

  for (const match of content.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(match[0])) {
      fail(`${path} contiene una imagen sin atributo alt: ${match[0].slice(0, 120)}...`);
    }
  }

  for (const match of content.matchAll(/<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi)) {
    if (!/\brel\s*=\s*["'][^"']*noopener[^"']*["']/i.test(match[0])) {
      fail(`${path} abre una pestaña nueva sin rel="noopener": ${match[0].slice(0, 140)}...`);
    }
  }
}

const inlineHandlers = markup.match(/\son[a-z]+\s*=/gi)?.length ?? 0;
if (inlineHandlers > 106) fail(`Aumentaron los handlers HTML inline: ${inlineHandlers} (máximo transicional 106).`);

const markupIds = new Set([...markup.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
const hashTargets = new Set();
for (const match of markup.matchAll(/\bhref\s*=\s*["']#([^"']+)["']/gi)) hashTargets.add(match[1]);
const navigationCorpus = `${markup}\n${site}\n${tsSources.map(read).join('\n')}`;
for (const match of navigationCorpus.matchAll(/\bnavigateTo\s*\(\s*["']#([^"']+)["']\s*\)/g)) hashTargets.add(match[1]);
for (const target of [...hashTargets].sort()) {
  if (!markupIds.has(target)) fail(`Navegación interna apunta a #${target}, pero no existe id="${target}" en el markup canónico.`);
}

const activeTextSources = paths.filter((path) => ['.html', '.ts', '.tsx', '.js'].includes(extname(path)) && !path.startsWith('scripts/'));
for (const path of activeTextSources) {
  const content = read(path);
  if (/javascript\s*:/i.test(content)) fail(`${path} contiene javascript: prohibido.`);
  for (const match of content.matchAll(/<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi)) {
    if (!/\brel\s*=\s*["'][^"']*noopener[^"']*["']/i.test(match[0])) {
      fail(`${path} contiene target="_blank" sin rel="noopener": ${match[0].slice(0, 140)}...`);
    }
  }
}

const imageExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
for (const path of paths.filter((path) => path.startsWith('assets/'))) {
  const full = join(root, path);
  const size = statSync(full).size;
  if (size > 6 * 1024 * 1024) fail(`Asset excesivamente grande (>6 MiB): ${path} (${size} bytes).`);
  if (imageExt.has(extname(path).toLowerCase()) && size > 2 * 1024 * 1024) {
    warn(`Imagen pesada para web (>2 MiB): ${path} (${(size / 1024 / 1024).toFixed(2)} MiB). Conviene optimizarla antes del dominio final.`);
  }
}

const indexHtml = read('index.html');
for (const requirement of [
  ['meta description', /<meta\s+name=["']description["']/i],
  ['theme-color', /<meta\s+name=["']theme-color["']/i],
  ['favicon', /<link\s+rel=["']icon["']/i],
  ['lang=es', /<html\s+lang=["']es["']/i],
]) {
  if (!requirement[1].test(indexHtml)) fail(`index.html no contiene ${requirement[0]}.`);
}

const tsconfig = read('tsconfig.json');
if (!/"strict"\s*:\s*true/.test(tsconfig)) fail('TypeScript debe conservar strict: true.');
if (!/"noEmit"\s*:\s*true/.test(tsconfig)) fail('TypeScript debe conservar noEmit: true.');

const packageJson = JSON.parse(read('package.json'));
if (packageJson.engines?.node !== '24.x') fail('package.json debe conservar engines.node = 24.x.');
if (!existsSync(join(root, 'package-lock.json'))) fail('Falta package-lock.json.');
if (read('.nvmrc').trim() !== '24') fail('.nvmrc debe fijar Node 24.');

const vercel = read('vercel.json');
for (const header of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options']) {
  if (!vercel.includes(header)) fail(`vercel.json no define el header de producción ${header}.`);
}

if (warnings.length) {
  console.warn('\n[CCT] Advertencias de frontend:');
  warnings.forEach((message) => console.warn(` - ${message}`));
}

if (errors.length) {
  console.error('\n[CCT] Frontend readiness FALLÓ:');
  errors.forEach((message) => console.error(` - ${message}`));
  process.exit(1);
}

console.log(`[CCT] Frontend readiness OK: 1 límite HTML confiable, Error Boundary activo, ${pages.length} vistas, ${inlineHandlers} handlers congelados, ${hashTargets.size} destinos internos válidos y ${importantTotal} !important sin crecimiento.`);

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const ignoredDirs = new Set(['.git', 'node_modules', 'dist']);
const sourceExtensions = new Set(['.html', '.css', '.js', '.ts', '.tsx']);

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

function read(path) {
  const full = join(root, path);
  return existsSync(full) ? readFileSync(full, 'utf8') : '';
}

const allFiles = walk(root);
const projectPaths = allFiles.map((file) => relative(root, file).replaceAll('\\', '/'));

const pageNames = ['inicio', 'nosotros', 'formacion', 'comunidad', 'eventos', 'telcon', 'recursos'];
const requiredFiles = [
  'package.json',
  'package-lock.json',
  'index.html',
  'vite.config.ts',
  'site.js',
  'course.html',
  'course.css',
  'course.js',
  'src/App.tsx',
  'src/main.tsx',
  'src/legacy/runtime.ts',
  'src/layout/markup.ts',
  'src/layout/before-main.html',
  'src/layout/footer.html',
  'src/layout/after-main.html',
  'src/features/home/career.ts',
  'src/features/home/calendar.ts',
  'src/features/nosotros/nosotros.ts',
  'src/features/formation/formation.ts',
  'src/features/formation/openCourse.ts',
  'src/features/community/community.ts',
  'src/features/events/events.ts',
  'src/features/shared/ui.ts',
  'src/styles/sections/inicio.css',
  'src/styles/sections/nosotros.css',
  'src/styles/sections/formacion.css',
  'src/styles/sections/comunidad.css',
  'src/styles/sections/eventos.css',
  ...pageNames.flatMap((page) => [`src/pages/${page}/index.ts`, `src/pages/${page}/markup.html`]),
];

for (const path of requiredFiles) {
  if (!existsSync(join(root, path))) fail(`Falta archivo requerido: ${path}`);
}

const forbiddenExact = [
  'career.js',
  'calendar.js',
  'nosotros.js',
  'formation.js',
  'community.js',
  'events.js',
  'src/legacy/snapshot.html',
  'src/legacy/extract.ts',
  'src/styles/compat-fixes.css',
];
for (const path of forbiddenExact) {
  if (projectPaths.includes(path)) fail(`Archivo retirado/prohibido presente: ${path}`);
}

for (const path of projectPaths) {
  if (/\.b64$/i.test(path)) fail(`Asset base64 prohibido: ${path}`);
  if (/(?:^|\/)[^/]*(?:[-_.](?:v\d+|final\d*|old|backup|copy|copia|nuevo|new))\.(?:js|ts|tsx|css|html)$/i.test(path)) {
    fail(`Copia/versionado de implementación prohibido: ${path}`);
  }
}

const runtime = read('src/legacy/runtime.ts');
if (runtime) {
  if (/dispatchEvent\s*\(\s*new\s+Event\s*\(\s*['"]DOMContentLoaded['"]/.test(runtime)) {
    fail('El runtime no puede disparar DOMContentLoaded artificialmente.');
  }
  const readyIndex = runtime.indexOf('await nativeDomReady');
  const siteLoadIndex = runtime.indexOf("loadSafely(runtime('site.js'))");
  if (readyIndex < 0 || siteLoadIndex < 0 || readyIndex > siteLoadIndex) {
    fail('site.js debe cargarse solo después del DOMContentLoaded nativo.');
  }
  if (/career\.js|calendar\.js/.test(runtime)) fail('runtime.ts no puede volver a cargar career.js/calendar.js.');

  const allowedBlock = runtime.match(/const\s+ALLOWED_SITE_INITIALIZERS\s*=\s*\[([\s\S]*?)\]\s*as\s+const/);
  if (!allowedBlock) {
    fail('No se encontró ALLOWED_SITE_INITIALIZERS.');
  } else {
    const retired = ['initAcademyEnrollments', 'initCctV2Experience', 'initEditorialAgenda', 'initAcademyOrbit', 'initTeleinformaFilters', 'initEventosBoomerang'];
    for (const name of retired) {
      if (allowedBlock[1].includes(name)) fail(`Inicializador retirado habilitado en runtime: ${name}`);
    }
  }
}

const site = read('site.js');
if (site) {
  if (/addEventListener\s*\(\s*['"]DOMContentLoaded['"]/.test(site)) {
    fail('site.js no puede autoarrancarse con DOMContentLoaded.');
  }
  for (const retired of ['initAcademyEnrollments', 'initAcademyOrbit', 'initCalendar', 'initCareerExplorer', 'initCctV2Experience', 'initEditorialAgenda', 'initEventosBoomerang', 'initRevealMotion', 'initTeleinformaFilters']) {
    if (new RegExp(`function\\s+${retired}\\s*\\(`).test(site)) fail(`site.js todavía define lógica retirada: ${retired}`);
  }
}

const indexHtml = read('index.html');
if (indexHtml) {
  if (!/<div\s+id=["']root["']/.test(indexHtml)) fail('index.html no contiene #root.');
  if (!/<script[^>]+type=["']module["'][^>]+src=["']\/src\/main\.tsx["']/.test(indexHtml)) {
    fail('index.html debe tener una única entrada Vite hacia /src/main.tsx.');
  }
  if (/<script[^>]+src=["'][^"']*(?:site|career|calendar)\.js(?:\?[^"']*)?["']/i.test(indexHtml)) {
    fail('Los scripts de aplicación no se pueden cargar directamente desde index.html.');
  }
}

const canonicalMarkup = [];
for (const page of pageNames) {
  const index = read(`src/pages/${page}/index.ts`);
  const markup = read(`src/pages/${page}/markup.html`);
  if (!index.includes("./markup.html?raw")) fail(`La página ${page} no importa su markup canónico.`);
  if (/legacy\/extract|extractView\(/.test(index)) fail(`La página ${page} volvió a depender del extractor legacy.`);

  const dataCount = [...markup.matchAll(new RegExp(`data-view=["']${page}["']`, 'g'))].length;
  const idCount = [...markup.matchAll(new RegExp(`id=["']view-${page}["']`, 'g'))].length;
  if (dataCount !== 1) fail(`markup de ${page}: data-view debe aparecer 1 vez; aparece ${dataCount}.`);
  if (idCount !== 1) fail(`markup de ${page}: #view-${page} debe aparecer 1 vez; aparece ${idCount}.`);
  if (/<script\b/i.test(markup)) fail(`markup de ${page} no puede contener <script>.`);
  canonicalMarkup.push(markup);
}

const layoutModule = read('src/layout/markup.ts');
for (const file of ['before-main.html', 'footer.html', 'after-main.html']) {
  if (!layoutModule.includes(`./${file}?raw`)) fail(`layout/markup.ts no importa ${file} como fuente canónica.`);
}
if (/legacy\/extract|extractBeforeMain|extractAfterMain|extractSelector/.test(layoutModule)) {
  fail('layout/markup.ts volvió a depender del extractor legacy.');
}
canonicalMarkup.push(read('src/layout/before-main.html'), read('src/layout/footer.html'), read('src/layout/after-main.html'));

const inlineHandlers = canonicalMarkup.join('\n').match(/\son[a-z]+\s*=/gi)?.length ?? 0;
if (inlineHandlers > 106) fail(`Aumentaron los handlers inline: ${inlineHandlers} (máximo temporal 106).`);

const mainTsx = read('src/main.tsx');
for (const stylesheet of ['inicio.css', 'nosotros.css', 'formacion.css', 'comunidad.css', 'eventos.css']) {
  if (!mainTsx.includes(`./styles/sections/${stylesheet}`)) fail(`src/main.tsx no importa ${stylesheet}.`);
}

const app = read('src/App.tsx');
for (const initializer of ['initCareerExperience', 'initHomeCalendar', 'initNosotros', 'initFormation', 'initOpenCourseFormation', 'initCommunity', 'initEvents']) {
  if (!app.includes(initializer)) fail(`App.tsx no inicializa ${initializer}.`);
}

const featureFiles = allFiles.filter((file) => {
  const path = relative(root, file).replaceAll('\\', '/');
  return path.startsWith('src/features/') && ['.ts', '.tsx'].includes(extname(file));
});
for (const file of featureFiles) {
  const path = relative(root, file).replaceAll('\\', '/');
  const content = readFileSync(file, 'utf8');
  if (/createElement\s*\(\s*['"]style['"]\s*\)/.test(content) || /insertAdjacentHTML\([^)]*<style/i.test(content)) {
    fail(`CSS dinámico prohibido desde feature: ${path}.`);
  }
}

const viteConfig = read('vite.config.ts');
if (viteConfig) {
  if (!/base\s*:\s*['"]\.\/['"]/.test(viteConfig)) fail("Vite debe conservar base: './'.");
  for (const staticFile of ['site.js', 'course.html', 'course.css', 'course.js']) {
    if (!viteConfig.includes(`src: '${staticFile}'`)) fail(`vite.config.ts no copia ${staticFile}.`);
  }
  if (/src:\s*['"](?:career|calendar)\.js['"]/.test(viteConfig)) fail('Vite no puede copiar career.js/calendar.js retirados.');
}

const activeSources = allFiles.filter((file) => {
  const path = relative(root, file).replaceAll('\\', '/');
  if (path.startsWith('assets/') || path.startsWith('scripts/') || path.startsWith('.github/')) return false;
  if (path.endsWith('.md') || path.endsWith('.txt')) return false;
  return sourceExtensions.has(extname(path));
});

const referencedAssets = new Set();
const assetExt = '(?:png|jpe?g|webp|svg|mp4)';
const directAssetRegex = new RegExp(`assets/([A-Za-z0-9_./-]+\\.${assetExt})`, 'gi');
const helperAssetRegex = new RegExp(`\\basset\\(\\s*['"]([^'"]+\\.${assetExt})['"]\\s*\\)`, 'gi');
const literalAssetRegex = new RegExp(`\\b(?:image|photo|src)\\s*:\\s*['"](?!https?:|data:)([^'"]+\\.${assetExt})['"]`, 'gi');

for (const file of activeSources) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(directAssetRegex)) referencedAssets.add(match[1]);
  for (const match of content.matchAll(helperAssetRegex)) referencedAssets.add(match[1]);
  for (const match of content.matchAll(literalAssetRegex)) {
    const value = match[1];
    if (!value.includes('/') || value.startsWith('team/')) referencedAssets.add(value);
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

console.log(`[CCT] Arquitectura canónica: ${requiredFiles.length} archivos requeridos, ${referencedAssets.size} assets, ${inlineHandlers} handlers inline y sin snapshot/runtime duplicado.`);

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

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

const allFiles = walk(root);
const projectPaths = allFiles.map((file) => relative(root, file).replaceAll('\\', '/'));

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
  if (/(?:^|\/)[^/]*-(?:v\d+|final\d*)\.(?:js|ts|tsx|css|html)$/i.test(path)) {
    fail(`Versión duplicada prohibida: ${path}`);
  }
}

const requiredOwners = [
  'src/features/nosotros/nosotros.ts',
  'src/features/formation/formation.ts',
  'src/features/formation/openCourse.ts',
  'src/features/community/community.ts',
  'src/features/events/events.ts',
];
for (const path of requiredOwners) {
  if (!existsSync(join(root, path))) fail(`Falta la fuente canónica: ${path}`);
}

const runtimePath = join(root, 'src/legacy/runtime.ts');
if (!existsSync(runtimePath)) {
  fail('Falta src/legacy/runtime.ts');
} else {
  const runtime = readFileSync(runtimePath, 'utf8');
  if (/dispatchEvent\s*\(\s*new\s+Event\s*\(\s*['"]DOMContentLoaded['"]/.test(runtime)) {
    fail('El runtime no puede volver a disparar DOMContentLoaded artificialmente.');
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
    ];
    for (const name of forbiddenInitializers) {
      if (allowedBlock[1].includes(`'${name}'`) || allowedBlock[1].includes(`"${name}"`)) {
        fail(`Inicializador legacy duplicado habilitado: ${name}`);
      }
    }
  }
}

const activeSources = allFiles.filter((file) => {
  const path = relative(root, file).replaceAll('\\', '/');
  if (path.startsWith('assets/')) return false;
  if (path.startsWith('scripts/')) return false;
  if (path.endsWith('.md') || path.endsWith('.txt')) return false;
  const dot = path.lastIndexOf('.');
  const ext = dot >= 0 ? path.slice(dot) : '';
  return sourceExtensions.has(ext);
});

const assetRegex = /(?:\.\.\/)*assets\/([A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|svg|mp4))/gi;
const referencedAssets = new Set();

for (const file of activeSources) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(assetRegex)) referencedAssets.add(match[1]);
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

console.log(`[CCT] Arquitectura estable: ${requiredOwners.length} fuentes canónicas, ${referencedAssets.size} assets verificados y sin capas duplicadas.`);

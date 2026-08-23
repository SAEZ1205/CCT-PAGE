import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const exists = (path) => existsSync(join(root, path));

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(root);
const paths = files.map((file) => relative(root, file).replaceAll('\\', '/'));
const pages = ['inicio', 'nosotros', 'formacion', 'comunidad', 'eventos', 'telcon', 'recursos'];
const markupPaths = [
  'src/layout/before-main.html',
  ...pages.map((page) => `src/pages/${page}/markup.html`),
  'src/layout/footer.html',
  'src/layout/after-main.html',
].filter(exists);
const markup = markupPaths.map(read).join('\n');

const handlerAttrs = [...markup.matchAll(/\s(on[a-z]+)\s*=\s*["']([^"']*)["']/gi)];
const handlerCalls = new Map();
for (const [, , code] of handlerAttrs) {
  for (const match of code.matchAll(/\b([A-Za-z_$][\w$]*)\s*\(/g)) {
    const name = match[1];
    if (!['if', 'for', 'while', 'switch', 'function'].includes(name)) {
      handlerCalls.set(name, (handlerCalls.get(name) || 0) + 1);
    }
  }
}

const ids = [...markup.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
const idCounts = new Map();
for (const id of ids) idCounts.set(id, (idCounts.get(id) || 0) + 1);
const duplicateIds = [...idCounts.entries()].filter(([, count]) => count > 1);

const codePaths = [
  'site.js',
  'course.js',
  ...paths.filter((path) => path.startsWith('src/') && ['.ts', '.tsx', '.js'].includes(extname(path))),
].filter(exists);
const allDefined = new Map();
for (const path of codePaths) {
  const content = read(path);
  const names = new Set();
  for (const match of content.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) names.add(match[1]);
  for (const match of content.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g)) names.add(match[1]);
  for (const name of names) {
    if (!allDefined.has(name)) allDefined.set(name, []);
    allDefined.get(name).push(path);
  }
}

const cssPaths = ['styles.css', ...paths.filter((path) => path.startsWith('src/styles/') && path.endsWith('.css')), 'course.css'].filter(exists);
const importantByFile = cssPaths.map((path) => ({
  path,
  bytes: statSync(join(root, path)).size,
  important: (read(path).match(/!important/g) || []).length,
}));

const assetPaths = paths.filter((path) => path.startsWith('assets/'));
const basenameGroups = new Map();
for (const path of assetPaths) {
  const base = path.slice(path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
  if (!basenameGroups.has(base)) basenameGroups.set(base, []);
  basenameGroups.get(base).push(path);
}

const retired = ['initAcademyEnrollments', 'initAcademyOrbit', 'initCalendar', 'initCareerExplorer', 'initCctV2Experience', 'initEditorialAgenda', 'initEventosBoomerang', 'initRevealMotion', 'initTeleinformaFilters'];
const site = exists('site.js') ? read('site.js') : '';
const pageIndexes = pages.map((page) => `src/pages/${page}/index.ts`);
const legacyImports = paths.filter((path) => path.startsWith('src/') && ['.ts', '.tsx'].includes(extname(path)) && /legacy\/(?:extract|snapshot)/.test(read(path)));

const report = {
  inventory: {
    totalFiles: paths.length,
    totalBytes: files.reduce((total, file) => total + statSync(file).size, 0),
    largestTextFiles: paths
      .filter((path) => ['.html', '.css', '.js', '.ts', '.tsx', '.json'].includes(extname(path)))
      .map((path) => ({ path, bytes: statSync(join(root, path)).size }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 15),
  },
  markup: {
    files: markupPaths,
    totalBytes: markupPaths.reduce((total, path) => total + statSync(join(root, path)).size, 0),
    inlineEventAttributes: handlerAttrs.length,
    inlineFunctions: [...handlerCalls.entries()].sort((a, b) => b[1] - a[1]),
    duplicateIds,
    scriptTags: [...markup.matchAll(/<script\b/gi)].length,
    styleTags: [...markup.matchAll(/<style\b/gi)].length,
  },
  javascript: {
    siteBytes: exists('site.js') ? statSync(join(root, 'site.js')).size : 0,
    domReadyListeners: codePaths.filter((path) => /DOMContentLoaded/.test(read(path))),
    duplicateFunctionNames: [...allDefined.entries()].filter(([, definitions]) => definitions.length > 1),
    retiredSiteFunctionsStillDefined: retired.filter((name) => new RegExp(`function\\s+${name}\\s*\\(`).test(site)),
  },
  css: {
    importantTotal: importantByFile.reduce((total, file) => total + file.important, 0),
    files: importantByFile,
  },
  assets: {
    total: assetPaths.length,
    duplicateBasenames: [...basenameGroups.entries()].filter(([, group]) => group.length > 1),
    largest: assetPaths.map((path) => ({ path, bytes: statSync(join(root, path)).size })).sort((a, b) => b.bytes - a.bytes).slice(0, 12),
  },
  coupling: {
    pagesUsingCanonicalMarkup: pageIndexes.filter((path) => exists(path) && read(path).includes('./markup.html?raw')).length,
    legacySnapshotImports: legacyImports,
    retiredRootScriptsPresent: ['career.js', 'calendar.js'].filter(exists),
    rootRuntimeFiles: ['site.js', 'course.js', 'course.css', 'course.html', 'styles.css'].filter(exists),
  },
};

console.log('=== CCT DEEP AUDIT ===');
console.log(JSON.stringify(report, null, 2));

const hardProblems = [];
if (duplicateIds.length) hardProblems.push(`${duplicateIds.length} IDs duplicados`);
if (report.markup.scriptTags) hardProblems.push(`${report.markup.scriptTags} scripts embebidos en markup`);
if (legacyImports.length) hardProblems.push(`${legacyImports.length} imports al snapshot/extractor retirado`);
if (report.javascript.retiredSiteFunctionsStillDefined.length) hardProblems.push(`${report.javascript.retiredSiteFunctionsStillDefined.length} funciones retiradas siguen en site.js`);
if (report.coupling.retiredRootScriptsPresent.length) hardProblems.push(`scripts retirados presentes: ${report.coupling.retiredRootScriptsPresent.join(', ')}`);
if (report.coupling.pagesUsingCanonicalMarkup !== pages.length) hardProblems.push('no todas las páginas usan markup canónico');

if (hardProblems.length) {
  console.error('\n[CCT] Deep audit detectó problemas estructurales:');
  hardProblems.forEach((problem) => console.error(` - ${problem}`));
  process.exit(1);
}

console.log(`\n[CCT] Deep audit OK: ${markupPaths.length} fragmentos canónicos, ${handlerAttrs.length} handlers inline, ${report.css.importantTotal} !important, site.js ${report.javascript.siteBytes} bytes.`);

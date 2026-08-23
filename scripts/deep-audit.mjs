import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');
const exists = (p) => existsSync(join(root, p));

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
const paths = files.map((f) => relative(root, f).replaceAll('\\', '/'));
const textPaths = paths.filter((p) => ['.html','.css','.js','.ts','.tsx','.json','.md','.txt','.cjs'].includes(extname(p)));

const report = {
  inventory: {},
  snapshot: {},
  javascript: {},
  css: {},
  assets: {},
  coupling: {},
  findings: [],
};

report.inventory.totalFiles = paths.length;
report.inventory.totalBytes = files.reduce((n, f) => n + statSync(f).size, 0);
report.inventory.largestTextFiles = textPaths
  .map((p) => ({ path: p, bytes: statSync(join(root,p)).size }))
  .sort((a,b) => b.bytes-a.bytes)
  .slice(0, 20);

const snapshot = exists('src/legacy/snapshot.html') ? read('src/legacy/snapshot.html') : '';
const attrHandlerRegex = /\s(on[a-z]+)\s*=\s*["']([^"']*)["']/gi;
const handlerAttrs = [...snapshot.matchAll(attrHandlerRegex)];
const handlerCalls = new Map();
for (const [, attr, code] of handlerAttrs) {
  for (const match of code.matchAll(/\b([A-Za-z_$][\w$]*)\s*\(/g)) {
    const name = match[1];
    if (['if','for','while','switch','function'].includes(name)) continue;
    handlerCalls.set(name, (handlerCalls.get(name) || 0) + 1);
  }
}

const ids = [...snapshot.matchAll(/\bid=["']([^"']+)["']/gi)].map((m) => m[1]);
const idCounts = new Map();
ids.forEach((id) => idCounts.set(id, (idCounts.get(id) || 0) + 1));
const duplicateIds = [...idCounts.entries()].filter(([,n]) => n > 1).sort((a,b) => b[1]-a[1]);

report.snapshot.bytes = Buffer.byteLength(snapshot);
report.snapshot.inlineEventAttributes = handlerAttrs.length;
report.snapshot.uniqueInlineFunctions = [...handlerCalls.entries()].sort((a,b) => b[1]-a[1]);
report.snapshot.duplicateIds = duplicateIds;
report.snapshot.scriptTags = [...snapshot.matchAll(/<script\b/gi)].length;
report.snapshot.styleTags = [...snapshot.matchAll(/<style\b/gi)].length;
report.snapshot.views = [...snapshot.matchAll(/\bdata-view=["']([^"']+)["']/gi)].map((m)=>m[1]);

const codeFiles = ['site.js','career.js','calendar.js','course.js', ...paths.filter((p)=>p.startsWith('src/') && ['.ts','.tsx','.js'].includes(extname(p)))].filter(exists);
const functionsByFile = {};
const allDefined = new Map();
for (const p of codeFiles) {
  const c = read(p);
  const names = new Set();
  for (const m of c.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) names.add(m[1]);
  for (const m of c.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g)) names.add(m[1]);
  for (const m of c.matchAll(/\bwindow\.([A-Za-z_$][\w$]*)\s*=/g)) names.add(m[1]);
  functionsByFile[p] = [...names].sort();
  for (const n of names) {
    if (!allDefined.has(n)) allDefined.set(n, []);
    allDefined.get(n).push(p);
  }
}
report.javascript.functionsByFile = functionsByFile;
report.javascript.duplicateFunctionNames = [...allDefined.entries()].filter(([,ps])=>ps.length>1).sort((a,b)=>b[1].length-a[1].length);
report.javascript.domReadyListeners = codeFiles.filter((p)=>/DOMContentLoaded/.test(read(p)));
report.javascript.siteBytes = exists('site.js') ? statSync(join(root,'site.js')).size : 0;

const unresolvedInline = [];
for (const [name,count] of handlerCalls) {
  const defs = allDefined.get(name) || [];
  if (!defs.length) unresolvedInline.push([name,count]);
}
report.coupling.inlineHandlersByFunction = [...handlerCalls.entries()].sort((a,b)=>b[1]-a[1]);
report.coupling.inlineHandlerDefinitions = [...handlerCalls.keys()].sort().map((name)=>({ name, files: allDefined.get(name)||[] }));
report.coupling.unresolvedInlineHandlers = unresolvedInline;

const cssFiles = ['styles.css', ...paths.filter((p)=>p.startsWith('src/styles/') && p.endsWith('.css')), 'course.css'].filter(exists);
const selectorFiles = new Map();
let importantCount = 0;
for (const p of cssFiles) {
  const c = read(p).replace(/\/\*[\s\S]*?\*\//g,'');
  importantCount += (c.match(/!important/g) || []).length;
  for (const m of c.matchAll(/(^|})\s*([^@{}][^{}]*)\s*\{/gm)) {
    const raw = m[2].trim();
    if (!raw || raw.includes('@keyframes')) continue;
    for (const selector of raw.split(',').map((s)=>s.trim()).filter(Boolean)) {
      if (!selectorFiles.has(selector)) selectorFiles.set(selector, new Set());
      selectorFiles.get(selector).add(p);
    }
  }
}
report.css.files = cssFiles.map((p)=>({path:p, bytes:statSync(join(root,p)).size, important:(read(p).match(/!important/g)||[]).length}));
report.css.importantCount = importantCount;
report.css.crossFileDuplicateSelectors = [...selectorFiles.entries()]
  .filter(([,set])=>set.size>1)
  .map(([selector,set])=>({selector, files:[...set]}))
  .sort((a,b)=>b.files.length-a.files.length)
  .slice(0,120);

const assetFiles = paths.filter((p)=>p.startsWith('assets/') && !p.endsWith('/'));
const baseNames = new Map();
for (const p of assetFiles) {
  const name = p.slice(p.lastIndexOf('/')+1).replace(/\.[^.]+$/,'');
  if (!baseNames.has(name)) baseNames.set(name, []);
  baseNames.get(name).push(p);
}
report.assets.total = assetFiles.length;
report.assets.duplicateBasenames = [...baseNames.entries()].filter(([,ps])=>ps.length>1);
report.assets.largest = assetFiles.map((p)=>({path:p,bytes:statSync(join(root,p)).size})).sort((a,b)=>b.bytes-a.bytes).slice(0,20);

const legacyNeedles = [
  'initAcademyEnrollments','initCctV2Experience','initCareerExplorer','initEditorialAgenda','initAcademyOrbit','initRevealMotion','initTeleinformaFilters','initEventosBoomerang','initCalendar'
];
report.javascript.legacyInitializerOccurrences = legacyNeedles.map((name)=>({
  name,
  files: codeFiles.filter((p)=>read(p).includes(name))
}));

const rootRuntimeFiles = ['site.js','career.js','calendar.js','course.js','course.css','course.html','styles.css'].filter(exists);
report.coupling.rootRuntimeFiles = rootRuntimeFiles;
report.coupling.pagesDependingOnSnapshot = paths.filter((p)=>p.startsWith('src/pages/') && p.endsWith('/index.ts') && /extractView\(/.test(read(p)));
report.coupling.filesImportingLegacy = paths.filter((p)=>p.startsWith('src/') && ['.ts','.tsx'].includes(extname(p)) && /legacy\//.test(read(p)));

if (duplicateIds.length) report.findings.push(`snapshot tiene ${duplicateIds.length} IDs duplicados`);
if (handlerAttrs.length > 0) report.findings.push(`snapshot mantiene ${handlerAttrs.length} handlers inline`);
if (unresolvedInline.length) report.findings.push(`${unresolvedInline.length} handlers inline no tienen definición estática detectable`);
if (report.css.crossFileDuplicateSelectors.length) report.findings.push(`${report.css.crossFileDuplicateSelectors.length} selectores CSS se repiten entre archivos (muestra truncada a 120)`);
if (report.css.importantCount > 100) report.findings.push(`hay ${report.css.importantCount} usos de !important`);
if (report.coupling.pagesDependingOnSnapshot.length) report.findings.push(`${report.coupling.pagesDependingOnSnapshot.length} páginas siguen dependiendo del snapshot legacy`);

console.log('=== CCT DEEP AUDIT ===');
console.log(JSON.stringify(report, null, 2));

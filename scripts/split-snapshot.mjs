import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const sourcePath = join(root, 'src/legacy/snapshot.html');
const source = readFileSync(sourcePath, 'utf8');

function stripScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').trim();
}

function findElementAround(index) {
  const start = source.lastIndexOf('<', index);
  if (start < 0) throw new Error(`No se encontró apertura cerca de ${index}`);
  const head = source.slice(start, source.indexOf('>', start) + 1);
  const tagMatch = head.match(/^<([A-Za-z][\w:-]*)\b/);
  if (!tagMatch) throw new Error(`No se pudo detectar tag en ${head.slice(0, 80)}`);
  const tag = tagMatch[1];
  const tokenRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  tokenRe.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tokenRe.exec(source))) {
    const token = match[0];
    const closing = /^<\//.test(token);
    const selfClosing = /\/>$/.test(token);
    if (closing) depth -= 1;
    else if (!selfClosing) depth += 1;
    if (depth === 0) return { start, end: tokenRe.lastIndex, html: source.slice(start, tokenRe.lastIndex) };
  }
  throw new Error(`Elemento <${tag}> sin cierre`);
}

function extractByNeedle(needle) {
  const idx = source.indexOf(needle);
  if (idx < 0) throw new Error(`No se encontró ${needle}`);
  return findElementAround(idx);
}

function write(path, content) {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, `${stripScripts(content)}\n`, 'utf8');
  console.log(`[split] ${path}`);
}

const bodyOpen = source.match(/<body\b[^>]*>/i);
const bodyCloseIndex = source.search(/<\/body>/i);
if (!bodyOpen || bodyCloseIndex < 0) throw new Error('snapshot sin body válido');
const bodyStart = bodyOpen.index + bodyOpen[0].length;
const bodyEnd = bodyCloseIndex;

const main = extractByNeedle('id="appMain"');
write('src/layout/before-main.html', source.slice(bodyStart, main.start));

for (const view of ['inicio','nosotros','formacion','comunidad','eventos','telcon','recursos']) {
  const el = extractByNeedle(`data-view="${view}"`);
  write(`src/pages/${view}/markup.html`, el.html);
}

const footer = extractByNeedle('class="footer"');
write('src/layout/footer.html', footer.html);
write('src/layout/after-main.html', source.slice(main.end, bodyEnd));

console.log('[split] Snapshot dividido sin reescribir el HTML visual.');

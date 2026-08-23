import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

const path = 'site.js';
const source = readFileSync(path, 'utf8');
const targetNames = new Set([
  'closeAreaModal',
  'collectEnrollmentPayload',
  'debounce',
  'goToAreasFromWelcome',
  'moveCarousel',
  'openAreaModal',
  'openEnrollModal',
  'openNewsModal',
  'openStoryModal',
  'saveEnrollment',
]);

const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const ranges = [];
for (const statement of sourceFile.statements) {
  if (!ts.isFunctionDeclaration(statement) || !statement.name) continue;
  const name = statement.name.text;
  if (targetNames.has(name)) {
    ranges.push({ name, start: statement.getFullStart(), end: statement.end });
  }
}

if (ranges.length === 0) {
  console.log('[CCT] site.js ya no contiene las funciones muertas objetivo.');
  process.exit(0);
}

const found = new Set(ranges.map((range) => range.name));
const missing = [...targetNames].filter((name) => !found.has(name));
if (missing.length) {
  throw new Error(`Poda parcial abortada; no se encontraron: ${missing.join(', ')}`);
}

let next = source;
for (const range of ranges.sort((a, b) => b.start - a.start)) {
  next = `${next.slice(0, range.start)}${next.slice(range.end)}`;
}

next = next.replace(/\n{4,}/g, '\n\n\n');
writeFileSync(path, next.trimEnd() + '\n');
console.log(`[CCT] Podadas ${ranges.length} funciones muertas de site.js: ${[...found].sort().join(', ')}`);

import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

const path = 'site.js';
const sourceText = readFileSync(path, 'utf8');
const sourceFile = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);

const retiredFunctions = new Set([
  'initAcademyEnrollments',
  'initAcademyOrbit',
  'initCalendar',
  'initCareerExplorer',
  'initCctV2Experience',
  'initEditorialAgenda',
  'initEventosBoomerang',
  'initRevealMotion',
  'initTeleinformaFilters',
]);

const removals = [];

for (const statement of sourceFile.statements) {
  if (ts.isFunctionDeclaration(statement) && statement.name && retiredFunctions.has(statement.name.text)) {
    removals.push({ start: statement.getFullStart(), end: statement.getEnd(), label: statement.name.text });
    continue;
  }

  if (!ts.isExpressionStatement(statement) || !ts.isCallExpression(statement.expression)) continue;
  const call = statement.expression;
  if (!ts.isPropertyAccessExpression(call.expression)) continue;
  const target = call.expression;
  const isDocumentReady = target.expression.getText(sourceFile) === 'document'
    && target.name.text === 'addEventListener'
    && call.arguments[0]
    && ts.isStringLiteral(call.arguments[0])
    && call.arguments[0].text === 'DOMContentLoaded';
  if (isDocumentReady) removals.push({ start: statement.getFullStart(), end: statement.getEnd(), label: 'DOMContentLoaded auto-start' });
}

let output = sourceText;
for (const removal of removals.sort((a, b) => b.start - a.start)) {
  output = `${output.slice(0, removal.start)}${output.slice(removal.end)}`;
}

writeFileSync(path, output.replace(/\n{4,}/g, '\n\n\n'), 'utf8');
console.log(`[CCT] site.js podado con parser: ${removals.length} bloques retirados.`);
for (const removal of removals.reverse()) console.log(` - ${removal.label}`);

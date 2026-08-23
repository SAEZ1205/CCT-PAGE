import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const dist = join(root, 'dist');
const errors = [];

function fail(message) {
  errors.push(message);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else result.push(full);
  }
  return result;
}

function cleanRef(value) {
  return value.split('#')[0].split('?')[0].trim();
}

if (!existsSync(dist)) {
  fail('No existe dist/. Vite no generó la salida de producción.');
} else {
  const requiredDistFiles = ['index.html', 'site.js', 'career.js', 'calendar.js', 'course.html', 'course.css', 'course.js'];
  for (const path of requiredDistFiles) {
    const full = join(dist, path);
    if (!existsSync(full) || !statSync(full).isFile() || statSync(full).size === 0) {
      fail(`Falta archivo de producción o está vacío: dist/${path}`);
    }
  }

  const indexPath = join(dist, 'index.html');
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf8');
    if (html.includes('/src/main.tsx')) fail('dist/index.html todavía apunta al source de Vite (/src/main.tsx).');
    if (/(?:src|href)=["']\/(?!\/)/i.test(html)) {
      fail('dist/index.html contiene una ruta local absoluta que puede romper GitHub Pages.');
    }
    if (!/<script[^>]+type=["']module["'][^>]+src=["']\.\//i.test(html)) {
      fail('dist/index.html no contiene un bundle ESM relativo (./...), necesario para despliegue bajo subruta.');
    }
  }

  const sourceAssets = walk(join(root, 'assets'));
  for (const source of sourceAssets) {
    const assetPath = relative(join(root, 'assets'), source);
    const copied = join(dist, 'assets', assetPath);
    if (!existsSync(copied) || !statSync(copied).isFile() || statSync(copied).size === 0) {
      fail(`Asset fuente no llegó intacto a dist/assets: ${assetPath.replaceAll('\\', '/')}`);
    }
  }

  const htmlFiles = walk(dist).filter((file) => extname(file) === '.html');
  const attrRegex = /(?:src|href)=["']([^"']+)["']/gi;
  for (const file of htmlFiles) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(attrRegex)) {
      const ref = cleanRef(match[1]);
      if (!ref || ref.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
      if (ref.startsWith('//')) continue;
      if (ref.startsWith('/')) {
        fail(`${relative(dist, file)} contiene ruta local absoluta: ${ref}`);
        continue;
      }
      const target = resolve(dirname(file), ref);
      if (!target.startsWith(dist) || !existsSync(target)) {
        fail(`${relative(dist, file)} referencia un archivo inexistente: ${ref}`);
      }
    }
  }

  const cssFiles = walk(dist).filter((file) => extname(file) === '.css');
  const cssUrlRegex = /url\(\s*['"]?([^'"\)]+)['"]?\s*\)/gi;
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(cssUrlRegex)) {
      const ref = cleanRef(match[1]);
      if (!ref || /^(?:https?:|data:|#)/i.test(ref)) continue;
      if (ref.startsWith('/')) {
        fail(`${relative(dist, file)} contiene url() local absoluta: ${ref}`);
        continue;
      }
      const target = resolve(dirname(file), ref);
      if (!target.startsWith(dist) || !existsSync(target)) {
        fail(`${relative(dist, file)} contiene url() hacia archivo inexistente: ${ref}`);
      }
    }
  }

  const jsFiles = walk(dist).filter((file) => extname(file) === '.js');
  for (const file of jsFiles) {
    const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (check.status !== 0) {
      fail(`JavaScript inválido en ${relative(dist, file)}: ${(check.stderr || check.stdout || '').trim()}`);
    }
  }
}

if (errors.length) {
  console.error('\n[CCT] Smoke test de dist FALLÓ:\n');
  errors.forEach((message) => console.error(` - ${message}`));
  console.error('\nNo desplegar hasta corregir estos puntos.\n');
  process.exit(1);
}

const distFiles = walk(dist).length;
console.log(`[CCT] dist verificado: ${distFiles} archivos, rutas relativas correctas, assets copiados y JavaScript válido.`);

import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const HOST = '127.0.0.1';
const PORT = 4173;
const BASE_URL = `http://${HOST}:${PORT}`;

function findChrome() {
  for (const candidate of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    const probe = spawnSync('which', [candidate], { encoding: 'utf8' });
    if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
  }
  throw new Error('No se encontró Chrome/Chromium en el runner.');
}

async function waitForServer() {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(250);
  }
  throw new Error(`Vite preview no respondió: ${lastError}`);
}

function assertRendered(html, route) {
  const failures = [];
  if (!html.includes('id="appMain"')) failures.push('falta #appMain');
  if (html.includes('Cargando el sitio')) failures.push('sigue visible el fallback de carga');
  if (html.includes('No se pudo iniciar la interfaz')) failures.push('se activó el fallback de error');

  const viewPattern = new RegExp(`<[^>]*\\bid="view-${route}"[^>]*>`, 'i');
  const viewTag = html.match(viewPattern)?.[0] ?? '';
  if (!viewTag) failures.push(`falta #view-${route}`);
  else if (!/class="[^"]*\bactive\b[^"]*"/i.test(viewTag)) failures.push(`#view-${route} no quedó activo`);

  if (!html.includes('data-career-owner="typescript"')) failures.push('Conoce tu carrera no fue inicializado por TypeScript');
  if (!html.includes('data-calendar-owner="typescript"')) failures.push('Calendario de Inicio no fue inicializado por TypeScript');

  if (failures.length) throw new Error(`${route}: ${failures.join('; ')}`);
}

const preview = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js',
  'preview',
  '--host', HOST,
  '--port', String(PORT),
  '--strictPort',
], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let previewLog = '';
preview.stdout.on('data', (chunk) => { previewLog += chunk.toString(); });
preview.stderr.on('data', (chunk) => { previewLog += chunk.toString(); });

try {
  await waitForServer();
  const chrome = findChrome();
  const routes = ['inicio', 'nosotros', 'formacion', 'comunidad', 'eventos', 'telcon', 'recursos'];

  for (const route of routes) {
    const run = spawnSync(chrome, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--virtual-time-budget=2500',
      '--dump-dom',
      `${BASE_URL}/#${route}`,
    ], { encoding: 'utf8', maxBuffer: 12 * 1024 * 1024, timeout: 12000 });

    if (run.error) throw run.error;
    if (run.status !== 0) {
      throw new Error(`Chrome falló en #${route} (status ${run.status}): ${(run.stderr || '').slice(-2000)}`);
    }

    assertRendered(run.stdout, route);
    console.log(`[CCT] Browser OK: #${route}`);
  }

  console.log('[CCT] Browser smoke test OK: React montó, no hubo fallback blanco/error y las 7 rutas activaron su vista.');
} catch (error) {
  console.error('[CCT] Browser smoke test FALLÓ.');
  console.error(error);
  if (previewLog) console.error(`\nVite preview:\n${previewLog.slice(-3000)}`);
  process.exitCode = 1;
} finally {
  preview.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => preview.once('exit', resolve)),
    delay(1500),
  ]);
  if (preview.exitCode === null) preview.kill('SIGKILL');
}

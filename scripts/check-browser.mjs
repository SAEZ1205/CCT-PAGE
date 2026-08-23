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
  if (/class=["'][^"']*cct-runtime-error/i.test(html)) failures.push('se mostró AppErrorBoundary');

  // React reemplaza por completo el contenido inicial de #root. Por eso el
  // criterio correcto no es buscar el texto del error (que también vive dentro
  // del script inline), sino comprobar que el fallback real ya no exista.
  if (/id=["']cctBootFallback["']/i.test(html)) {
    failures.push('el fallback inicial sigue montado: React no reemplazó #root');
  }
  if (/id=["']cctBootMessage["']/i.test(html)) {
    failures.push('el mensaje de arranque sigue presente');
  }

  const viewPattern = new RegExp(`<[^>]*\\bid="view-${route}"[^>]*>`, 'i');
  const viewTag = html.match(viewPattern)?.[0] ?? '';
  if (!viewTag) failures.push(`falta #view-${route}`);
  else if (!/class="[^"]*\bactive\b[^"]*"/i.test(viewTag)) failures.push(`#view-${route} no quedó activo`);

  if (!html.includes('data-career-owner="typescript"')) failures.push('Conoce tu carrera no fue inicializado por TypeScript');
  if (!html.includes('data-calendar-owner="typescript"')) failures.push('Calendario de Inicio no fue inicializado por TypeScript');

  if (failures.length) throw new Error(`${route}: ${failures.join('; ')}`);
}

function assertCourseRendered(html) {
  const failures = [];
  if (!/class=["'][^"']*course-shell/i.test(html)) failures.push('falta .course-shell');
  if (!html.includes('id="moduleNav"')) failures.push('falta #moduleNav');
  if (!html.includes('id="lessonContent"')) failures.push('falta #lessonContent');
  if (!/class=["'][^"']*module-button/i.test(html)) failures.push('course.js no renderizó los módulos');
  if (!/MÓDULO 01|M&Oacute;DULO 01/i.test(html)) failures.push('course.js no renderizó la primera lección');
  if (failures.length) throw new Error(`course.html: ${failures.join('; ')}`);
}

function runChrome(chrome, url, label) {
  return spawnSync(chrome, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--no-first-run',
    '--virtual-time-budget=2500',
    '--dump-dom',
    url,
  ], {
    encoding: 'utf8',
    maxBuffer: 12 * 1024 * 1024,
    timeout: 25000,
  });
}

async function runChromeWithStartupRetry(chrome, url, label) {
  let run = runChrome(chrome, url, label);

  // Los runners hospedados pueden tardar de forma excepcional en arrancar el
  // binario de Chrome. Reintentamos solo ese caso de infraestructura; un fallo
  // real de la página, status != 0 o una aserción DOM nunca se ignora.
  if (run.error?.code === 'ETIMEDOUT') {
    console.warn(`[CCT] Chrome tardó en arrancar en ${label}; reintentando una vez.`);
    await delay(1000);
    run = runChrome(chrome, url, label);
  }

  return run;
}

function ensureChromeSucceeded(run, label) {
  if (run.error) throw run.error;
  if (run.status !== 0) {
    throw new Error(`Chrome falló en ${label} (status ${run.status}): ${(run.stderr || '').slice(-2000)}`);
  }
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
    const label = `#${route}`;
    const run = await runChromeWithStartupRetry(chrome, `${BASE_URL}/${label}`, label);
    ensureChromeSucceeded(run, label);
    assertRendered(run.stdout, route);
    console.log(`[CCT] Browser OK: ${label}`);
  }

  const unknown = await runChromeWithStartupRetry(chrome, `${BASE_URL}/#ruta-inexistente`, '#ruta-inexistente');
  ensureChromeSucceeded(unknown, '#ruta-inexistente');
  assertRendered(unknown.stdout, 'inicio');
  console.log('[CCT] Browser OK: ruta inexistente vuelve a #inicio');

  const course = await runChromeWithStartupRetry(chrome, `${BASE_URL}/course.html?course=cybersecurity`, 'course.html');
  ensureChromeSucceeded(course, 'course.html');
  assertCourseRendered(course.stdout);
  console.log('[CCT] Browser OK: course.html autónomo');

  console.log('[CCT] Browser smoke test OK: 7 vistas, fallback de ruta y Open Course cargaron en Chrome real.');
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

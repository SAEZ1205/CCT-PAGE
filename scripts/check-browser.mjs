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

function assertNosotrosMounted(html, failures) {
  const slideCount = html.match(/data-nosotros-photo=/g)?.length ?? 0;
  if (slideCount !== 2) failures.push(`Nosotros montó ${slideCount} fotos en vez de 2`);
  if (!html.includes('data-nosotros-slide-count="2"')) failures.push('Nosotros no declara 2 slides');
  if (!html.includes('data-nosotros-ready="true"')) failures.push('las dos fotos de Nosotros no terminaron de cargar');
}

function assertCommunityMounted(html, failures) {
  const posterCount = html.match(/data-tele-role=/g)?.length ?? 0;
  const mainCount = html.match(/data-tele-role="main"/g)?.length ?? 0;
  const sideCount = html.match(/data-tele-role="side"/g)?.length ?? 0;
  if (posterCount !== 3) failures.push(`Teleinforma montó ${posterCount} flyers en vez de 3`);
  if (mainCount !== 1) failures.push(`Teleinforma montó ${mainCount} flyer principal en vez de 1`);
  if (sideCount !== 2) failures.push(`Teleinforma montó ${sideCount} flyers pequeños en vez de 2`);
  if (/class="[^"]*tele-main-story/.test(html)) failures.push('Teleinforma volvió al artículo principal con texto');
  if (/class="[^"]*tele-side-story/.test(html)) failures.push('Teleinforma volvió a las tarjetas laterales con texto');
}

function assertRendered(html, route) {
  const failures = [];

  if (!html.includes('id="appMain"')) failures.push('falta #appMain');
  if (/class=["'][^"']*cct-runtime-error/i.test(html)) failures.push('se mostró AppErrorBoundary');

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
  if (route === 'nosotros') assertNosotrosMounted(html, failures);
  if (route === 'comunidad') assertCommunityMounted(html, failures);

  if (failures.length) throw new Error(`${route}: ${failures.join('; ')}`);
}

function assertNosotrosRotated(html) {
  const failures = [];
  assertNosotrosMounted(html, failures);
  if (!html.includes('data-nosotros-active="1"')) failures.push('después de más de 6 segundos la segunda foto no quedó activa');
  if (failures.length) throw new Error(`rotación Nosotros: ${failures.join('; ')}`);
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

function runChrome(chrome, url, label, virtualTimeBudget = 2500) {
  return spawnSync(chrome, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--no-first-run',
    `--virtual-time-budget=${virtualTimeBudget}`,
    '--dump-dom',
    url,
  ], {
    encoding: 'utf8',
    maxBuffer: 12 * 1024 * 1024,
    timeout: Math.max(25000, virtualTimeBudget + 18000),
  });
}

async function runChromeWithStartupRetry(chrome, url, label, virtualTimeBudget = 2500) {
  let run = runChrome(chrome, url, label, virtualTimeBudget);

  if (run.error?.code === 'ETIMEDOUT') {
    console.warn(`[CCT] Chrome tardó en arrancar en ${label}; reintentando una vez.`);
    await delay(1000);
    run = runChrome(chrome, url, label, virtualTimeBudget);
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

  const nosotrosRotation = await runChromeWithStartupRetry(chrome, `${BASE_URL}/#nosotros`, '#nosotros rotación', 9000);
  ensureChromeSucceeded(nosotrosRotation, '#nosotros rotación');
  assertNosotrosRotated(nosotrosRotation.stdout);
  console.log('[CCT] Browser OK: Nosotros cargó 2 fotos y activó la segunda después de 6 s');

  const unknown = await runChromeWithStartupRetry(chrome, `${BASE_URL}/#ruta-inexistente`, '#ruta-inexistente');
  ensureChromeSucceeded(unknown, '#ruta-inexistente');
  assertRendered(unknown.stdout, 'inicio');
  console.log('[CCT] Browser OK: ruta inexistente vuelve a #inicio');

  const course = await runChromeWithStartupRetry(chrome, `${BASE_URL}/course.html?course=cybersecurity`, 'course.html');
  ensureChromeSucceeded(course, 'course.html');
  assertCourseRendered(course.stdout);
  console.log('[CCT] Browser OK: course.html autónomo');

  console.log('[CCT] Browser smoke test OK: 7 vistas, Comunidad con 3 flyers, crossfade de Nosotros, fallback de ruta y Open Course cargaron en Chrome real.');
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

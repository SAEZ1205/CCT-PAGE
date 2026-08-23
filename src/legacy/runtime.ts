let bootPromise: Promise<void> | null = null;
const RUNTIME_VERSION = '20260823-single-owner-runtime';

type LegacyGlobal = (...args: never[]) => unknown;

function domContentLoadedAlreadyFired() {
  if (document.readyState === 'complete') return true;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return Boolean(navigation?.domContentLoadedEventEnd);
}

// Se crea al importar el módulo, antes de que el runtime legacy sea cargado.
// Así site.js nunca recibe un DOMContentLoaded artificial ni vuelve a arrancar
// módulos antiguos de Formación/Eventos después de que React ya tiene dueño.
const nativeDomReady = domContentLoadedAlreadyFired()
  ? Promise.resolve()
  : new Promise<void>((resolve) => {
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    });

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-cct-runtime="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`No se pudo cargar ${src}`)), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.cctRuntime = src;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`No se pudo cargar ${src}`)), { once: true });
    document.body.appendChild(script);
  });
}

async function loadSafely(src: string) {
  try {
    await loadScript(src);
  } catch (error) {
    console.error('[CCT] Módulo base omitido:', src, error);
  }
}

function runLegacyGlobal(name: string) {
  const candidate = (window as unknown as Record<string, unknown>)[name];
  if (typeof candidate !== 'function') {
    console.warn(`[CCT] Inicializador global no disponible: ${name}`);
    return;
  }

  try {
    (candidate as LegacyGlobal)();
  } catch (error) {
    console.error(`[CCT] Falló el inicializador global ${name}:`, error);
  }
}

const ALLOWED_SITE_INITIALIZERS = [
  'setupWelcomeContent',
  'initWelcomeToast',
  'initCookieNotice',
  'initAppShell',
  'initHeroCarousel',
  'initHeroVideo',
  'initResourcesFilters',
  'initBoardMemberPhotos',
  'initConvocatoriaForm',
] as const;

export function bootLegacyRuntime(): Promise<void> {
  if (bootPromise) return bootPromise;

  const base = import.meta.env.BASE_URL;
  const runtime = (name: string) => `${base}${name}?v=${RUNTIME_VERSION}`;

  bootPromise = (async () => {
    // Importante: esperamos al DOMContentLoaded NATIVO. site.js se carga después,
    // por lo que su antiguo listener de DOMContentLoaded ya no puede ejecutarse.
    await nativeDomReady;

    await loadSafely(runtime('site.js'));

    // site.js queda reducido a núcleo global. Ejecutamos una lista blanca explícita.
    // NO arrancar aquí initAcademyEnrollments, initCctV2Experience,
    // initEditorialAgenda ni initAcademyOrbit: esas áreas ya pertenecen a TypeScript.
    ALLOWED_SITE_INITIALIZERS.forEach(runLegacyGlobal);

    // Estos dos módulos son exclusivos de Inicio y se auto-inicializan al cargarse.
    await loadSafely(runtime('career.js'));
    await loadSafely(runtime('calendar.js'));
  })();

  return bootPromise;
}

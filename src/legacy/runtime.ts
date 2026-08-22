let bootPromise: Promise<void> | null = null;

const RUNTIME_VERSION = '20260822-clean2';

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

async function loadSafely(src: string): Promise<void> {
  try {
    await loadScript(src);
  } catch (error) {
    console.error('[CCT] Módulo visual omitido:', src, error);
  }
}

export function bootLegacyRuntime(): Promise<void> {
  if (bootPromise) return bootPromise;

  const base = import.meta.env.BASE_URL;
  const runtime = (name: string) => `${base}${name}?v=${RUNTIME_VERSION}`;

  bootPromise = (async () => {
    await loadSafely(runtime('site.js'));

    // site.js conserva inicializadores históricos basados en DOMContentLoaded.
    // React ya montó el DOM cuando llega aquí.
    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

    // Un único módulo activo por área; ninguno modifica otra sección.
    await loadSafely(runtime('career.js'));
    await loadSafely(runtime('calendar.js'));
    await loadSafely(runtime('nosotros.js'));
    await loadSafely(runtime('formation.js'));
  })();

  return bootPromise;
}

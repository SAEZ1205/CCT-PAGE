let bootPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-cct-runtime="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.cctRuntime = src;
    script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(); }, { once: true });
    script.addEventListener('error', () => reject(new Error(`No se pudo cargar ${src}`)), { once: true });
    document.body.appendChild(script);
  });
}

export function bootLegacyRuntime(): Promise<void> {
  if (bootPromise) return bootPromise;
  const base = import.meta.env.BASE_URL;
  bootPromise = loadScript(`${base}script-original.js`)
    .then(() => {
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      return loadScript(`${base}career-v3.js`);
    })
    .then(() => loadScript(`${base}calendar-v2.js`))
    .then(() => loadScript(`${base}nosotros-v2.js`))
    .then(() => loadScript(`${base}nosotros-v3.js`))
    .then(() => loadScript(`${base}formation-v2.js`))
    .then(() => loadScript(`${base}formation-v3.js`))
    .then(() => loadScript(`${base}formation-v4.js`))
    .catch((error) => console.error('[CCT] Error iniciando compatibilidad visual', error));
  return bootPromise;
}

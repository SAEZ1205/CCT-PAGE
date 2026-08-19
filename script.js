(() => {
  const current = document.currentScript;
  const base = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const load = (name, onload) => {
    const script = document.createElement('script');
    script.src = new URL(name, base).href;
    script.onload = onload || null;
    script.onerror = () => console.error(`[CCT] No se pudo cargar ${name}`);
    document.head.appendChild(script);
  };
  load('script-original.js', () => load('career-v3.js'));
})();

const VOICES_OWL_SOURCE = 'assets/owl-voces-cct.b64.txt';

let voicesOwlDataUrl: Promise<string> | null = null;

function getVoicesOwlDataUrl() {
  if (!voicesOwlDataUrl) {
    voicesOwlDataUrl = fetch(VOICES_OWL_SOURCE)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el búho de Voces CCT');
        return response.text();
      })
      .then((base64) => `data:image/webp;base64,${base64.trim()}`)
      .catch(() => '');
  }
  return voicesOwlDataUrl;
}

async function applyVoicesOwl() {
  const image = document.querySelector<HTMLImageElement>('#view-comunidad .voices-v3-owl');
  if (!image || image.dataset.voicesOwlApplied === 'true') return;

  const src = await getVoicesOwlDataUrl();
  if (!src) return;

  image.src = src;
  image.alt = 'Búho CCT con casco blanco de ingeniero señalando';
  image.dataset.voicesOwlApplied = 'true';
}

const startObserver = () => {
  void applyVoicesOwl();
  const observer = new MutationObserver(() => void applyVoicesOwl());
  observer.observe(document.body, { childList: true, subtree: true });
};

if (document.body) startObserver();
else window.addEventListener('DOMContentLoaded', startObserver, { once: true });

window.addEventListener('hashchange', () => void applyVoicesOwl());

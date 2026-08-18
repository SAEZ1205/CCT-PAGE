const VIEW_BY_HASH: Record<string, string> = {
  inicio: 'inicio', conoce: 'inicio', telecalendar: 'inicio',
  nosotros: 'nosotros', convocatorias: 'nosotros',
  formacion: 'formacion', comunidad: 'comunidad',
  eventos: 'eventos', agenda: 'eventos', telcon: 'telcon', recursos: 'recursos'
};

let initialized = false;

function routeFromHash(hash = window.location.hash): { view: string; target: string } {
  const target = hash.replace(/^#/, '') || 'inicio';
  return { view: VIEW_BY_HASH[target] || 'inicio', target };
}

function activateView(scroll = true) {
  const { view, target } = routeFromHash();
  document.querySelectorAll<HTMLElement>('.view[data-view]').forEach((node) => {
    node.classList.toggle('active', node.dataset.view === view);
  });
  document.querySelectorAll<HTMLAnchorElement>('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${view}`);
  });
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('burgerBtn')?.classList.remove('open');

  if (!scroll) return;
  requestAnimationFrame(() => {
    const main = document.getElementById('appMain');
    const targetNode = document.getElementById(target);
    if (targetNode && target !== view) targetNode.scrollIntoView({ block: 'start' });
    else if (main) main.scrollTop = 0;
  });
}

function navigate(hash: string) {
  if (window.location.hash === hash) activateView(true);
  else window.location.hash = hash;
}

export function initNavigation() {
  if (initialized) return;
  initialized = true;

  window.addEventListener('hashchange', () => activateView(true));
  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.length > 1) {
        event.preventDefault();
        navigate(href);
        return;
      }
    }
    if (target?.closest('.btn-header')) {
      event.preventDefault();
      navigate('#convocatorias');
      return;
    }
    if (target?.closest('#burgerBtn')) {
      document.getElementById('burgerBtn')?.classList.toggle('open');
      document.getElementById('mobileMenu')?.classList.toggle('open');
    }
  });

  activateView(false);
}

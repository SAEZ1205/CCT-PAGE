let initialized = false;

function revealAll() {
  document.querySelectorAll<HTMLElement>('.cct-reveal').forEach((element) => {
    element.classList.add('is-visible');
  });
}

export function initRevealMotion() {
  if (initialized) {
    revealAll();
    return;
  }
  initialized = true;

  // El contenido ya vive en el DOM React. No depende de un runtime antiguo
  // para dejar de estar oculto.
  revealAll();

  window.addEventListener('hashchange', () => {
    requestAnimationFrame(revealAll);
  });

  const main = document.getElementById('appMain');
  if (main) {
    const observer = new MutationObserver(() => revealAll());
    observer.observe(main, { childList: true, subtree: true });
  }
}

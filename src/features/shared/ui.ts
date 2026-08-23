export function initRevealMotion() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('.cct-reveal'));
  if (!elements.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}

export function initKeyboardAccessibility() {
  document.querySelectorAll<HTMLElement>('[role="button"][tabindex="0"]').forEach((element) => {
    if (element.dataset.cctKeyboardReady === 'true') return;
    element.dataset.cctKeyboardReady = 'true';

    element.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      element.click();
    });
  });
}

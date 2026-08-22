const teamImage = new URL('../../../assets/equipo-cct-2026.webp', import.meta.url).href;

function ensurePhoto(photoWrap: HTMLElement) {
  photoWrap.querySelectorAll('.board-slider, .board-collage').forEach((node) => node.remove());

  let image = photoWrap.querySelector<HTMLImageElement>(':scope > img');
  if (!image) {
    image = document.createElement('img');
    photoWrap.prepend(image);
  }

  image.src = teamImage;
  image.alt = 'Junta Directiva del Centro Cultural de Telecomunicaciones CCT UNI';
  image.loading = 'eager';
  image.decoding = 'async';
  image.removeAttribute('style');
  photoWrap.classList.add('nosotros-photo-stable');
}

export function initNosotros() {
  const view = document.getElementById('view-nosotros');
  if (!view || view.dataset.cctOwner === 'react-nosotros') return;
  view.dataset.cctOwner = 'react-nosotros';

  const hero = view.querySelector<HTMLElement>('.about-hero .inner-hero-content');
  if (hero) {
    const kicker = hero.querySelector<HTMLElement>('.v2-kicker');
    const title = hero.querySelector<HTMLElement>('h1');
    const desc = hero.querySelector<HTMLElement>('p');
    if (kicker) kicker.textContent = 'CCT · FIEE UNI';
    if (title) title.textContent = 'NOSOTROS';
    if (desc) desc.innerHTML = 'Una comunidad estudiantil que convierte las telecomunicaciones en <strong>aprendizaje, proyectos y oportunidades.</strong>';
  }

  const photoWrap = view.querySelector<HTMLElement>('.about-photo-main');
  if (photoWrap) ensurePhoto(photoWrap);

  const label = view.querySelector<HTMLElement>('.about-photo-main span');
  if (label) label.textContent = 'Junta Directiva CCT · FIEE UNI';

  const story = view.querySelector<HTMLElement>('.about-story-copy');
  if (story) {
    const kicker = story.querySelector<HTMLElement>('.v2-kicker');
    const title = story.querySelector<HTMLElement>('h3');
    const text = story.querySelector<HTMLElement>('p');
    if (kicker) kicker.textContent = 'JUNTA DIRECTIVA';
    if (title) title.innerHTML = 'El CCT se mueve porque hay <span class="nosotros-red">un equipo detrás.</span>';
    if (text) text.innerHTML = 'La Junta Directiva organiza y conecta las áreas que hacen posible el CCT: <strong>formación, eventos, difusión, proyectos y comunidad.</strong> Distintas responsabilidades, una misma meta: abrir más oportunidades para los estudiantes de Telecomunicaciones.';
  }
}

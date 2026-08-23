const teamImages = [
  {
    src: new URL('../../../assets/equipo-cct-2026.webp', import.meta.url).href,
    alt: 'Junta Directiva 2026 del Centro Cultural de Telecomunicaciones CCT UNI',
  },
  {
    src: new URL('../../../assets/equipo-cct-2026-grupal.webp', import.meta.url).href,
    alt: 'Junta Directiva 2026 del CCT UNI frente a la Facultad de Ingeniería Eléctrica y Electrónica',
  },
] as const;

function ensurePhotoCarousel(photoWrap: HTMLElement) {
  photoWrap.querySelectorAll('.board-slider, .board-collage').forEach((node) => node.remove());

  const existingImages = Array.from(photoWrap.querySelectorAll<HTMLImageElement>(':scope > img'));
  while (existingImages.length > teamImages.length) existingImages.pop()?.remove();

  const label = photoWrap.querySelector<HTMLElement>(':scope > span');
  const slides = teamImages.map((photo, index) => {
    let image = existingImages[index];
    if (!image) {
      image = document.createElement('img');
      if (label) photoWrap.insertBefore(image, label);
      else photoWrap.append(image);
    }

    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.removeAttribute('style');
    image.className = 'nosotros-photo-slide';
    image.classList.toggle('is-active', index === 0);
    return image;
  });

  photoWrap.classList.add('nosotros-photo-stable', 'nosotros-photo-rotator');

  const startRotationWhenReady = () => {
    if (photoWrap.dataset.carouselReady === 'true') return;
    if (!slides.every((image) => image.complete && image.naturalWidth > 0)) return;

    photoWrap.dataset.carouselReady = 'true';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let activeIndex = 0;
    window.setInterval(() => {
      slides[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add('is-active');
    }, 6000);
  };

  slides.forEach((image) => image.addEventListener('load', startRotationWhenReady, { once: true }));
  startRotationWhenReady();
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
  if (photoWrap) ensurePhotoCarousel(photoWrap);

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

const teamPhotos = [
  {
    src: new URL('../../../assets/equipo-cct-2026.webp', import.meta.url).href,
    alt: 'Junta Directiva del Centro Cultural de Telecomunicaciones CCT UNI reunida frente a la facultad',
  },
  {
    src: new URL('../../../assets/equipo-cct-2026-grupal.webp', import.meta.url).href,
    alt: 'Junta Directiva del Centro Cultural de Telecomunicaciones CCT UNI de pie frente a la UNI',
  },
] as const;

const ROTATION_MS = 6000;

function waitForImage(image: HTMLImageElement) {
  if (image.complete) {
    return image.naturalWidth > 0
      ? Promise.resolve()
      : Promise.reject(new Error(`No cargó la imagen ${image.src}`));
  }

  return new Promise<void>((resolve, reject) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => reject(new Error(`No cargó la imagen ${image.src}`)), { once: true });
  });
}

function setActivePhoto(photoWrap: HTMLElement, images: HTMLImageElement[], index: number) {
  images.forEach((image, imageIndex) => {
    const active = imageIndex === index;
    image.classList.toggle('is-active', active);
    image.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  photoWrap.dataset.nosotrosActive = String(index);
}

function ensurePhotoRotator(photoWrap: HTMLElement) {
  const previousTimer = Number(photoWrap.dataset.nosotrosTimer || 0);
  if (previousTimer) window.clearInterval(previousTimer);

  photoWrap.querySelectorAll('.board-slider, .board-collage, :scope > img, .nosotros-photo-stack').forEach((node) => node.remove());

  const stack = document.createElement('div');
  stack.className = 'nosotros-photo-stack';
  stack.setAttribute('aria-live', 'off');

  const images = teamPhotos.map((photo, index) => {
    const image = document.createElement('img');
    image.className = `nosotros-photo-slide${index === 0 ? ' is-active' : ''}`;
    image.dataset.nosotrosPhoto = String(index + 1);
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = 'eager';
    image.decoding = 'async';
    image.draggable = false;
    image.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    stack.append(image);
    return image;
  });

  photoWrap.prepend(stack);
  photoWrap.classList.add('nosotros-photo-stable', 'nosotros-photo-rotator');
  photoWrap.dataset.nosotrosSlideCount = String(images.length);
  photoWrap.dataset.nosotrosActive = '0';
  photoWrap.dataset.nosotrosReady = 'loading';

  Promise.all(images.map(waitForImage))
    .then(() => {
      photoWrap.dataset.nosotrosReady = 'true';
      setActivePhoto(photoWrap, images, 0);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      let activeIndex = 0;
      const timer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % images.length;
        setActivePhoto(photoWrap, images, activeIndex);
      }, ROTATION_MS);
      photoWrap.dataset.nosotrosTimer = String(timer);
    })
    .catch((error) => {
      photoWrap.dataset.nosotrosReady = 'error';
      console.error('[CCT] No se pudieron cargar las fotos de Nosotros.', error);
    });
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
  if (photoWrap) ensurePhotoRotator(photoWrap);

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

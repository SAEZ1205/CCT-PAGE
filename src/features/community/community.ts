const images = {
  teleAmazon: new URL('../../../assets/teleinforma-amazon.webp', import.meta.url).href,
  teleCard: new URL('../../../assets/teleinforma_card.png', import.meta.url).href,
  huawei: new URL('../../../assets/flyer-huawei-courses.webp', import.meta.url).href,
  community: new URL('../../../assets/event-community-group.webp', import.meta.url).href,
  auditorium: new URL('../../../assets/event-auditorium.webp', import.meta.url).href,
  feria: new URL('../../../assets/feria-stem-2023.webp', import.meta.url).href,
  visit: new URL('../../../assets/visit-network-operations.webp', import.meta.url).href,
  owl: new URL('../../../assets/owl-guide.webp', import.meta.url).href,
};

const teleItems = [
  { img: images.teleAmazon, alt: 'Teleinforma: Amazon LEO' },
  { img: images.teleCard, alt: 'Teleinforma: actualidad en telecomunicaciones' },
  { img: images.huawei, alt: 'Flyer de cursos Huawei para estudiantes' },
] as const;

const familyItems = [
  { img:images.community, tag:'COMUNIDAD', title:'Una comunidad que crece junta' },
  { img:images.auditorium, tag:'EVENTOS', title:'Auditorios que se llenan de ideas' },
  { img:images.feria, tag:'DIFUSIÓN', title:'Compartimos la carrera con nuevas generaciones' },
  { img:images.visit, tag:'FAMILIA CCT', title:'Telecomunicaciones también se construye en equipo' },
];

let teleIndex = 0;
let familyTimer = 0;

function renderTele(view: HTMLElement) {
  const grid = view.querySelector<HTMLElement>('.tele-curated-grid');
  if (!grid) return;

  const indexes = [0, 1, 2].map((step) => (teleIndex + step) % teleItems.length);
  const [main, sideA, sideB] = indexes.map((index) => teleItems[index]);

  grid.innerHTML = `
    <button class="tele-arrow tele-arrow-prev" type="button" data-dir="-1" aria-label="Flyer anterior">←</button>
    <a class="tele-poster tele-poster-main tele-story-enter" data-tele-role="main" href="https://www.instagram.com/cct_uni_fiee/" target="_blank" rel="noopener" aria-label="Ver publicación principal de Teleinforma en Instagram">
      <img src="${main.img}" alt="${main.alt}" loading="eager" decoding="async">
    </a>
    <a class="tele-poster tele-poster-side tele-story-enter" data-tele-role="side" data-step="1" href="https://www.instagram.com/cct_uni_fiee/" target="_blank" rel="noopener" aria-label="Ver publicación secundaria de Teleinforma en Instagram">
      <img src="${sideA.img}" alt="${sideA.alt}" loading="eager" decoding="async">
    </a>
    <a class="tele-poster tele-poster-side tele-story-enter" data-tele-role="side" data-step="2" href="https://www.instagram.com/cct_uni_fiee/" target="_blank" rel="noopener" aria-label="Ver publicación secundaria de Teleinforma en Instagram">
      <img src="${sideB.img}" alt="${sideB.alt}" loading="eager" decoding="async">
    </a>
    <button class="tele-arrow tele-arrow-next" type="button" data-dir="1" aria-label="Siguiente flyer">→</button>`;

  grid.querySelectorAll<HTMLButtonElement>('.tele-arrow').forEach((button) => {
    button.addEventListener('click', () => {
      teleIndex = (teleIndex + Number(button.dataset.dir) + teleItems.length) % teleItems.length;
      renderTele(view);
    });
  });

  grid.querySelectorAll<HTMLElement>('.tele-poster-side').forEach((poster) => {
    poster.addEventListener('click', (event) => {
      event.preventDefault();
      teleIndex = (teleIndex + Number(poster.dataset.step)) % teleItems.length;
      renderTele(view);
    });
  });
}

function initFamily(view: HTMLElement) {
  const figures = Array.from(view.querySelectorAll<HTMLElement>('.family-mosaic figure'));
  if (!figures.length) return;
  let order = familyItems.map((_, index) => index);

  const paint = (animate = false) => {
    if (animate) figures.forEach((figure) => figure.classList.add('is-fading'));
    window.setTimeout(() => {
      figures.forEach((figure, index) => {
        const item = familyItems[order[index % order.length]];
        const img = figure.querySelector<HTMLImageElement>('img');
        const caption = figure.querySelector<HTMLElement>('figcaption');
        if (img) { img.src = item.img; img.alt = item.title; }
        if (caption) caption.innerHTML = `<span>${item.tag}</span>${item.title}`;
        figure.classList.remove('is-fading');
      });
    }, animate ? 520 : 0);
  };

  const shuffle = () => {
    const next = familyItems.map((_, index) => index);
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    if (next.some((value, index) => value === order[index])) next.push(next.shift() as number);
    return next;
  };

  paint();
  if (familyTimer) window.clearInterval(familyTimer);
  familyTimer = window.setInterval(() => {
    if (document.hidden) return;
    order = shuffle();
    paint(true);
  }, 3900);
}

function initVoices(view: HTMLElement) {
  const img = view.querySelector<HTMLImageElement>('.voices-owl img');
  if (img) { img.src = images.owl; img.alt = 'Búho CCT presentando Voces CCT'; }
  const kicker = view.querySelector<HTMLElement>('.voices-copy .v2-kicker');
  const title = view.querySelector<HTMLElement>('.voices-copy h2');
  const text = view.querySelector<HTMLElement>('.voices-copy p');
  if (kicker) kicker.textContent = 'VOCES CCT · ENTREVISTAS';
  if (title) title.textContent = 'Personas detrás de la carrera.';
  if (text) text.textContent = 'Conversaciones breves con egresados, estudiantes y docentes: decisiones reales, aprendizajes y consejos que no siempre aparecen en la malla curricular.';
}

export function initCommunity() {
  const view = document.getElementById('view-comunidad');
  if (!view || view.dataset.cctOwner === 'react-comunidad') return;
  view.dataset.cctOwner = 'react-comunidad';
  renderTele(view);
  initFamily(view);
  initVoices(view);
}

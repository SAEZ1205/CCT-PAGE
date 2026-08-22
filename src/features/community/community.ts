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
  { img: images.teleAmazon, tag:'TELEINFORMA', title:'Tecnología que cambia cómo nos conectamos', text:'Noticias y contexto para entender mejor el mundo de las telecomunicaciones.' },
  { img: images.teleCard, tag:'ACTUALIDAD', title:'Lo importante, explicado desde Telecom', text:'Una selección visual de noticias y tendencias para la comunidad CCT.' },
  { img: images.huawei, tag:'INDUSTRIA · FORMACIÓN', title:'Oportunidades Huawei para estudiantes', text:'Formación, industria y nuevas rutas para seguir creciendo fuera del aula.' },
];

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
  const indexes = [0,1,2].map((step) => (teleIndex + step) % teleItems.length);
  const [main, sideA, sideB] = indexes.map((index) => teleItems[index]);

  grid.innerHTML = `
    <div class="tele-controls">
      <button class="tele-arrow" type="button" data-dir="-1" aria-label="Anterior">←</button>
      <button class="tele-arrow" type="button" data-dir="1" aria-label="Siguiente">→</button>
    </div>
    <article class="tele-main-story tele-story-enter">
      <img src="${main.img}" alt="${main.title}">
      <div><span class="feed-tag cyan">${main.tag}</span><h3>${main.title}</h3><p>${main.text}</p><a href="https://www.instagram.com/cct_uni_fiee/" target="_blank" rel="noopener">Ver publicación en Instagram ↗</a></div>
    </article>
    <article class="tele-side-story tele-story-enter" data-step="1"><img src="${sideA.img}" alt="${sideA.title}"><div><span>${sideA.tag}</span><h3>${sideA.title}</h3><b>Ver como principal →</b></div></article>
    <article class="tele-side-story tele-story-enter" data-step="2"><img src="${sideB.img}" alt="${sideB.title}"><div><span>${sideB.tag}</span><h3>${sideB.title}</h3><b>Ver como principal →</b></div></article>`;

  grid.querySelectorAll<HTMLButtonElement>('.tele-arrow').forEach((button) => {
    button.addEventListener('click', () => {
      teleIndex = (teleIndex + Number(button.dataset.dir) + teleItems.length) % teleItems.length;
      renderTele(view);
    });
  });
  grid.querySelectorAll<HTMLElement>('.tele-side-story').forEach((card) => {
    card.addEventListener('click', () => {
      teleIndex = (teleIndex + Number(card.dataset.step)) % teleItems.length;
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

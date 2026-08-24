const images = {
  teleAmazon: new URL('../../../assets/teleinforma-amazon.webp', import.meta.url).href,
  teleCard: new URL('../../../assets/teleinforma_card.png', import.meta.url).href,
  huawei: new URL('../../../assets/flyer-huawei-courses.webp', import.meta.url).href,
  community: new URL('../../../assets/event-community-group.webp', import.meta.url).href,
  auditorium: new URL('../../../assets/event-auditorium.webp', import.meta.url).href,
  feria: new URL('../../../assets/feria-stem-2023.webp', import.meta.url).href,
  visit: new URL('../../../assets/visit-network-operations.webp', import.meta.url).href,
  owl: new URL('../../../assets/owl-guide.webp', import.meta.url).href,
  owlAcademic: 'assets/owl-academic-cct.webp',
  owlInterviewBase64: 'assets/owl-interview-placeholder-small.b64.txt',
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

const voiceItems = [
  {
    key: 'egresados',
    tab: 'Egresados',
    eyebrow: 'EGRESADOS CCT',
    number: '01',
    title: 'Historias que abren camino.',
    text: 'Egresados de Telecomunicaciones contarán cómo dieron sus primeros pasos, qué decisiones marcaron su ruta y qué aprendieron al llegar a la industria.',
    tags: ['Primer empleo', 'Especialización', 'Consejos reales'],
    preview: 'Trayectorias profesionales, errores, oportunidades y aprendizajes después de la UNI.',
  },
  {
    key: 'estudiantes',
    tab: 'Estudiantes',
    eyebrow: 'ESTUDIANTES UNI',
    number: '02',
    title: 'La carrera mientras la estás viviendo.',
    text: 'Experiencias de estudiantes en distintos ciclos: cursos retadores, proyectos, grupos, concursos y decisiones que ayudan a aprovechar mejor la etapa universitaria.',
    tags: ['Vida UNI', 'Proyectos', 'Oportunidades'],
    preview: 'Voces cercanas para entender cómo se vive Telecomunicaciones desde dentro.',
  },
  {
    key: 'docentes',
    tab: 'Docentes UNI',
    eyebrow: 'DOCENTES UNI',
    number: '03',
    title: 'La experiencia que forma generaciones.',
    text: 'Docentes compartirán perspectivas sobre la carrera, tendencias de telecomunicaciones y recomendaciones para conectar mejor la formación académica con el mundo profesional.',
    tags: ['Academia', 'Industria', 'Futuro telecom'],
    preview: 'Ideas, contexto y orientación de quienes acompañan la formación de nuevas generaciones.',
  },
] as const;

let teleIndex = 0;
let familyTimer = 0;
let voiceIndex = 0;
let interviewPlaceholderDataUrl = '';
let interviewPlaceholderLoading: Promise<string> | null = null;

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

async function loadInterviewPlaceholder(section: HTMLElement) {
  if (interviewPlaceholderDataUrl) return interviewPlaceholderDataUrl;
  if (!interviewPlaceholderLoading) {
    interviewPlaceholderLoading = fetch(images.owlInterviewBase64)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar la imagen temporal de Voces CCT');
        return response.text();
      })
      .then((base64) => {
        interviewPlaceholderDataUrl = `data:image/webp;base64,${base64.trim()}`;
        section.querySelectorAll<HTMLImageElement>('.voices-v3-preview-image').forEach((img) => {
          img.src = interviewPlaceholderDataUrl;
        });
        return interviewPlaceholderDataUrl;
      })
      .catch(() => '');
  }
  return interviewPlaceholderLoading;
}

function initVoices(view: HTMLElement) {
  const section = view.querySelector<HTMLElement>('.voices-cct');
  if (!section) return;

  section.innerHTML = `
    <div class="container voices-v3-shell">
      <div class="voices-v3-visual" aria-label="Búho académico del CCT">
        <span class="voices-v3-badge">VOCES CCT</span>
        <span class="voices-v3-mini-label">CCT · FIEE UNI</span>
        <img class="voices-v3-owl" src="${images.owlAcademic}" alt="Búho académico CCT con toga y birrete" loading="eager" decoding="async">
        <div class="voices-v3-visual-note"><strong>Conecta.</strong><span>Aprende de quienes ya recorren el camino.</span></div>
      </div>

      <div class="voices-v3-content">
        <span class="v2-kicker voices-v3-kicker">VOCES CCT · ENTREVISTAS</span>
        <h2>Personas detrás<br><span>de la carrera.</span></h2>
        <p class="voices-v3-intro">Conoce las voces que viven Telecomunicaciones desde distintas perspectivas.</p>

        <div class="voices-v3-tabs" role="tablist" aria-label="Tipos de entrevista">
          ${voiceItems.map((item, index) => `
            <button class="voices-v3-tab${index === voiceIndex ? ' is-active' : ''}" type="button" role="tab" aria-selected="${index === voiceIndex}" data-voice-index="${index}">
              <span class="voices-v3-tab-index">0${index + 1}</span>${item.tab}
            </button>`).join('')}
        </div>

        <div class="voices-v3-panel" aria-live="polite"></div>
      </div>
    </div>`;

  const panel = section.querySelector<HTMLElement>('.voices-v3-panel');
  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>('.voices-v3-tab'));
  if (!panel || !tabs.length) return;

  void loadInterviewPlaceholder(section);

  const paint = (animate = false) => {
    const item = voiceItems[voiceIndex];
    tabs.forEach((tab, index) => {
      const active = index === voiceIndex;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    if (animate) panel.classList.add('is-changing');
    window.setTimeout(() => {
      panel.innerHTML = `
        <div class="voices-v3-preview">
          <img class="voices-v3-preview-image" src="${interviewPlaceholderDataUrl}" alt="Búho CCT con libro como imagen temporal de entrevista">
          <div class="voices-v3-preview-shade"></div>
          <div class="voices-v3-preview-top"><span>${item.eyebrow}</span><strong>${item.number}</strong></div>
          <div class="voices-v3-play" aria-hidden="true"><span>▶</span></div>
          <div class="voices-v3-preview-copy"><b>PRÓXIMAMENTE · VIDEO</b><p>${item.preview}</p></div>
        </div>
        <div class="voices-v3-story">
          <span class="voices-v3-story-kicker">${item.eyebrow}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <div class="voices-v3-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
          <div class="voices-v3-story-footer">
            <span>Entrevistas en preparación</span>
            <div class="voices-v3-arrows" aria-label="Cambiar categoría">
              <button type="button" data-voice-dir="-1" aria-label="Categoría anterior">←</button>
              <button type="button" data-voice-dir="1" aria-label="Categoría siguiente">→</button>
            </div>
          </div>
        </div>`;
      panel.classList.remove('is-changing');
      if (!interviewPlaceholderDataUrl) void loadInterviewPlaceholder(section);

      panel.querySelectorAll<HTMLButtonElement>('[data-voice-dir]').forEach((button) => {
        button.addEventListener('click', () => {
          voiceIndex = (voiceIndex + Number(button.dataset.voiceDir) + voiceItems.length) % voiceItems.length;
          paint(true);
        });
      });
    }, animate ? 130 : 0);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      voiceIndex = Number(tab.dataset.voiceIndex || 0);
      paint(true);
    });
  });

  paint();
}

export function initCommunity() {
  const view = document.getElementById('view-comunidad');
  if (!view || view.dataset.cctOwner === 'react-comunidad') return;
  view.dataset.cctOwner = 'react-comunidad';
  renderTele(view);
  initFamily(view);
  initVoices(view);
}

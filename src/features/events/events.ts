const images = {
  huawei: new URL('../../../assets/flyer-huawei-courses.webp', import.meta.url).href,
  auditorium: new URL('../../../assets/event-auditorium.webp', import.meta.url).href,
  community: new URL('../../../assets/event-community-group.webp', import.meta.url).href,
  feria: new URL('../../../assets/feria-stem-2023.webp', import.meta.url).href,
  owl: new URL('../../../assets/owl-front.webp', import.meta.url).href,
};

function renderHero(view: HTMLElement) {
  const copy = view.querySelector<HTMLElement>('.events-collage-copy');
  if (!copy) return;
  const kicker = copy.querySelector<HTMLElement>('.v2-kicker');
  const title = copy.querySelector<HTMLElement>('h1');
  const text = copy.querySelector<HTMLElement>('p');
  if (kicker) kicker.textContent = 'CCT · FIEE UNI';
  if (title) title.innerHTML = 'EVENTOS <em>CCT</em>';
  if (text) text.textContent = 'Encuentros que conectan estudiantes, industria y oportunidades en un mismo lugar.';
}

function renderFeatured(view: HTMLElement) {
  const section = view.querySelector<HTMLElement>('.featured-event-slot');
  if (!section) return;
  const heading = section.querySelector<HTMLElement>('.v2-heading-row');
  const box = section.querySelector<HTMLElement>('.featured-event-empty');
  if (heading) heading.innerHTML = '<div><span class="v2-kicker">PRÓXIMO EVENTO</span><h2>Lo que viene,<br><span>primero aquí.</span></h2></div><p>Este espacio destaca temporalmente convocatorias y eventos que merecen máxima visibilidad.</p>';
  if (box) box.innerHTML = `<div class="event-radar"><img class="event-flyer" src="${images.huawei}" alt="Huawei ICT · oportunidades internacionales"></div>
    <div><span>DESTACADO · CONVOCATORIA</span><h3>Huawei ICT · oportunidades internacionales</h3><p>Formación, industria y competencia para estudiantes que buscan conectar la universidad con oportunidades reales.</p><a href="https://www.instagram.com/cct_uni_fiee/" target="_blank" rel="noopener">Revisar convocatoria ↗</a><img class="event-feature-owl" src="${images.owl}" alt="Búho CCT acompañando el evento"></div>`;
}

function renderCalendar(view: HTMLElement) {
  const section = view.querySelector<HTMLElement>('.event-yearline');
  if (!section) return;
  const heading = section.querySelector<HTMLElement>('.v2-heading-row');
  const grid = section.querySelector<HTMLElement>('.yearline-scroll');
  if (heading) heading.innerHTML = '<div><span class="v2-kicker">TELE-CALENDAR</span><h2>Próximos hitos.<br><span>Todo a la vista.</span></h2></div><p>Una agenda visual solo para actividades y eventos CCT. Las fechas se publican cuando estén confirmadas.</p>';
  if (grid) grid.innerHTML = `
    <article><time>PRÓX.</time><img src="${images.huawei}" alt="Oportunidades Huawei ICT"><div><span>INDUSTRIA</span><h3>Huawei ICT · oportunidades internacionales</h3><p>Formación y competencia para conectar la universidad con la industria.</p></div></article>
    <article><time>POR CONFIRMAR</time><img src="${images.auditorium}" alt="Actividad técnica CCT"><div><span>TALLER</span><h3>Actividad técnica aplicada</h3><p>Charlas y talleres que acercan la carrera a experiencias reales.</p></div></article>
    <article><time>PRÓX.</time><img src="${images.community}" alt="Encuentro CCT"><div><span>ENCUENTRO</span><h3>Industria + comunidad</h3><p>Encuentros que conectan estudiantes, docentes y oportunidades.</p></div></article>`;
}

function renderMemory(view: HTMLElement) {
  const section = view.querySelector<HTMLElement>('.past-moments');
  if (!section) return;
  const title = section.querySelector<HTMLElement>('.past-moments-head h2');
  const grid = section.querySelector<HTMLElement>('.past-moments-grid');
  if (title) title.textContent = 'Momentos que quedan.';
  if (grid) grid.innerHTML = `
    <figure class="moment-main"><img src="${images.community}" alt="Comunidad CCT"><figcaption>Comunidad reunida <span>01</span></figcaption></figure>
    <figure><img src="${images.auditorium}" alt="Auditorio CCT"><figcaption>Auditorios llenos <span>02</span></figcaption></figure>
    <figure><img src="${images.feria}" alt="Difusión CCT"><figcaption>Compartiendo la carrera <span>03</span></figcaption></figure>`;
}

export function initEvents() {
  const view = document.getElementById('view-eventos');
  if (!view || view.dataset.cctOwner === 'react-eventos') return;
  view.dataset.cctOwner = 'react-eventos';
  renderHero(view);
  renderFeatured(view);
  renderCalendar(view);
  renderMemory(view);
}

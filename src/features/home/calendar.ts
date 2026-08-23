const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

type HomeEvent = {
  date: string;
  type: string;
  title: string;
  desc: string;
  image: string;
};

type CalendarState = { year: number; month: number };

const EVENTS: HomeEvent[] = [
  { date: '2026-08-07', type: 'FORMACIÓN', title: 'Nuevos cursos Huawei disponibles', desc: 'Formación online y asíncrona para seguir impulsando tu perfil tecnológico.', image: 'flyer-huawei-courses.webp' },
  { date: '2026-07-28', type: 'COMUNIDAD', title: 'El CCT celebra al Perú', desc: 'Publicación institucional por Fiestas Patrias.', image: 'flyer-fiestas-patrias.webp' },
];

const MONTHS = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const pad = (value: number) => String(value).padStart(2, '0');
const keyFor = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const monthEvents = (year: number, month: number) => EVENTS.filter((event) => event.date.startsWith(`${year}-${pad(month + 1)}-`));

function renderCalendar(root: HTMLElement, state: CalendarState) {
  const { year, month } = state;
  const first = new Date(year, month, 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const prev = new Date(year, month, 0).getDate();
  const today = new Date();
  const cells: string[] = [];

  for (let index = 0; index < 42; index += 1) {
    let date: Date;
    let muted = false;
    if (index < start) {
      date = new Date(year, month - 1, prev - start + index + 1);
      muted = true;
    } else if (index >= start + days) {
      date = new Date(year, month + 1, index - (start + days) + 1);
      muted = true;
    } else {
      date = new Date(year, month, index - start + 1);
    }

    const events = EVENTS.filter((event) => event.date === keyFor(date));
    const isToday = date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate();
    const badge = events.length
      ? `<div class="cct-date-badge" title="${events[0].title}"><span class="cct-date-badge-logo"><img src="${asset('cct-insignia.png')}" alt="CCT"></span><span class="cct-date-badge-text"><small>${events[0].type}</small><strong>${events[0].title}</strong></span></div>`
      : '';

    cells.push(`<div class="cct-day${muted ? ' is-muted' : ''}${isToday ? ' is-today' : ''}${events.length ? ' has-event' : ''}"><span class="cct-day-number">${date.getDate()}</span>${badge}</div>`);
  }

  const sideEvents = monthEvents(year, month);
  const side = sideEvents.length
    ? sideEvents.map((event) => `<article class="cct-flyer-card"><div class="cct-flyer-thumb"><img src="${asset(event.image)}" alt="${event.title}"></div><div class="cct-flyer-copy"><span>${event.type}</span><strong>${event.title}</strong><small>${event.desc}</small></div></article>`).join('')
    : '<div class="cct-month-empty">No hay actividades publicadas para este mes. Cuando se confirme una fecha, aparecerá directamente en su casilla.</div>';

  root.innerHTML = `<div class="cct-monthly-wrap"><div class="cct-monthly-card"><div class="cct-monthly-head"><div class="cct-monthly-title"><small>TELE-CALENDAR</small><strong>${MONTHS[month]} ${year}</strong></div><div class="cct-monthly-nav"><button type="button" data-cal-prev>←</button><button type="button" data-cal-next>→</button></div></div><div class="cct-weekdays">${WEEKDAYS.map((day) => `<span>${day}</span>`).join('')}</div><div class="cct-month-grid">${cells.join('')}</div></div><aside class="cct-monthly-side"><span>AGENDA DEL MES</span><h3>${MONTHS[month][0]}${MONTHS[month].slice(1).toLowerCase()} ${year}</h3><p>Las fechas con actividad llevan la insignia CCT. Aquí ves el flyer correspondiente sin ocupar demasiado espacio.</p>${side}</aside></div>`;

  root.querySelector('[data-cal-prev]')?.addEventListener('click', () => {
    state.month -= 1;
    if (state.month < 0) {
      state.month = 11;
      state.year -= 1;
    }
    renderCalendar(root, state);
  });

  root.querySelector('[data-cal-next]')?.addEventListener('click', () => {
    state.month += 1;
    if (state.month > 11) {
      state.month = 0;
      state.year += 1;
    }
    renderCalendar(root, state);
  });
}

export function initHomeCalendar() {
  const section = document.getElementById('telecalendar');
  if (!section || section.dataset.calendarOwner === 'typescript') return;

  section.dataset.calendarOwner = 'typescript';
  section.dataset.monthlyCalendar = 'ready';
  section.classList.add('is-visible');

  const heading = section.querySelector<HTMLElement>('.v2-heading-row');
  if (heading) {
    heading.innerHTML = '<div><span class="v2-kicker light">AGENDA GENERAL CCT</span><h2>Tu mes,<br><span>de un vistazo.</span></h2></div><p>Calendario mensual clásico con actividades marcadas directamente en su fecha.</p>';
  }

  let mount = section.querySelector<HTMLElement>('.cct-monthly-mount');
  if (!mount) {
    mount = document.createElement('div');
    mount.className = 'cct-monthly-mount';
    section.querySelector('.container')?.appendChild(mount);
  }

  const now = new Date();
  renderCalendar(mount, { year: now.getFullYear(), month: now.getMonth() });
}

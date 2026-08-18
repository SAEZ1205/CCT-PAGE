(() => {
  const current = document.currentScript;
  const SCRIPT_BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}`, SCRIPT_BASE).href;

  const EVENTS = [
    {
      date: '2026-08-07',
      type: 'FORMACIÓN',
      title: 'Nuevos cursos Huawei disponibles',
      desc: 'Formación online y asíncrona para seguir impulsando tu perfil tecnológico.'
    },
    {
      date: '2026-07-28',
      type: 'COMUNIDAD',
      title: 'El CCT celebra al Perú',
      desc: 'Publicación institucional por Fiestas Patrias.'
    }
  ];

  const CSS = `
    #telecalendar.home-agenda{padding:78px 0 82px!important;background:#0b0e17!important;color:#fff!important;display:block!important;opacity:1!important;transform:none!important;visibility:visible!important}
    #telecalendar .agenda-filter-row,
    #telecalendar .agenda-editorial,
    #telecalendar .agenda-calendar-note{display:none!important}
    #telecalendar .v2-heading-row{margin-bottom:26px}

    .cct-monthly-wrap{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:22px;align-items:start}
    .cct-monthly-card{border:1px solid rgba(255,255,255,.11);border-radius:18px;overflow:hidden;background:#101521;box-shadow:0 16px 40px rgba(0,0,0,.18)}
    .cct-monthly-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.1);background:#0e131e}
    .cct-monthly-title{display:flex;flex-direction:column;gap:2px}
    .cct-monthly-title small{font-size:.62rem;letter-spacing:.16em;font-weight:900;color:#00caff}
    .cct-monthly-title strong{font-size:1.45rem;line-height:1.1;font-weight:900;letter-spacing:-.035em;color:#fff;text-transform:uppercase}
    .cct-monthly-nav{display:flex;gap:8px}
    .cct-monthly-nav button{width:38px;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#171d29;color:#fff;font-size:1.05rem;cursor:pointer;transition:.2s ease}
    .cct-monthly-nav button:hover{background:#fff;color:#0b0e17}

    .cct-weekdays,.cct-month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}
    .cct-weekdays{border-bottom:1px solid rgba(255,255,255,.08);background:#0c111b}
    .cct-weekdays span{padding:11px 5px;text-align:center;font-size:.59rem;letter-spacing:.12em;font-weight:900;color:rgba(255,255,255,.45)}
    .cct-day{min-height:92px;padding:10px 9px;border-right:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);position:relative;background:#101521;transition:.2s ease}
    .cct-day:nth-child(7n){border-right:0}
    .cct-day.is-muted{background:#0d121c;color:rgba(255,255,255,.25)}
    .cct-day.is-today{box-shadow:inset 0 0 0 1px rgba(0,202,255,.55)}
    .cct-day-number{font-size:.75rem;font-weight:800;color:rgba(255,255,255,.72)}
    .cct-day.is-muted .cct-day-number{color:rgba(255,255,255,.24)}
    .cct-day.is-today .cct-day-number{color:#00caff}
    .cct-day.has-event{background:linear-gradient(180deg,#151b27,#111620)}
    .cct-day.has-event:hover{background:#19212e}

    .cct-date-badge{margin-top:10px;display:flex;align-items:center;gap:7px;max-width:100%;cursor:pointer}
    .cct-date-badge-logo{width:30px;height:23px;overflow:hidden;flex:0 0 30px;display:flex;align-items:flex-start;justify-content:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,.2))}
    .cct-date-badge-logo img{width:30px;height:auto;display:block}
    .cct-date-badge-text{min-width:0}
    .cct-date-badge-text small{display:block;color:#e8333c;font-size:.5rem;line-height:1.1;font-weight:900;letter-spacing:.08em}
    .cct-date-badge-text strong{display:block;color:#fff;font-size:.62rem;line-height:1.18;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    .cct-monthly-side{border:1px solid rgba(255,255,255,.1);border-radius:18px;background:#101521;padding:20px;min-height:240px}
    .cct-monthly-side>span{font-size:.6rem;font-weight:900;letter-spacing:.15em;color:#00caff}
    .cct-monthly-side h3{margin:7px 0 8px;font-size:1.35rem;color:#fff;letter-spacing:-.035em}
    .cct-monthly-side>p{margin:0 0 18px;color:rgba(255,255,255,.52);font-size:.82rem;line-height:1.6}
    .cct-month-event{display:grid;grid-template-columns:43px 1fr;gap:11px;padding:13px 0;border-top:1px solid rgba(255,255,255,.08)}
    .cct-month-event time{width:43px;height:43px;border-radius:11px;background:#171e2a;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff}
    .cct-month-event time b{font-size:1rem;line-height:1;font-weight:900}
    .cct-month-event time span{font-size:.5rem;margin-top:3px;color:#00caff;font-weight:900;letter-spacing:.08em}
    .cct-month-event div span{font-size:.52rem;color:#e8333c;font-weight:900;letter-spacing:.09em}
    .cct-month-event div strong{display:block;margin-top:3px;color:#fff;font-size:.78rem;line-height:1.35}
    .cct-month-empty{padding:25px 0 5px;color:rgba(255,255,255,.42);font-size:.8rem;line-height:1.6}

    @media(max-width:900px){
      .cct-monthly-wrap{grid-template-columns:1fr}
      .cct-monthly-side{min-height:0}
    }
    @media(max-width:640px){
      #telecalendar.home-agenda{padding:58px 0 62px!important}
      .cct-monthly-card{border-radius:14px}
      .cct-monthly-head{padding:15px}
      .cct-monthly-title strong{font-size:1.18rem}
      .cct-monthly-nav button{width:34px;height:34px}
      .cct-weekdays span{font-size:.5rem;padding:9px 2px;letter-spacing:.07em}
      .cct-day{min-height:70px;padding:7px 5px}
      .cct-day-number{font-size:.66rem}
      .cct-date-badge{margin-top:7px;gap:4px;align-items:flex-start}
      .cct-date-badge-logo{width:23px;height:18px;flex-basis:23px}
      .cct-date-badge-logo img{width:23px}
      .cct-date-badge-text{display:none}
    }
  `;

  const MONTHS = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
  const MONTHS_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const WEEKDAYS = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];

  function injectStyles(){
    if (document.getElementById('cctMonthlyCalendarStyles')) return;
    const style = document.createElement('style');
    style.id = 'cctMonthlyCalendarStyles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  const pad = (n) => String(n).padStart(2,'0');
  const keyFor = (date) => `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  const monthEvents = (year,month) => EVENTS.filter(event => event.date.startsWith(`${year}-${pad(month+1)}-`));

  function renderCalendar(root,state){
    const year = state.year;
    const month = state.month;
    const first = new Date(year,month,1);
    const firstMondayIndex = (first.getDay()+6)%7;
    const daysInMonth = new Date(year,month+1,0).getDate();
    const prevDays = new Date(year,month,0).getDate();
    const today = new Date();

    const cells = [];
    for(let i=0;i<42;i++){
      let date;
      let muted = false;
      if(i < firstMondayIndex){
        date = new Date(year,month-1,prevDays-firstMondayIndex+i+1);
        muted = true;
      } else if(i >= firstMondayIndex + daysInMonth){
        date = new Date(year,month+1,i-(firstMondayIndex+daysInMonth)+1);
        muted = true;
      } else {
        date = new Date(year,month,i-firstMondayIndex+1);
      }

      const dateKey = keyFor(date);
      const events = EVENTS.filter(event => event.date === dateKey);
      const isToday = date.getFullYear()===today.getFullYear() && date.getMonth()===today.getMonth() && date.getDate()===today.getDate();
      const badge = events.length ? `
        <div class="cct-date-badge" title="${events[0].title}">
          <span class="cct-date-badge-logo"><img src="${asset('cct-insignia.png')}" alt="CCT"></span>
          <span class="cct-date-badge-text"><small>${events[0].type}</small><strong>${events[0].title}</strong></span>
        </div>` : '';
      cells.push(`<div class="cct-day${muted?' is-muted':''}${isToday?' is-today':''}${events.length?' has-event':''}"><span class="cct-day-number">${date.getDate()}</span>${badge}</div>`);
    }

    const currentEvents = monthEvents(year,month);
    const side = currentEvents.length ? currentEvents.map(event => {
      const date = new Date(`${event.date}T12:00:00`);
      return `<article class="cct-month-event"><time><b>${date.getDate()}</b><span>${MONTHS_SHORT[date.getMonth()]}</span></time><div><span>${event.type}</span><strong>${event.title}</strong></div></article>`;
    }).join('') : '<div class="cct-month-empty">No hay actividades publicadas para este mes. Cuando se confirme una fecha, aparecerá directamente en su casilla.</div>';

    root.innerHTML = `
      <div class="cct-monthly-wrap">
        <div class="cct-monthly-card">
          <div class="cct-monthly-head">
            <div class="cct-monthly-title"><small>TELE-CALENDAR</small><strong>${MONTHS[month]} ${year}</strong></div>
            <div class="cct-monthly-nav"><button type="button" data-cal-prev aria-label="Mes anterior">←</button><button type="button" data-cal-next aria-label="Mes siguiente">→</button></div>
          </div>
          <div class="cct-weekdays">${WEEKDAYS.map(day => `<span>${day}</span>`).join('')}</div>
          <div class="cct-month-grid">${cells.join('')}</div>
        </div>
        <aside class="cct-monthly-side">
          <span>AGENDA DEL MES</span>
          <h3>${MONTHS[month][0]}${MONTHS[month].slice(1).toLowerCase()} ${year}</h3>
          <p>Las insignias del CCT aparecen únicamente en las fechas con una actividad publicada.</p>
          ${side}
        </aside>
      </div>`;

    root.querySelector('[data-cal-prev]')?.addEventListener('click', () => {
      state.month -= 1;
      if(state.month < 0){ state.month = 11; state.year -= 1; }
      renderCalendar(root,state);
    });
    root.querySelector('[data-cal-next]')?.addEventListener('click', () => {
      state.month += 1;
      if(state.month > 11){ state.month = 0; state.year += 1; }
      renderCalendar(root,state);
    });
  }

  function initMonthlyCalendar(){
    injectStyles();
    const section = document.getElementById('telecalendar');
    if(!section || section.dataset.monthlyCalendar === 'ready') return;
    section.dataset.monthlyCalendar = 'ready';
    section.classList.add('is-visible');

    const heading = section.querySelector('.v2-heading-row');
    if(heading){
      heading.innerHTML = `<div><span class="v2-kicker light">AGENDA GENERAL CCT</span><h2>Tu mes,<br><span>de un vistazo.</span></h2></div><p>Un calendario mensual clásico. Las fechas con actividad llevan una insignia del CCT directamente debajo del número.</p>`;
    }

    let mount = section.querySelector('.cct-monthly-mount');
    if(!mount){
      mount = document.createElement('div');
      mount.className = 'cct-monthly-mount';
      const container = section.querySelector('.container');
      if(container) container.appendChild(mount);
    }

    const now = new Date();
    renderCalendar(mount,{year:now.getFullYear(),month:now.getMonth()});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initMonthlyCalendar);
  else initMonthlyCalendar();
})();

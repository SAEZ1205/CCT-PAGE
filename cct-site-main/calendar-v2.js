(() => {
  const current = document.currentScript;
  const SCRIPT_BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}`, SCRIPT_BASE).href;

  const EVENTS = [
    { date:'2026-08-07', type:'FORMACIÓN', title:'Nuevos cursos Huawei disponibles', desc:'Formación online y asíncrona para seguir impulsando tu perfil tecnológico.', image:'flyer-huawei-courses.webp' },
    { date:'2026-07-28', type:'COMUNIDAD', title:'El CCT celebra al Perú', desc:'Publicación institucional por Fiestas Patrias.', image:'flyer-fiestas-patrias.webp' }
  ];

  const CSS = `
    #telecalendar.home-agenda{padding:68px 0 72px!important;background:#0b0e17!important;color:#fff!important;display:block!important;opacity:1!important;transform:none!important;visibility:visible!important}
    #telecalendar .agenda-filter-row,#telecalendar .agenda-editorial,#telecalendar .agenda-calendar-note{display:none!important}
    #telecalendar .v2-heading-row{margin-bottom:22px}
    .cct-monthly-wrap{display:grid;grid-template-columns:minmax(0,1fr) 286px;gap:18px;align-items:start}
    .cct-monthly-card{border:1px solid rgba(255,255,255,.11);border-radius:17px;overflow:hidden;background:#101521;box-shadow:0 16px 40px rgba(0,0,0,.18)}
    .cct-monthly-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.1);background:#0e131e}
    .cct-monthly-title{display:flex;flex-direction:column;gap:2px}.cct-monthly-title small{font-size:.6rem;letter-spacing:.16em;font-weight:900;color:#00caff}.cct-monthly-title strong{font-size:1.32rem;line-height:1.1;font-weight:900;letter-spacing:-.035em;color:#fff;text-transform:uppercase}
    .cct-monthly-nav{display:flex;gap:7px}.cct-monthly-nav button{width:35px;height:35px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:#171d29;color:#fff;font-size:1rem;cursor:pointer;transition:.2s ease}.cct-monthly-nav button:hover{background:#fff;color:#0b0e17}
    .cct-weekdays,.cct-month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.cct-weekdays{border-bottom:1px solid rgba(255,255,255,.08);background:#0c111b}.cct-weekdays span{padding:9px 5px;text-align:center;font-size:.56rem;letter-spacing:.12em;font-weight:900;color:rgba(255,255,255,.45)}
    .cct-day{min-height:82px;padding:9px 8px;border-right:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);position:relative;background:#101521;transition:.2s ease}.cct-day:nth-child(7n){border-right:0}.cct-day.is-muted{background:#0d121c;color:rgba(255,255,255,.25)}.cct-day.is-today{box-shadow:inset 0 0 0 1px rgba(0,202,255,.55)}.cct-day-number{font-size:.72rem;font-weight:800;color:rgba(255,255,255,.72)}.cct-day.is-muted .cct-day-number{color:rgba(255,255,255,.24)}.cct-day.is-today .cct-day-number{color:#00caff}.cct-day.has-event{background:linear-gradient(180deg,#151b27,#111620)}.cct-day.has-event:hover{background:#19212e}
    .cct-date-badge{margin-top:8px;display:flex;align-items:center;gap:6px;max-width:100%;cursor:pointer}.cct-date-badge-logo{width:27px;height:21px;overflow:hidden;flex:0 0 27px;display:flex;align-items:flex-start;justify-content:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,.2))}.cct-date-badge-logo img{width:27px;height:auto;display:block}.cct-date-badge-text{min-width:0}.cct-date-badge-text small{display:block;color:#e8333c;font-size:.47rem;line-height:1.1;font-weight:900;letter-spacing:.08em}.cct-date-badge-text strong{display:block;color:#fff;font-size:.58rem;line-height:1.18;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    .cct-monthly-side{border:1px solid rgba(255,255,255,.1);border-radius:17px;background:#101521;padding:16px;min-height:230px}.cct-monthly-side>span{font-size:.57rem;font-weight:900;letter-spacing:.15em;color:#00caff}.cct-monthly-side h3{margin:6px 0 7px;font-size:1.18rem;color:#fff;letter-spacing:-.035em}.cct-monthly-side>p{margin:0 0 12px;color:rgba(255,255,255,.5);font-size:.75rem;line-height:1.5}
    .cct-flyer-card{display:grid;grid-template-columns:92px 1fr;gap:10px;padding:10px 0;border-top:1px solid rgba(255,255,255,.08);align-items:center}.cct-flyer-thumb{width:92px;height:108px;border-radius:11px;overflow:hidden;background:#161d29}.cct-flyer-thumb img{width:100%;height:100%;display:block;object-fit:cover}.cct-flyer-copy span{font-size:.48rem;color:#e8333c;font-weight:900;letter-spacing:.08em}.cct-flyer-copy strong{display:block;margin-top:4px;color:#fff;font-size:.72rem;line-height:1.3}.cct-flyer-copy small{display:block;margin-top:5px;color:rgba(255,255,255,.48);font-size:.63rem;line-height:1.35}.cct-month-empty{padding:20px 0 4px;color:rgba(255,255,255,.42);font-size:.76rem;line-height:1.55}
    @media(max-width:900px){.cct-monthly-wrap{grid-template-columns:1fr}.cct-monthly-side{min-height:0}.cct-flyer-card{grid-template-columns:82px 1fr}.cct-flyer-thumb{width:82px;height:96px}}
    @media(max-width:640px){#telecalendar.home-agenda{padding:52px 0 56px!important}.cct-monthly-card{border-radius:14px}.cct-monthly-head{padding:14px}.cct-monthly-title strong{font-size:1.1rem}.cct-monthly-nav button{width:32px;height:32px}.cct-weekdays span{font-size:.48rem;padding:8px 2px;letter-spacing:.07em}.cct-day{min-height:66px;padding:6px 5px}.cct-day-number{font-size:.64rem}.cct-date-badge{margin-top:6px;gap:4px;align-items:flex-start}.cct-date-badge-logo{width:21px;height:17px;flex-basis:21px}.cct-date-badge-logo img{width:21px}.cct-date-badge-text{display:none}}
  `;

  const MONTHS=['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
  const WEEKDAYS=['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];
  const pad=(n)=>String(n).padStart(2,'0');
  const keyFor=(date)=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  const monthEvents=(year,month)=>EVENTS.filter(event=>event.date.startsWith(`${year}-${pad(month+1)}-`));

  function injectStyles(){if(document.getElementById('cctMonthlyCalendarStyles'))return;const s=document.createElement('style');s.id='cctMonthlyCalendarStyles';s.textContent=CSS;document.head.appendChild(s)}

  function renderCalendar(root,state){
    const {year,month}=state;const first=new Date(year,month,1);const start=(first.getDay()+6)%7;const days=new Date(year,month+1,0).getDate();const prev=new Date(year,month,0).getDate();const today=new Date();const cells=[];
    for(let i=0;i<42;i++){
      let date,muted=false;if(i<start){date=new Date(year,month-1,prev-start+i+1);muted=true}else if(i>=start+days){date=new Date(year,month+1,i-(start+days)+1);muted=true}else date=new Date(year,month,i-start+1);
      const events=EVENTS.filter(e=>e.date===keyFor(date));const isToday=date.getFullYear()===today.getFullYear()&&date.getMonth()===today.getMonth()&&date.getDate()===today.getDate();
      const badge=events.length?`<div class="cct-date-badge" title="${events[0].title}"><span class="cct-date-badge-logo"><img src="${asset('cct-insignia.png')}" alt="CCT"></span><span class="cct-date-badge-text"><small>${events[0].type}</small><strong>${events[0].title}</strong></span></div>`:'';
      cells.push(`<div class="cct-day${muted?' is-muted':''}${isToday?' is-today':''}${events.length?' has-event':''}"><span class="cct-day-number">${date.getDate()}</span>${badge}</div>`)
    }
    const sideEvents=monthEvents(year,month);const side=sideEvents.length?sideEvents.map(event=>`<article class="cct-flyer-card"><div class="cct-flyer-thumb"><img src="${asset(event.image)}" alt="${event.title}"></div><div class="cct-flyer-copy"><span>${event.type}</span><strong>${event.title}</strong><small>${event.desc}</small></div></article>`).join(''):'<div class="cct-month-empty">No hay actividades publicadas para este mes. Cuando se confirme una fecha, aparecerá directamente en su casilla.</div>';
    root.innerHTML=`<div class="cct-monthly-wrap"><div class="cct-monthly-card"><div class="cct-monthly-head"><div class="cct-monthly-title"><small>TELE-CALENDAR</small><strong>${MONTHS[month]} ${year}</strong></div><div class="cct-monthly-nav"><button type="button" data-cal-prev>←</button><button type="button" data-cal-next>→</button></div></div><div class="cct-weekdays">${WEEKDAYS.map(d=>`<span>${d}</span>`).join('')}</div><div class="cct-month-grid">${cells.join('')}</div></div><aside class="cct-monthly-side"><span>AGENDA DEL MES</span><h3>${MONTHS[month][0]}${MONTHS[month].slice(1).toLowerCase()} ${year}</h3><p>Las fechas con actividad llevan la insignia CCT. Aquí ves el flyer correspondiente sin ocupar demasiado espacio.</p>${side}</aside></div>`;
    root.querySelector('[data-cal-prev]')?.addEventListener('click',()=>{state.month--;if(state.month<0){state.month=11;state.year--}renderCalendar(root,state)});root.querySelector('[data-cal-next]')?.addEventListener('click',()=>{state.month++;if(state.month>11){state.month=0;state.year++}renderCalendar(root,state)});
  }

  function initMonthlyCalendar(){injectStyles();const section=document.getElementById('telecalendar');if(!section||section.dataset.monthlyCalendar==='ready')return;section.dataset.monthlyCalendar='ready';section.classList.add('is-visible');const heading=section.querySelector('.v2-heading-row');if(heading)heading.innerHTML='<div><span class="v2-kicker light">AGENDA GENERAL CCT</span><h2>Tu mes,<br><span>de un vistazo.</span></h2></div><p>Calendario mensual clásico con actividades marcadas directamente en su fecha.</p>';let mount=section.querySelector('.cct-monthly-mount');if(!mount){mount=document.createElement('div');mount.className='cct-monthly-mount';section.querySelector('.container')?.appendChild(mount)}const now=new Date();renderCalendar(mount,{year:now.getFullYear(),month:now.getMonth()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMonthlyCalendar);else initMonthlyCalendar();
})();

(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}?v=20260822-events`, BASE).href;
  const CSS = `
    #view-eventos .events-collage-copy .v2-kicker{color:#00caff!important}
    #view-eventos .events-collage-copy .v2-kicker::before{background:#00caff!important}
    #view-eventos .events-collage-copy h1{font-size:clamp(4.5rem,10vw,10rem)!important;line-height:.84!important;letter-spacing:-.065em!important;color:#fff!important;text-transform:uppercase!important;margin:12px 0 16px!important}
    #view-eventos .events-collage-copy h1 em{color:#fff!important;font-style:normal!important}
    #view-eventos .events-collage-copy p{font-size:1.05rem!important;max-width:650px!important;color:rgba(255,255,255,.78)!important}
    #view-eventos .featured-event-slot{background:#f7f8fb!important;padding:72px 0!important}
    #view-eventos .featured-event-empty{display:grid!important;grid-template-columns:minmax(260px,.75fr) minmax(0,1.25fr)!important;gap:30px!important;align-items:center!important;background:#0b0e17!important;border-radius:28px!important;padding:26px!important;overflow:hidden!important;color:#fff!important}
    #view-eventos .event-radar{height:480px!important;border-radius:20px!important;background:#fff!important;overflow:hidden!important;position:relative!important;display:block!important}
    #view-eventos .event-radar img.event-flyer{width:100%!important;height:100%!important;object-fit:contain!important;display:block!important}
    #view-eventos .featured-event-empty>div:last-child{padding:16px 20px!important;position:relative!important;min-height:440px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
    #view-eventos .featured-event-empty>div:last-child>span{color:#00caff!important;font-size:.68rem!important;font-weight:900!important;letter-spacing:.13em!important}
    #view-eventos .featured-event-empty h3{font-size:clamp(2rem,4.4vw,4.5rem)!important;line-height:.95!important;letter-spacing:-.05em!important;margin:10px 0!important;color:#fff!important}
    #view-eventos .featured-event-empty p{color:rgba(255,255,255,.67)!important;max-width:580px!important;line-height:1.65!important}
    #view-eventos .featured-event-empty a{display:inline-flex!important;align-self:flex-start!important;margin-top:12px!important;padding:12px 18px!important;border-radius:999px!important;background:#00caff!important;color:#07101b!important;text-decoration:none!important;font-weight:900!important}
    #view-eventos .event-feature-owl{position:absolute!important;right:-20px!important;bottom:-55px!important;width:210px!important;height:260px!important;object-fit:contain!important;filter:drop-shadow(0 16px 24px rgba(0,0,0,.28))!important;pointer-events:none!important}
    #view-eventos .event-yearline{background:#0b0e17!important;color:#fff!important;padding:72px 0!important}
    #view-eventos .event-yearline .v2-kicker{color:#00caff!important}
    #view-eventos .event-yearline .v2-kicker::before{background:#00caff!important}
    #view-eventos .event-yearline .v2-heading-row h2 span{color:#00caff!important}
    #view-eventos .yearline-scroll{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px!important;overflow:visible!important}
    #view-eventos .yearline-scroll article{background:#131925!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:20px!important;overflow:hidden!important;min-width:0!important;color:#fff!important;position:relative!important}
    #view-eventos .yearline-scroll article img{width:100%!important;height:250px!important;object-fit:cover!important;display:block!important}
    #view-eventos .yearline-scroll article>div{padding:18px!important}
    #view-eventos .yearline-scroll article time{position:absolute!important;margin:14px!important;background:#d52b3d!important;color:#fff!important;border-radius:999px!important;padding:7px 10px!important;font-size:.58rem!important;font-weight:900!important;z-index:2!important}
    #view-eventos .yearline-scroll article span{color:#00caff!important;font-size:.58rem!important;font-weight:900!important;letter-spacing:.1em!important}
    #view-eventos .yearline-scroll article h3{font-size:1.18rem!important;margin:7px 0!important;color:#fff!important}
    #view-eventos .yearline-scroll article p{color:rgba(255,255,255,.6)!important;font-size:.75rem!important;line-height:1.5!important}
    #view-eventos .past-moments{padding:72px 0!important;background:#fff!important}
    #view-eventos .past-moments-head{display:flex!important;align-items:end!important;justify-content:space-between!important;gap:30px!important;margin-bottom:24px!important}
    #view-eventos .past-moments-head .v2-kicker{color:#d52b3d!important}
    #view-eventos .past-moments-head h2{font-size:clamp(2.4rem,5vw,5rem)!important;line-height:.9!important;letter-spacing:-.05em!important;margin:0!important;max-width:650px!important}
    #view-eventos .past-moments-grid{display:grid!important;grid-template-columns:1.35fr 1fr 1fr!important;gap:14px!important}
    #view-eventos .past-moments-grid figure{height:380px!important;border-radius:20px!important;overflow:hidden!important;position:relative!important;margin:0!important}
    #view-eventos .past-moments-grid img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}
    #view-eventos .past-moments-grid figcaption{position:absolute!important;bottom:0!important;left:0!important;right:0!important;padding:50px 18px 16px!important;background:linear-gradient(transparent,rgba(5,8,14,.9))!important;color:#fff!important;font-weight:900!important}
    #view-eventos .past-moments-grid figcaption span{float:right!important;color:#00caff!important}
    @media(max-width:900px){#view-eventos .featured-event-empty{grid-template-columns:1fr!important}#view-eventos .event-feature-owl{width:160px!important;height:200px!important}#view-eventos .yearline-scroll{grid-template-columns:1fr 1fr!important}#view-eventos .past-moments-grid{grid-template-columns:1fr!important}}
    @media(max-width:600px){#view-eventos .yearline-scroll{grid-template-columns:1fr!important}#view-eventos .event-radar{height:420px!important}#view-eventos .featured-event-empty>div:last-child{min-height:370px!important}}
  `;
  function hero(){const c=document.querySelector('#view-eventos .events-collage-copy');if(!c)return;const k=c.querySelector('.v2-kicker');const h=c.querySelector('h1');const p=c.querySelector('p');if(k)k.textContent='CCT · FIEE UNI';if(h)h.innerHTML='EVENTOS <em>CCT</em>';if(p)p.textContent='Encuentros que conectan estudiantes, industria y oportunidades en un mismo lugar.'}
  function featured(){const s=document.querySelector('#view-eventos .featured-event-slot');if(!s)return;const head=s.querySelector('.v2-heading-row');if(head)head.innerHTML='<div><span class="v2-kicker">PRÓXIMO EVENTO</span><h2>Lo que viene,<br><span>primero aquí.</span></h2></div><p>Este espacio destaca temporalmente convocatorias y eventos que merecen máxima visibilidad.</p>';const box=s.querySelector('.featured-event-empty');if(box)box.innerHTML=`<div class="event-radar"><img class="event-flyer" src="${asset('flyer-huawei-courses.webp')}" alt="Huawei ICT · oportunidades internacionales"></div><div><span>DESTACADO · CONVOCATORIA</span><h3>Huawei ICT · oportunidades internacionales</h3><p>Formación, industria y competencia para estudiantes que buscan conectar la universidad con oportunidades reales.</p><a href="https://www.instagram.com/cct_uni_fiee/" target="_blank" rel="noopener">Revisar convocatoria ↗</a><img class="event-feature-owl" src="${asset('owl-front.webp')}" alt="Búho CCT acompañando el evento"></div>`}
  function calendar(){const s=document.querySelector('#view-eventos .event-yearline');if(!s)return;const head=s.querySelector('.v2-heading-row');if(head)head.innerHTML='<div><span class="v2-kicker">TELE-CALENDAR</span><h2>Próximos hitos.<br><span>Todo a la vista.</span></h2></div><p>Una agenda visual solo para actividades y eventos CCT. Las fechas se publican cuando estén confirmadas.</p>';const g=s.querySelector('.yearline-scroll');if(g)g.innerHTML=`<article><time>PRÓX.</time><img src="${asset('flyer-huawei-courses.webp')}" alt="Oportunidades Huawei ICT"><div><span>INDUSTRIA</span><h3>Huawei ICT · oportunidades internacionales</h3><p>Formación y competencia para conectar la universidad con la industria.</p></div></article><article><time>POR CONFIRMAR</time><img src="${asset('event-auditorium.webp')}" alt="Actividad técnica CCT"><div><span>TALLER</span><h3>Actividad técnica aplicada</h3><p>Charlas y talleres que acercan la carrera a experiencias reales.</p></div></article><article><time>PRÓX.</time><img src="${asset('event-community-group.webp')}" alt="Encuentro CCT"><div><span>ENCUENTRO</span><h3>Industria + comunidad</h3><p>Encuentros que conectan estudiantes, docentes y oportunidades.</p></div></article>`}
  function memory(){const s=document.querySelector('#view-eventos .past-moments');if(!s)return;const h=s.querySelector('.past-moments-head h2');if(h)h.textContent='Momentos que quedan.';const g=s.querySelector('.past-moments-grid');if(g)g.innerHTML=`<figure class="moment-main"><img src="${asset('event-community-group.webp')}" alt="Comunidad CCT"><figcaption>Comunidad reunida <span>01</span></figcaption></figure><figure><img src="${asset('event-auditorium.webp')}" alt="Auditorio CCT"><figcaption>Auditorios llenos <span>02</span></figcaption></figure><figure><img src="${asset('feria-stem-2023.webp')}" alt="Difusión CCT"><figcaption>Compartiendo la carrera <span>03</span></figcaption></figure>`}
  function init(){if(!document.getElementById('eventsStyles')){const s=document.createElement('style');s.id='eventsStyles';s.textContent=CSS;document.head.appendChild(s)}hero();featured();calendar();memory()}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

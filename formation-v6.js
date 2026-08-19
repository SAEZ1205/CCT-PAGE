(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}?v=6`, BASE).href;

  const COURSES = [
    { id:'cybersecurity', level:'PRINCIPIANTE', title:'Analista Junior en Ciberseguridad', desc:'Amenazas, endpoints y fundamentos de seguridad.', hours:'120 h', img:'course-support.webp' },
    { id:'defense', level:'INTERMEDIO', title:'Cybersecurity Defense Analyst', desc:'Monitoreo, análisis y respuesta a incidentes SOC.', hours:'30 h', img:'course-network-lab.webp' },
    { id:'ethical-hacking', level:'INTERMEDIO', title:'Hacker Ético', desc:'Evaluación responsable de vulnerabilidades.', hours:'70 h', img:'course-wireless.webp' }
  ];

  const CSS = `
    #view-formacion .open-course-v3-section{background:#0b0e17!important;color:#fff!important;padding:56px 0 62px!important}
    #view-formacion .open-course-v3-section .v2-kicker{color:#d52b3d!important}
    #view-formacion .open-course-v3-section .open-course-heading h2{color:#fff!important}
    #view-formacion .open-course-v3-section .open-course-heading h2 span{color:#18b7f1!important}
    #view-formacion .open-course-v3-section .open-course-heading p{color:rgba(255,255,255,.58)!important}
    #view-formacion .open-course-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:18px!important;margin-top:26px!important}
    #view-formacion .course-v6-card{min-width:0;background:#121824;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;color:#fff;text-decoration:none;display:flex;flex-direction:column;transition:transform .24s ease,border-color .24s ease,box-shadow .24s ease}
    #view-formacion .course-v6-card:hover{transform:translateY(-4px);border-color:rgba(24,183,241,.55);box-shadow:0 18px 38px rgba(0,0,0,.22)}
    #view-formacion .course-v6-media{height:230px;background:#0e1420;overflow:hidden;position:relative}
    #view-formacion .course-v6-media img{width:100%!important;height:100%!important;display:block!important;opacity:1!important;visibility:visible!important;object-fit:cover!important;object-position:center 30%!important}
    #view-formacion .course-v6-level{position:absolute;z-index:2;left:14px;top:14px;padding:7px 10px;border-radius:8px;background:#d52b3d;color:#fff;font-size:.55rem;font-weight:900;letter-spacing:.05em}
    #view-formacion .course-v6-body{padding:17px 17px 18px;display:flex;flex-direction:column;min-height:165px}
    #view-formacion .course-v6-body>small{color:#d52b3d!important;font-size:.56rem;font-weight:900;letter-spacing:.1em}
    #view-formacion .course-v6-body h3{margin:7px 0 6px;color:#fff!important;font-size:1.02rem;line-height:1.2}
    #view-formacion .course-v6-body p{margin:0;color:rgba(255,255,255,.66)!important;font-size:.72rem;line-height:1.5;flex:1}
    #view-formacion .course-v6-meta{margin-top:13px;color:#b9dff0!important;font-size:.64rem;font-weight:700}
    @media(max-width:850px){#view-formacion .open-course-grid{grid-template-columns:1fr 1fr!important}}
    @media(max-width:600px){#view-formacion .open-course-grid{grid-template-columns:1fr!important}#view-formacion .course-v6-media{height:260px}}
  `;

  function init(){
    if(!document.getElementById('formationV6Styles')){
      const style=document.createElement('style');
      style.id='formationV6Styles';
      style.textContent=CSS;
      document.head.appendChild(style);
    }

    const section=document.querySelector('#view-formacion .open-course-v3-section') || document.querySelector('#view-formacion .open-course-section');
    if(!section) return;
    section.classList.add('open-course-v3-section');

    const kicker=section.querySelector('.v2-kicker');
    if(kicker) kicker.textContent='OPEN COURSE CCT';

    const heading=section.querySelector('.open-course-heading h2');
    if(heading) heading.innerHTML='Elige una ruta. <span>Aprende por módulos.</span>';

    const grid=section.querySelector('.open-course-grid');
    if(!grid) return;
    grid.innerHTML=COURSES.map(c=>`
      <a class="course-v6-card" href="course.html?course=${c.id}" target="_blank" rel="noopener">
        <div class="course-v6-media">
          <img src="${asset(c.img)}" alt="${c.title}">
          <span class="course-v6-level">${c.level}</span>
        </div>
        <div class="course-v6-body">
          <small>OPEN COURSE CCT</small>
          <h3>${c.title}</h3>
          <p>${c.desc}</p>
          <div class="course-v6-meta">◷ ${c.hours} · Abrir aula ↗</div>
        </div>
      </a>`).join('');
  }

  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();
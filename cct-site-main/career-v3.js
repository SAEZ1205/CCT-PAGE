(() => {
  const GALLERY = [
    'assets/event-auditorium.webp',
    'assets/event-community-group.webp',
    'assets/telecom-day-2023.webp',
    'assets/certificates-cct.webp',
    'assets/event-osiptel-stage.webp',
    'assets/visit-network-operations.webp'
  ];

  const TOPICS = [
    'FIBRA ÓPTICA', 'REDES', 'CIBERSEGURIDAD', '5G',
    'INALÁMBRICO', 'RADIOFRECUENCIA', 'SATÉLITES'
  ];

  const CSS = `
    .career-v3{background:#fff!important;color:#121522!important;padding:82px 0 70px!important;overflow:hidden;position:relative}
    .career-v3::before{content:'';position:absolute;inset:0 0 auto;height:1px;background:linear-gradient(90deg,transparent,rgba(168,32,46,.16),transparent)}
    .career-v3 .career-v3-shell{position:relative;z-index:1}
    .career-v3-top{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);align-items:center;gap:44px;min-height:425px}
    .career-v3-copy{max-width:690px;padding:24px 34px 28px 0;position:relative;z-index:2;min-width:0}
    .career-v3-kicker{display:inline-flex;align-items:center;gap:10px;font-size:.76rem;font-weight:900;letter-spacing:.18em;color:#a8202e;margin-bottom:18px}
    .career-v3-kicker::before{content:'';width:32px;height:2px;background:#a8202e}
    .career-v3-copy h2{margin:0 0 22px;max-width:670px;font-size:clamp(2.55rem,4.3vw,4.8rem);line-height:.98;letter-spacing:-.052em;font-weight:900;color:#121522}
    .career-v3-copy h2 span{color:#a8202e;display:block}
    .career-v3-copy>p{max-width:620px;margin:0;color:#4b5260;font-size:clamp(1rem,1.35vw,1.12rem);line-height:1.75;font-weight:500}
    .career-v3-copy .career-v3-note{margin-top:16px;color:#171b25;font-size:.9rem;font-weight:750}

    .career-v3-owl-zone{min-height:400px;display:flex;align-items:flex-end;justify-content:center;position:relative}
    .career-v3-owl-stage{width:min(335px,100%);height:395px;position:relative}
    .career-v3-owl{position:absolute;inset:auto 0 0;width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 18px 18px rgba(29,28,24,.1))}

    .career-v3-media-block{margin-top:2px;border-top:1px solid #e7e8ec;padding-top:0}
    .career-v3-topic-strip{min-height:66px;display:flex;align-items:center;justify-content:center;gap:10px;padding:0 14px;background:#fafafa;border-bottom:1px solid #ececf0;overflow:hidden}
    .career-v3-topic{flex:0 0 auto;font-size:.65rem;font-weight:900;letter-spacing:.105em;color:#10131b;white-space:nowrap}
    .career-v3-link{width:clamp(28px,4.2vw,62px);height:12px;display:flex;align-items:center;position:relative;flex:0 1 62px;min-width:26px}
    .career-v3-link::before{content:'';height:1.5px;width:100%;background:#b32636;display:block}
    .career-v3-link b{position:absolute;right:-1px;width:6px;height:6px;border-radius:50%;background:#b32636}

    .career-v3-carousel{position:relative;overflow:hidden;padding:18px 0 2px;background:#fff;mask-image:linear-gradient(90deg,transparent 0,#000 4%,#000 96%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 4%,#000 96%,transparent 100%)}
    .career-v3-track{display:flex;width:max-content;gap:14px;animation:careerV3Marquee 36s linear infinite;will-change:transform}
    .career-v3-carousel:hover .career-v3-track{animation-play-state:paused}
    .career-v3-photo{margin:0;width:clamp(230px,24vw,330px);height:190px;border-radius:16px;overflow:hidden;background:#ececef;flex:0 0 auto;box-shadow:0 8px 23px rgba(13,18,28,.08)}
    .career-v3-photo img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .45s ease}
    .career-v3-photo:hover img{transform:scale(1.025)}
    @keyframes careerV3Marquee{from{transform:translateX(0)}to{transform:translateX(calc(-50% - 7px))}}

    /* Mantener visible la sección negra de agenda/calendario que ya existía debajo. */
    #telecalendar.home-agenda{display:block!important;opacity:1!important;transform:none!important;visibility:visible!important;background:#0b0e17!important;color:#fff!important}

    @media(max-width:1040px){
      .career-v3-top{grid-template-columns:minmax(0,1.08fr) minmax(280px,.92fr);gap:28px}
      .career-v3-copy h2{font-size:clamp(2.45rem,5vw,4.2rem)}
      .career-v3-owl-stage{width:min(300px,100%);height:360px}
      .career-v3-topic-strip{justify-content:flex-start;overflow-x:auto;scrollbar-width:none}
      .career-v3-topic-strip::-webkit-scrollbar{display:none}
    }
    @media(max-width:820px){
      .career-v3{padding:58px 0 50px!important}
      .career-v3-top{grid-template-columns:1fr;gap:2px;min-height:0}
      .career-v3-copy{padding:8px 0 4px;max-width:none}
      .career-v3-owl-zone{min-height:305px;justify-content:center}
      .career-v3-owl-stage{height:315px;width:min(275px,72vw)}
      .career-v3-media-block{margin-top:8px}
      .career-v3-photo{height:175px;width:min(285px,70vw)}
    }
    @media(max-width:560px){
      .career-v3{padding:44px 0 38px!important}
      .career-v3-copy h2{font-size:clamp(2.35rem,12vw,3.3rem)}
      .career-v3-copy>p{font-size:.96rem;line-height:1.66}
      .career-v3-owl-zone{min-height:260px}
      .career-v3-owl-stage{height:270px;width:min(245px,78vw)}
      .career-v3-topic-strip{min-height:58px;padding:0 12px;gap:8px}
      .career-v3-topic{font-size:.59rem;letter-spacing:.085em}
      .career-v3-link{min-width:26px;width:30px}
      .career-v3-carousel{padding-top:14px}
      .career-v3-photo{height:160px;width:245px;border-radius:14px}
      .career-v3-track{gap:11px;animation-duration:32s}
    }
    @media(prefers-reduced-motion:reduce){
      .career-v3-track{animation:none}
      .career-v3-carousel{overflow-x:auto;mask-image:none;-webkit-mask-image:none}
    }
  `;

  function injectStyles(){
    if (document.getElementById('careerV3Styles')) return;
    const style = document.createElement('style');
    style.id = 'careerV3Styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function buildTopicStrip(){
    return TOPICS.map((topic,index) => {
      const connector = index < TOPICS.length - 1 ? '<i class="career-v3-link" aria-hidden="true"><b></b></i>' : '';
      return `<span class="career-v3-topic">${topic}</span>${connector}`;
    }).join('');
  }

  function buildGalleryTrack(){
    const items = GALLERY.map((src,index) => `<figure class="career-v3-photo"><img src="${src}" alt="Actividad y comunidad del CCT-UNI ${index + 1}" loading="lazy"></figure>`).join('');
    return `${items}${items}`;
  }

  function initCareerV3(){
    injectStyles();
    const section = document.getElementById('conoce');
    if (!section || section.dataset.careerV3 === 'ready') return;

    section.dataset.careerV3 = 'ready';
    section.className = 'career-story career-v3 cct-reveal is-visible';
    section.innerHTML = `
      <div class="container career-v3-shell">
        <div class="career-v3-top">
          <div class="career-v3-copy">
            <span class="career-v3-kicker">CONOCE TU CARRERA</span>
            <h2>Ingeniería de <span>Telecomunicaciones</span></h2>
            <p>Conectamos personas, ciudades y sistemas. En Telecomunicaciones aprendes a diseñar y gestionar las redes que transportan voz, datos y video: desde fibra óptica y redes IP hasta comunicaciones móviles, radio y satélites.</p>
            <p class="career-v3-note">Lo que parece invisible es la infraestructura que mantiene al mundo conectado.</p>
          </div>

          <div class="career-v3-owl-zone" aria-label="Mascota CCT">
            <div class="career-v3-owl-stage">
              <img class="career-v3-owl" src="assets/owl-book.png" alt="Búho del CCT con uniforme institucional y un libro">
            </div>
          </div>
        </div>

        <div class="career-v3-media-block">
          <div class="career-v3-topic-strip" aria-label="Áreas de las telecomunicaciones">${buildTopicStrip()}</div>
          <div class="career-v3-carousel" aria-label="Galería de actividades del CCT-UNI">
            <div class="career-v3-track">${buildGalleryTrack()}</div>
          </div>
        </div>
      </div>`;

    const calendar = document.getElementById('telecalendar');
    if (calendar) calendar.classList.add('is-visible');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCareerV3);
  else initCareerV3();
})();

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
    'FIBRA ÓPTICA',
    'REDES',
    'CIBERSEGURIDAD',
    '5G',
    'INALÁMBRICO',
    'RADIOFRECUENCIA',
    'SATÉLITES'
  ];

  const CSS = `
    .career-v3{background:#fff!important;color:#121522!important;padding:82px 0 70px!important;overflow:hidden;position:relative}
    .career-v3::before{content:'';position:absolute;inset:0 0 auto;height:1px;background:linear-gradient(90deg,transparent,rgba(168,32,46,.16),transparent)}
    .career-v3 .career-v3-shell{position:relative;z-index:1}

    .career-v3-top{
      display:grid;
      grid-template-columns:minmax(0,1.18fr) minmax(320px,.82fr);
      align-items:center;
      gap:48px;
      min-height:430px;
    }
    .career-v3-copy{max-width:680px;padding:26px 28px 30px 0;position:relative;z-index:3;min-width:0}
    .career-v3-kicker{display:inline-flex;align-items:center;gap:10px;font-size:.76rem;font-weight:900;letter-spacing:.18em;color:#a8202e;margin-bottom:18px}
    .career-v3-kicker::before{content:'';width:32px;height:2px;background:#a8202e}
    .career-v3-copy h2{margin:0 0 22px;max-width:660px;font-size:clamp(2.55rem,4.35vw,4.9rem);line-height:.98;letter-spacing:-.052em;font-weight:900;color:#121522;overflow-wrap:normal;word-break:normal}
    .career-v3-copy h2 span{color:#a8202e;display:block}
    .career-v3-copy>p{max-width:620px;margin:0;color:#4b5260;font-size:clamp(1rem,1.35vw,1.12rem);line-height:1.75;font-weight:500}
    .career-v3-copy .career-v3-note{margin-top:16px;color:#171b25;font-size:.9rem;font-weight:750;letter-spacing:.01em}

    .career-v3-owl-zone{min-height:410px;display:flex;align-items:flex-end;justify-content:center;position:relative;isolation:isolate;z-index:1}
    .career-v3-owl-zone::before{content:'';position:absolute;width:310px;height:310px;border-radius:50%;background:radial-gradient(circle,rgba(168,32,46,.085),rgba(168,32,46,0) 70%);bottom:30px;z-index:-1}
    .career-v3-owl-zone::after{content:'';position:absolute;width:225px;height:22px;border-radius:50%;background:rgba(24,25,32,.09);filter:blur(11px);bottom:11px;z-index:-1}
    .career-v3-owl-stage{width:min(330px,100%);height:405px;position:relative;transform:none!important;transition:none!important}
    .career-v3-owl{position:absolute;inset:auto 0 0;width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 17px 17px rgba(29,28,24,.11));transition:opacity .22s ease}
    .career-v3-owl-calm{opacity:1}
    .career-v3-owl-wave{opacity:0}
    .career-v3-owl-stage.is-waving .career-v3-owl-calm{opacity:0}
    .career-v3-owl-stage.is-waving .career-v3-owl-wave{opacity:1;animation:careerV3Wave .55s ease-in-out 2 alternate}

    /* Ojos realmente animados: el cuerpo no sigue al cursor, solo las pupilas. */
    .career-v3-eyes{position:absolute;inset:0;pointer-events:none;z-index:5;opacity:1;transition:opacity .12s ease}
    .career-v3-owl-stage.is-waving .career-v3-eyes{opacity:0}
    .career-v3-eye{position:absolute;top:20.5%;width:56px;height:56px;border-radius:50%;pointer-events:none}
    .career-v3-eye.left{left:32.8%}
    .career-v3-eye.right{left:50.8%}
    .career-v3-iris{
      --eye-x:0px;--eye-y:0px;
      position:absolute;left:50%;top:50%;width:23px;height:23px;border-radius:50%;
      transform:translate(calc(-50% + var(--eye-x)),calc(-50% + var(--eye-y)));
      transition:transform .07s linear;
      background:radial-gradient(circle at 50% 50%,#090909 0 33%,#1b1209 34% 38%,#d88712 39% 69%,#9f4d06 70% 100%);
      box-shadow:0 0 0 1px rgba(70,35,4,.25),inset 0 0 5px rgba(255,209,89,.6);
    }
    .career-v3-iris::after{content:'';position:absolute;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.92);left:5px;top:4px;box-shadow:0 0 2px rgba(255,255,255,.8)}

    @keyframes careerV3Wave{
      from{transform:rotate(-.5deg) scale(1)}
      to{transform:rotate(.8deg) scale(1.006)}
    }

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

    @media(max-width:1040px){
      .career-v3-top{grid-template-columns:minmax(0,1.1fr) minmax(280px,.9fr);gap:28px}
      .career-v3-copy h2{font-size:clamp(2.45rem,5vw,4.25rem)}
      .career-v3-owl-stage{width:min(300px,100%);height:370px}
      .career-v3-eye{top:20.6%;width:51px;height:51px}
      .career-v3-iris{width:21px;height:21px}
      .career-v3-topic-strip{justify-content:flex-start;overflow-x:auto;scrollbar-width:none}
      .career-v3-topic-strip::-webkit-scrollbar{display:none}
    }
    @media(max-width:820px){
      .career-v3{padding:58px 0 50px!important}
      .career-v3-top{grid-template-columns:1fr;gap:2px;min-height:0}
      .career-v3-copy{padding:8px 0 4px;max-width:none}
      .career-v3-copy h2{max-width:680px}
      .career-v3-owl-zone{min-height:315px;justify-content:center}
      .career-v3-owl-stage{height:325px;width:min(285px,72vw)}
      .career-v3-media-block{margin-top:8px}
      .career-v3-photo{height:175px;width:min(285px,70vw)}
    }
    @media(max-width:560px){
      .career-v3{padding:44px 0 38px!important}
      .career-v3-copy h2{font-size:clamp(2.35rem,12vw,3.3rem)}
      .career-v3-copy>p{font-size:.96rem;line-height:1.66}
      .career-v3-owl-zone{min-height:265px}
      .career-v3-owl-stage{height:275px;width:min(250px,78vw)}
      .career-v3-eye{top:20.6%;width:43px;height:43px}
      .career-v3-iris{width:18px;height:18px}
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
      .career-v3-iris{transition:none}
      .career-v3-owl-wave{animation:none!important}
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
            <div class="career-v3-owl-stage" id="careerOwlStage">
              <img class="career-v3-owl career-v3-owl-calm" src="assets/owl-front.webp" alt="Búho del CCT con uniforme institucional">
              <img class="career-v3-owl career-v3-owl-wave" src="assets/owl-guide.webp" alt="Búho del CCT saludando">
              <div class="career-v3-eyes" aria-hidden="true">
                <span class="career-v3-eye left"><i class="career-v3-iris"></i></span>
                <span class="career-v3-eye right"><i class="career-v3-iris"></i></span>
              </div>
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

    initOwlMotion(section);
  }

  function initOwlMotion(section){
    const stage = section.querySelector('#careerOwlStage');
    const irises = Array.from(section.querySelectorAll('.career-v3-iris'));
    if (!stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let waveTimer;
    let raf = 0;

    const wave = () => {
      stage.classList.add('is-waving');
      clearTimeout(waveTimer);
      waveTimer = setTimeout(() => stage.classList.remove('is-waving'), 1500);
    };

    const resetEyes = () => {
      irises.forEach(iris => {
        iris.style.setProperty('--eye-x','0px');
        iris.style.setProperty('--eye-y','0px');
      });
    };

    if (!reduceMotion){
      setTimeout(wave, 1800);
      setInterval(() => { if (!document.hidden) wave(); }, 8200);

      section.addEventListener('pointermove', event => {
        if (stage.classList.contains('is-waving')) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = stage.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height * .24;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const distance = Math.hypot(dx,dy) || 1;
          const maxMove = Math.max(4.5,Math.min(7,rect.width * .021));
          const strength = Math.min(1,distance / 180);
          const ox = (dx / distance) * maxMove * strength;
          const oy = (dy / distance) * maxMove * strength;
          irises.forEach(iris => {
            iris.style.setProperty('--eye-x',`${ox.toFixed(1)}px`);
            iris.style.setProperty('--eye-y',`${oy.toFixed(1)}px`);
          });
        });
      }, { passive:true });

      section.addEventListener('pointerleave', resetEyes);
    } else {
      resetEyes();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCareerV3);
  else initCareerV3();
})();

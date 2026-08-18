(() => {
  const GALLERY = [
    'assets/event-auditorium.webp',
    'assets/event-community-group.webp',
    'assets/telecom-day-2023.webp',
    'assets/certificates-cct.webp',
    'assets/event-osiptel-stage.webp',
    'assets/visit-network-operations.webp'
  ];

  const TOPICS = ['FIBRA ÓPTICA', 'REDES', 'INALÁMBRICO', 'SATÉLITES'];

  const CSS = `
    .career-v3{background:#fff!important;color:#121522!important;padding:88px 0 76px!important;overflow:hidden;position:relative}
    .career-v3::before{content:'';position:absolute;inset:0 0 auto;height:1px;background:linear-gradient(90deg,transparent,rgba(168,32,46,.16),transparent)}
    .career-v3 .career-v3-shell{position:relative;z-index:1}
    .career-v3-top{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(300px,.92fr);align-items:center;gap:54px;min-height:470px}
    .career-v3-copy{max-width:720px;padding:30px 0 34px}
    .career-v3-kicker{display:inline-flex;align-items:center;gap:10px;font-size:.76rem;font-weight:900;letter-spacing:.18em;color:#a8202e;margin-bottom:18px}
    .career-v3-kicker::before{content:'';width:32px;height:2px;background:#a8202e}
    .career-v3-copy h2{margin:0 0 24px;font-size:clamp(2.7rem,5.1vw,5.65rem);line-height:.96;letter-spacing:-.055em;font-weight:900;color:#121522}
    .career-v3-copy h2 span{color:#a8202e}
    .career-v3-copy>p{max-width:650px;margin:0;color:#4b5260;font-size:clamp(1rem,1.45vw,1.16rem);line-height:1.78;font-weight:500}
    .career-v3-copy .career-v3-note{margin-top:17px;color:#171b25;font-size:.9rem;font-weight:750;letter-spacing:.01em}
    .career-v3-owl-zone{min-height:430px;display:flex;align-items:flex-end;justify-content:center;position:relative;isolation:isolate}
    .career-v3-owl-zone::before{content:'';position:absolute;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(168,32,46,.09),rgba(168,32,46,0) 69%);bottom:30px;z-index:-1}
    .career-v3-owl-zone::after{content:'';position:absolute;width:250px;height:25px;border-radius:50%;background:rgba(24,25,32,.1);filter:blur(11px);bottom:12px;z-index:-1}
    .career-v3-owl-stage{--owl-x:0px;--owl-y:0px;--owl-r:0deg;width:min(390px,100%);height:430px;position:relative;transform:translate3d(var(--owl-x),var(--owl-y),0) rotate(var(--owl-r));transform-origin:50% 85%;transition:transform .22s ease-out}
    .career-v3-owl{position:absolute;inset:auto 0 0;width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 18px 18px rgba(29,28,24,.12));transition:opacity .34s ease,transform .42s cubic-bezier(.2,.8,.2,1)}
    .career-v3-owl-wave{opacity:0;transform:translateY(5px) scale(.985)}
    .career-v3-owl-calm{opacity:1;transform:translateY(0) scale(1)}
    .career-v3-owl-stage.is-waving .career-v3-owl-calm{opacity:0;transform:translateY(4px) scale(.99)}
    .career-v3-owl-stage.is-waving .career-v3-owl-wave{opacity:1;transform:translateY(0) scale(1)}
    .career-v3-media-block{margin-top:6px;border-top:1px solid #e7e8ec;padding-top:0}
    .career-v3-topic-strip{min-height:72px;display:flex;align-items:center;justify-content:center;gap:16px;padding:0 18px;background:#fafafa;border-bottom:1px solid #ececf0;overflow:hidden}
    .career-v3-topic{flex:0 0 auto;font-size:.71rem;font-weight:900;letter-spacing:.13em;color:#10131b;white-space:nowrap}
    .career-v3-link{width:clamp(58px,8vw,118px);height:12px;display:flex;align-items:center;position:relative;flex:0 1 118px}
    .career-v3-link::before{content:'';height:1.5px;width:100%;background:#b32636;display:block}
    .career-v3-link b{position:absolute;right:-1px;width:7px;height:7px;border-radius:50%;background:#b32636}
    .career-v3-carousel{position:relative;overflow:hidden;padding:24px 0 4px;background:#fff;mask-image:linear-gradient(90deg,transparent 0,#000 5%,#000 95%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 5%,#000 95%,transparent 100%)}
    .career-v3-track{display:flex;width:max-content;gap:18px;animation:careerV3Marquee 44s linear infinite;will-change:transform}
    .career-v3-carousel:hover .career-v3-track{animation-play-state:paused}
    .career-v3-photo{margin:0;width:clamp(260px,29vw,390px);height:230px;border-radius:18px;overflow:hidden;background:#ececef;flex:0 0 auto;box-shadow:0 9px 28px rgba(13,18,28,.09)}
    .career-v3-photo img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .5s ease}
    .career-v3-photo:hover img{transform:scale(1.025)}
    @keyframes careerV3Marquee{from{transform:translateX(0)}to{transform:translateX(calc(-50% - 9px))}}
    @media(max-width:900px){
      .career-v3{padding:62px 0 54px!important}
      .career-v3-top{grid-template-columns:1fr;gap:6px;min-height:0}
      .career-v3-copy{padding:10px 0 10px}
      .career-v3-copy h2{max-width:680px}
      .career-v3-owl-zone{min-height:330px;justify-content:center}
      .career-v3-owl-stage{height:340px;width:min(330px,78vw)}
      .career-v3-media-block{margin-top:12px}
      .career-v3-topic-strip{justify-content:flex-start;overflow-x:auto;scrollbar-width:none}
      .career-v3-topic-strip::-webkit-scrollbar{display:none}
      .career-v3-link{min-width:54px}
      .career-v3-photo{height:205px;width:min(330px,76vw)}
    }
    @media(max-width:560px){
      .career-v3{padding:48px 0 42px!important}
      .career-v3-copy h2{font-size:clamp(2.4rem,13vw,3.6rem)}
      .career-v3-copy>p{font-size:.98rem;line-height:1.68}
      .career-v3-owl-zone{min-height:280px}
      .career-v3-owl-stage{height:290px;width:min(282px,82vw)}
      .career-v3-topic-strip{min-height:62px;padding:0 14px;gap:11px}
      .career-v3-topic{font-size:.63rem;letter-spacing:.1em}
      .career-v3-link{min-width:42px;width:46px}
      .career-v3-carousel{padding-top:17px}
      .career-v3-photo{height:185px;width:280px;border-radius:15px}
      .career-v3-track{gap:12px}
    }
    @media(prefers-reduced-motion:reduce){
      .career-v3-track{animation:none}
      .career-v3-carousel{overflow-x:auto;mask-image:none;-webkit-mask-image:none}
      .career-v3-owl-stage{transition:none}
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
    if (!stage) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let waveTimer;

    const wave = () => {
      stage.classList.add('is-waving');
      clearTimeout(waveTimer);
      waveTimer = setTimeout(() => stage.classList.remove('is-waving'), 1650);
    };

    if (!reduceMotion){
      setTimeout(wave, 1200);
      setInterval(() => { if (!document.hidden) wave(); }, 7600);

      section.addEventListener('pointermove', event => {
        const rect = section.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / Math.max(rect.width,1) - .5) * 2;
        const ny = ((event.clientY - rect.top) / Math.max(rect.height,1) - .5) * 2;
        stage.style.setProperty('--owl-x', `${(nx * 12).toFixed(1)}px`);
        stage.style.setProperty('--owl-y', `${(ny * 7).toFixed(1)}px`);
        stage.style.setProperty('--owl-r', `${(nx * 1.35).toFixed(2)}deg`);
      }, { passive:true });

      section.addEventListener('pointerleave', () => {
        stage.style.setProperty('--owl-x','0px');
        stage.style.setProperty('--owl-y','0px');
        stage.style.setProperty('--owl-r','0deg');
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCareerV3);
  else initCareerV3();
})();

(() => {
  const GALLERY = [
    'assets/cct-career-gallery-01.webp',
    'assets/cct-career-gallery-02.webp',
    'assets/cct-career-gallery-03.webp',
    'assets/cct-career-gallery-04.webp',
    'assets/cct-career-gallery-05.webp',
    'assets/cct-career-gallery-06.webp'
  ];

  const TOPICS = ['FIBRA ÓPTICA', 'REDES', 'INALÁMBRICO', 'SATÉLITES'];

  function buildTopicStrip() {
    return TOPICS.map((topic, index) => {
      const connector = index < TOPICS.length - 1
        ? '<i class="career-v3-link" aria-hidden="true"><b></b></i>'
        : '';
      return `<span class="career-v3-topic">${topic}</span>${connector}`;
    }).join('');
  }

  function buildGalleryTrack() {
    const items = GALLERY.map((src, index) => (
      `<figure class="career-v3-photo"><img src="${src}" alt="Actividad y comunidad del CCT-UNI ${index + 1}" loading="lazy"></figure>`
    )).join('');
    return `${items}${items}`;
  }

  function initCareerV3() {
    const section = document.getElementById('conoce');
    if (!section || section.dataset.careerV3 === 'ready') return;

    section.dataset.careerV3 = 'ready';
    section.classList.add('career-v3');
    section.innerHTML = `
      <div class="container career-v3-shell">
        <div class="career-v3-top">
          <div class="career-v3-copy">
            <span class="career-v3-kicker">CONOCE TU CARRERA</span>
            <h2>Ingeniería de <span>Telecomunicaciones</span></h2>
            <p>
              Conectamos personas, ciudades y sistemas. En Telecomunicaciones aprendes a diseñar y gestionar
              las redes que transportan voz, datos y video: desde fibra óptica y redes IP hasta comunicaciones
              móviles, radio y satélites.
            </p>
            <p class="career-v3-note">Lo que parece invisible es la infraestructura que mantiene al mundo conectado.</p>
          </div>

          <div class="career-v3-owl-zone" aria-label="Mascota CCT">
            <div class="career-v3-owl-stage" id="careerOwlStage">
              <img class="career-v3-owl career-v3-owl-calm" src="assets/cct-owl-calm.webp" alt="Búho del CCT con uniforme institucional">
              <img class="career-v3-owl career-v3-owl-wave" src="assets/cct-owl-wave.webp" alt="Búho del CCT saludando">
            </div>
          </div>
        </div>

        <div class="career-v3-media-block">
          <div class="career-v3-topic-strip" aria-label="Áreas de las telecomunicaciones">
            ${buildTopicStrip()}
          </div>

          <div class="career-v3-carousel" aria-label="Galería de actividades del CCT-UNI">
            <div class="career-v3-track">
              ${buildGalleryTrack()}
            </div>
          </div>
        </div>
      </div>
    `;

    initOwlMotion(section);
  }

  function initOwlMotion(section) {
    const stage = section.querySelector('#careerOwlStage');
    if (!stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let waveTimer = null;
    let waveInterval = null;

    const wave = () => {
      stage.classList.add('is-waving');
      window.clearTimeout(waveTimer);
      waveTimer = window.setTimeout(() => stage.classList.remove('is-waving'), 1650);
    };

    if (!reduceMotion) {
      window.setTimeout(wave, 1400);
      waveInterval = window.setInterval(wave, 7600);

      section.addEventListener('pointermove', (event) => {
        const rect = section.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
        const ny = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
        stage.style.setProperty('--owl-x', `${(nx * 12).toFixed(1)}px`);
        stage.style.setProperty('--owl-y', `${(ny * 7).toFixed(1)}px`);
        stage.style.setProperty('--owl-r', `${(nx * 1.35).toFixed(2)}deg`);
      }, { passive: true });

      section.addEventListener('pointerleave', () => {
        stage.style.setProperty('--owl-x', '0px');
        stage.style.setProperty('--owl-y', '0px');
        stage.style.setProperty('--owl-r', '0deg');
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (!waveInterval || document.hidden) stage.classList.remove('is-waving');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCareerV3);
  } else {
    initCareerV3();
  }
})();

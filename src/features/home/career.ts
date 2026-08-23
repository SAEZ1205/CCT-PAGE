const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

type CareerItem = {
  src: string;
  title: string;
  eyebrow: string;
  desc: string;
};

const GALLERY: CareerItem[] = [
  { src: asset('career-fibra-optica.svg'), title: 'Fibra Óptica', eyebrow: 'TRANSPORTE', desc: 'Datos a gran velocidad por enlaces de luz.' },
  { src: asset('career-redes.svg'), title: 'Redes', eyebrow: 'CONECTIVIDAD', desc: 'Infraestructura IP que conecta personas y servicios.' },
  { src: asset('career-5g.svg'), title: '5G', eyebrow: 'MÓVILES', desc: 'Nuevas generaciones de conectividad inalámbrica.' },
  { src: asset('career-ciberseguridad.svg'), title: 'Ciberseguridad', eyebrow: 'SEGURIDAD', desc: 'Protección de redes, datos y servicios críticos.' },
  { src: asset('career-inalambrico.svg'), title: 'Inalámbrico', eyebrow: 'RADIO', desc: 'Comunicación sin cables para entornos reales.' },
  { src: asset('career-radiofrecuencia.svg'), title: 'Radiofrecuencia', eyebrow: 'SEÑALES', desc: 'Ondas, espectro y diseño de enlaces.' },
  { src: asset('career-satelites.svg'), title: 'Satélites', eyebrow: 'ESPACIO', desc: 'Cobertura y comunicación más allá del territorio.' },
];

const TOPICS = ['FIBRA ÓPTICA', 'REDES', 'CIBERSEGURIDAD', '5G', 'INALÁMBRICO', 'RADIOFRECUENCIA', 'SATÉLITES'];

function buildTopicStrip() {
  return TOPICS.map((topic, index) =>
    `<span class="career-v3-topic">${topic}</span>${index < TOPICS.length - 1 ? '<i class="career-v3-link" aria-hidden="true"><b></b></i>' : ''}`,
  ).join('');
}

function buildGalleryTrack() {
  const items = GALLERY.map((item) =>
    `<figure class="career-v3-photo"><img src="${item.src}" alt="${item.title}" loading="lazy"><figcaption><small>${item.eyebrow}</small><strong>${item.title}</strong><span>${item.desc}</span></figcaption></figure>`,
  ).join('');
  return `${items}${items}`;
}

export function initCareerExperience() {
  const section = document.getElementById('conoce');
  if (!section || section.dataset.careerOwner === 'typescript') return;

  section.dataset.careerOwner = 'typescript';
  section.dataset.careerV3 = 'ready';
  section.className = 'career-story career-v3 cct-reveal is-visible';
  section.innerHTML = `<div class="container career-v3-shell"><div class="career-v3-top"><div class="career-v3-copy"><span class="career-v3-kicker">CONOCE TU CARRERA</span><h2>Ingeniería de <span>Telecomunicaciones</span></h2><p>Conectamos personas, ciudades y sistemas. En Telecomunicaciones aprendes a diseñar y gestionar las redes que transportan voz, datos y video: desde fibra óptica y redes IP hasta comunicaciones móviles, radio y satélites.</p><p class="career-v3-note">Lo que parece invisible es la infraestructura que mantiene al mundo conectado.</p></div><div class="career-v3-owl-zone" aria-label="Mascota CCT"><div class="career-v3-owl-stage"><img class="career-v3-owl" src="${asset('owl-book.webp')}" alt="Búho del CCT con uniforme institucional y un libro"></div></div></div><div class="career-v3-media-block"><div class="career-v3-topic-strip">${buildTopicStrip()}</div><div class="career-v3-carousel"><div class="career-v3-track">${buildGalleryTrack()}</div></div></div></div>`;

  document.getElementById('telecalendar')?.classList.add('is-visible');
}

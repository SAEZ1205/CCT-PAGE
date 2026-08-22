const earthImage = new URL('../../../assets/formation-earth.webp', import.meta.url).href;
const ccnaItn = new URL('../../../assets/ccna_itn.png', import.meta.url).href;
const ccnaSrwe = new URL('../../../assets/ccna_srwe.png', import.meta.url).href;
const ccnaEnsa = new URL('../../../assets/ccna_ensa.png', import.meta.url).href;
const fortinet = new URL('../../../assets/fortinet_fcp.png', import.meta.url).href;
const ccnp = new URL('../../../assets/ccnp_security.png', import.meta.url).href;

const academies = [
  { id:'ccna1', n:'01', provider:'CISCO', title:'CCNA 1 · ITN', desc:'Fundamentos de redes y direccionamiento.', img:ccnaItn, open:true },
  { id:'ccna2', n:'02', provider:'CISCO', title:'CCNA 2 · SRWE', desc:'Switching, routing y redes inalámbricas.', img:ccnaSrwe, open:true },
  { id:'ccna3', n:'03', provider:'CISCO', title:'CCNA 3 · ENSA', desc:'Redes empresariales, seguridad y automatización.', img:ccnaEnsa, open:false },
  { id:'fortinet', n:'04', provider:'FORTINET', title:'FCP Secure Networking', desc:'Operación y defensa de redes.', img:fortinet, open:true },
  { id:'ccnp', n:'05', provider:'CISCO', title:'CCNP Security', desc:'Ruta profesional de seguridad.', img:ccnp, open:false },
] as const;

type Academy = (typeof academies)[number];

function academyCard(item: Academy) {
  return `<article class="cert-v4-card" data-academy="${item.id}" tabindex="0">
    <span class="cert-v4-num">${item.n}</span>
    <div class="cert-v4-img"><img src="${item.img}" alt="${item.title}"></div>
    <span class="cert-v4-provider">${item.provider}</span>
    <h3>${item.title}</h3>
    <p>${item.desc}</p>
    <div class="cert-v4-foot">
      <span class="cert-v4-status ${item.open ? 'open' : 'closed'}"><i></i>${item.open ? 'Abierta' : 'Cerrada'}</span>
      <button class="cert-v4-btn ${item.open ? '' : 'closed'}" type="button">${item.open ? 'Inscribirme' : 'Cerrada'}</button>
    </div>
  </article>`;
}

function openAcademyModal(item: Academy) {
  let modal = document.getElementById('academyV4Modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'academyV4Modal';
    modal.className = 'academy-v4-modal';
    modal.innerHTML = '<div class="academy-v4-box"><button class="academy-v4-close" type="button">×</button><div class="academy-v4-content"></div></div>';
    document.body.appendChild(modal);
    modal.querySelector<HTMLButtonElement>('.academy-v4-close')?.addEventListener('click', () => modal?.classList.remove('open'));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal?.classList.remove('open');
    });
  }

  const content = modal.querySelector<HTMLElement>('.academy-v4-content');
  if (!content) return;

  if (!item.open) {
    content.innerHTML = `<small>${item.provider}</small><h3>${item.title}</h3><p>Las inscripciones están cerradas por ahora.</p>`;
  } else {
    content.innerHTML = `<small>INSCRIPCIÓN SIMULADA · ${item.provider}</small>
      <h3>${item.title}</h3>
      <p>Formulario de demostración.</p>
      <form class="academy-v4-form">
        <div class="academy-v4-field full"><label>Nombre completo</label><input required placeholder="Nombre y apellidos"></div>
        <div class="academy-v4-field"><label>DNI</label><input required maxlength="8" inputmode="numeric" placeholder="8 dígitos"></div>
        <div class="academy-v4-field"><label>Celular</label><input required placeholder="999 999 999"></div>
        <div class="academy-v4-field full"><label>Correo</label><input type="email" required placeholder="correo@ejemplo.com"></div>
        <button class="academy-v4-submit">Simular inscripción</button>
        <div class="academy-v4-ok">✓ Registro simulado correctamente.</div>
      </form>`;

    content.querySelector<HTMLFormElement>('form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      content.querySelector<HTMLElement>('.academy-v4-ok')?.classList.add('show');
    });
  }

  modal.classList.add('open');
}

function renderHero(view: HTMLElement) {
  const hero = view.querySelector<HTMLElement>('.formation-hero-content');
  if (!hero) return;
  hero.innerHTML = `<section class="formation-earth-v4">
    <img src="${earthImage}" alt="Tierra y satélites">
    <div class="formation-earth-copy">
      <small>CCT · FIEE UNI</small>
      <h1>ACADEMIA <span>CCT</span></h1>
      <p>Certificaciones, rutas técnicas y aprendizaje aplicado para crecer dentro y fuera del aula.</p>
    </div>
  </section>`;
}

function renderAcademies(view: HTMLElement) {
  const container = view.querySelector<HTMLElement>('.certification-orbit .container');
  if (!container) return;
  const cards = academies.map(academyCard).join('');
  container.innerHTML = `<div class="cert-v4-head"><div>
      <span class="v2-kicker">ACADEMIAS</span>
      <h2>Certificaciones que <span>mueven tu carrera.</span></h2>
      <p>Verde: abierta · Rojo: cerrada.</p>
    </div></div>
    <div class="cert-v4-window"><div class="cert-v4-track">${cards}${cards}</div></div>
    <p class="cert-v4-note">Pasa el mouse para pausar. Selecciona una certificación para abrir el formulario.</p>`;

  container.querySelectorAll<HTMLElement>('.cert-v4-card').forEach((card) => {
    const item = academies.find((academy) => academy.id === card.dataset.academy);
    if (!item) return;
    const open = () => openAcademyModal(item);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
}

export function initFormation() {
  const view = document.getElementById('view-formacion');
  if (!view || view.dataset.cctOwner === 'react-formacion') return;
  view.dataset.cctOwner = 'react-formacion';
  renderHero(view);
  renderAcademies(view);
  // Open Course NO se toca aquí. Su único dueño es openCourse.ts.
}

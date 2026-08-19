const supportImage = new URL('../../../assets/course-support.webp', import.meta.url).href;
const networkLabImage = new URL('../../../assets/course-network-lab.webp', import.meta.url).href;
const wirelessImage = new URL('../../../assets/course-wireless.webp', import.meta.url).href;

const RAW_ASSET_BASE = 'https://raw.githubusercontent.com/SAEZ1205/CCT-PAGE/main/cct-site-main/assets/';

const COURSES = [
  {
    id: 'cybersecurity',
    level: 'PRINCIPIANTE',
    title: 'Analista Junior en Ciberseguridad',
    description: 'Amenazas, endpoints y fundamentos de seguridad.',
    hours: '120 h',
    image: supportImage,
    fallback: `${RAW_ASSET_BASE}course-support.webp`,
  },
  {
    id: 'defense',
    level: 'INTERMEDIO',
    title: 'Cybersecurity Defense Analyst',
    description: 'Monitoreo, análisis y respuesta a incidentes SOC.',
    hours: '30 h',
    image: networkLabImage,
    fallback: `${RAW_ASSET_BASE}course-network-lab.webp`,
  },
  {
    id: 'ethical-hacking',
    level: 'INTERMEDIO',
    title: 'Hacker Ético',
    description: 'Evaluación responsable de vulnerabilidades.',
    hours: '70 h',
    image: wirelessImage,
    fallback: `${RAW_ASSET_BASE}course-wireless.webp`,
  },
];

const CSS = `
#view-formacion .open-course-v3-section{
  background:#0b0e17!important;
  color:#fff!important;
  padding:54px 0 62px!important;
}
#view-formacion .open-course-v3-section .v2-kicker{
  color:#d52b3d!important;
}
#view-formacion .open-course-v3-section .open-course-heading h2{
  color:#fff!important;
}
#view-formacion .open-course-v3-section .open-course-heading h2 span,
#view-formacion .open-course-v3-section .open-course-heading h2 .oc-blue{
  color:#18b7f1!important;
}
#view-formacion .open-course-v3-section .open-course-heading p{
  color:rgba(255,255,255,.58)!important;
}
#view-formacion .open-course-grid{
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:18px!important;
  margin-top:26px!important;
}
#view-formacion .oc-react-card{
  min-width:0;
  background:#121824;
  border:1px solid rgba(255,255,255,.12);
  border-radius:18px;
  overflow:hidden;
  color:#fff;
  text-decoration:none;
  display:flex;
  flex-direction:column;
  transition:transform .24s ease,border-color .24s ease,box-shadow .24s ease;
}
#view-formacion .oc-react-card:hover{
  transform:translateY(-4px);
  border-color:rgba(24,183,241,.6);
  box-shadow:0 18px 38px rgba(0,0,0,.22);
}
#view-formacion .oc-react-media{
  height:245px;
  background:#0e1420;
  overflow:hidden;
  position:relative;
}
#view-formacion .oc-react-media img{
  width:100%!important;
  height:100%!important;
  display:block!important;
  opacity:1!important;
  visibility:visible!important;
  object-fit:cover!important;
  object-position:center 30%!important;
}
#view-formacion .oc-react-level{
  position:absolute;
  z-index:2;
  left:14px;
  top:14px;
  padding:7px 10px;
  border-radius:8px;
  background:#d52b3d;
  color:#fff;
  font-size:.55rem;
  font-weight:900;
  letter-spacing:.05em;
}
#view-formacion .oc-react-body{
  padding:17px 17px 18px;
  display:flex;
  flex-direction:column;
  min-height:165px;
}
#view-formacion .oc-react-body>small{
  color:#d52b3d!important;
  font-size:.56rem;
  font-weight:900;
  letter-spacing:.1em;
}
#view-formacion .oc-react-body h3{
  margin:7px 0 6px;
  color:#fff!important;
  font-size:1.02rem;
  line-height:1.2;
}
#view-formacion .oc-react-body p{
  margin:0;
  color:rgba(255,255,255,.66)!important;
  font-size:.72rem;
  line-height:1.5;
  flex:1;
}
#view-formacion .oc-react-meta{
  margin-top:13px;
  color:#b9dff0!important;
  font-size:.64rem;
  font-weight:700;
}
@media(max-width:850px){
  #view-formacion .open-course-grid{grid-template-columns:1fr 1fr!important}
}
@media(max-width:600px){
  #view-formacion .open-course-grid{grid-template-columns:1fr!important}
  #view-formacion .oc-react-media{height:270px}
}
`;

let observer: MutationObserver | null = null;
let retryTimer: number | null = null;
let retries = 0;

function installStyles() {
  let style = document.getElementById('openCourseReactStyles') as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'openCourseReactStyles';
    document.head.appendChild(style);
  }
  style.textContent = CSS;
}

function mountOpenCourse(): boolean {
  installStyles();

  const grid = document.querySelector<HTMLElement>('#view-formacion .open-course-grid');
  if (!grid) return false;

  const section = grid.closest('section');
  section?.classList.add('open-course-v3-section');

  const heading = section?.querySelector<HTMLElement>('.open-course-heading');
  const kicker = heading?.querySelector<HTMLElement>('.v2-kicker');
  const title = heading?.querySelector<HTMLElement>('h2');

  if (kicker) kicker.textContent = 'OPEN COURSE CCT';
  if (title) title.innerHTML = 'Elige una ruta. <span class="oc-blue" style="color:#18b7f1!important">Aprende por módulos.</span>';

  const alreadyMounted = grid.dataset.openCourseReact === 'ready' && Boolean(grid.querySelector('.oc-react-card'));
  if (alreadyMounted) return true;

  grid.dataset.openCourseReact = 'ready';
  grid.innerHTML = COURSES.map((course) => `
    <a class="oc-react-card" href="course.html?course=${course.id}" target="_blank" rel="noopener">
      <div class="oc-react-media">
        <img
          src="${course.image}"
          data-fallback="${course.fallback}"
          alt="${course.title}"
          loading="eager"
          decoding="async"
        >
        <span class="oc-react-level">${course.level}</span>
      </div>
      <div class="oc-react-body">
        <small>OPEN COURSE CCT</small>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="oc-react-meta">◷ ${course.hours} · Abrir aula ↗</div>
      </div>
    </a>
  `).join('');

  grid.querySelectorAll<HTMLImageElement>('.oc-react-media img').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.src !== fallback) {
        console.warn('[CCT] Falló asset Vite; usando fallback GitHub:', img.src);
        img.src = fallback;
      }
    }, { once: true });
  });

  return true;
}

export function initOpenCourseFormation() {
  mountOpenCourse();
}

export function startOpenCourseGuard() {
  installStyles();

  const ensure = () => {
    const grid = document.querySelector<HTMLElement>('#view-formacion .open-course-grid');
    if (!grid) return;
    if (!grid.querySelector('.oc-react-card') || grid.dataset.openCourseReact !== 'ready') {
      grid.dataset.openCourseReact = '';
      mountOpenCourse();
    } else {
      const title = grid.closest('section')?.querySelector<HTMLElement>('.open-course-heading h2');
      if (title && !title.querySelector('.oc-blue')) {
        title.innerHTML = 'Elige una ruta. <span class="oc-blue" style="color:#18b7f1!important">Aprende por módulos.</span>';
      }
    }
  };

  if (!observer) {
    observer = new MutationObserver(() => queueMicrotask(ensure));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (retryTimer !== null) window.clearInterval(retryTimer);
  retries = 0;
  retryTimer = window.setInterval(() => {
    ensure();
    retries += 1;
    if (retries >= 30 && retryTimer !== null) {
      window.clearInterval(retryTimer);
      retryTimer = null;
    }
  }, 250);

  window.addEventListener('hashchange', () => window.setTimeout(ensure, 50));
  ensure();
}

const supportImage = new URL('../../../assets/course-support.webp', import.meta.url).href;
const networkLabImage = new URL('../../../assets/course-network-lab.webp', import.meta.url).href;
const wirelessImage = new URL('../../../assets/course-wireless.webp', import.meta.url).href;

const COURSES = [
  { id:'cybersecurity', level:'PRINCIPIANTE', title:'Analista Junior en Ciberseguridad', description:'Amenazas, endpoints y fundamentos de seguridad.', hours:'120 h', image:supportImage, focus:'center 34%' },
  { id:'defense', level:'INTERMEDIO', title:'Cybersecurity Defense Analyst', description:'Monitoreo, análisis y respuesta a incidentes SOC.', hours:'30 h', image:networkLabImage, focus:'center 30%' },
  { id:'ethical-hacking', level:'INTERMEDIO', title:'Hacker Ético', description:'Evaluación responsable de vulnerabilidades.', hours:'70 h', image:wirelessImage, focus:'center 28%' },
];

export function initOpenCourseFormation(){
  const grid=document.querySelector<HTMLElement>('#view-formacion .open-course-grid');
  if(!grid || grid.dataset.openCourseReact === 'ready') return;

  const section=grid.closest('section');
  section?.classList.add('open-course-v3-section');

  const heading=section?.querySelector<HTMLElement>('.open-course-heading');
  const kicker=heading?.querySelector<HTMLElement>('.v2-kicker');
  const title=heading?.querySelector<HTMLElement>('h2');
  if(kicker) kicker.textContent='OPEN COURSE CCT';
  if(title) title.innerHTML='ELIGE TU RUTA. <span class="oc-blue">Aprende por módulos.</span>';

  grid.dataset.openCourseReact='ready';
  grid.innerHTML=COURSES.map(course=>`<a class="oc-react-card" href="course.html?course=${course.id}" target="_blank" rel="noopener"><div class="oc-react-media"><img src="${course.image}" alt="${course.title}" loading="eager" decoding="async" style="object-position:${course.focus}"><span class="oc-react-level">${course.level}</span></div><div class="oc-react-body"><small>OPEN COURSE CCT</small><h3>${course.title}</h3><p>${course.description}</p><div class="oc-react-meta">◷ ${course.hours} · Abrir aula ↗</div></div></a>`).join('');
}

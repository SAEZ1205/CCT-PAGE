import { createRoot, Root } from 'react-dom/client';
import supportImage from '../../../assets/course-support.webp';
import networkLabImage from '../../../assets/course-network-lab.webp';
import wirelessImage from '../../../assets/course-wireless.webp';
import './openCourse.css';

const courses = [
  {
    id: 'cybersecurity',
    level: 'PRINCIPIANTE',
    title: 'Analista Junior en Ciberseguridad',
    description: 'Amenazas, endpoints y fundamentos de seguridad.',
    hours: '120 h',
    image: supportImage,
  },
  {
    id: 'defense',
    level: 'INTERMEDIO',
    title: 'Cybersecurity Defense Analyst',
    description: 'Monitoreo, análisis y respuesta a incidentes SOC.',
    hours: '30 h',
    image: networkLabImage,
  },
  {
    id: 'ethical-hacking',
    level: 'INTERMEDIO',
    title: 'Hacker Ético',
    description: 'Evaluación responsable de vulnerabilidades.',
    hours: '70 h',
    image: wirelessImage,
  },
];

let root: Root | null = null;

function Grid() {
  return <>{courses.map((course) => (
    <a key={course.id} className="oc-card tw-relative" href="#formacion">
      <div className="oc-media">
        <img src={course.image} alt={course.title} loading="eager" />
        <span className="oc-level">{course.level}</span>
      </div>
      <div className="oc-body">
        <small>OPEN COURSE CCT</small>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="oc-meta">◷ {course.hours} · Abrir aula ↗</div>
      </div>
    </a>
  ))}</>;
}

export function mountOpenCourse() {
  const grid = document.querySelector<HTMLElement>('#view-formacion .open-course-grid');
  if (!grid) return;

  const section = grid.closest('section');
  section?.classList.add('open-course-v3-section');

  const heading = section?.querySelector('.open-course-heading');
  const kicker = heading?.querySelector('.v2-kicker');
  const title = heading?.querySelector('h2');

  if (kicker) kicker.textContent = 'OPEN COURSE CCT';
  if (title) {
    title.innerHTML = '<span class="oc-white">Elige una ruta.</span> <span class="oc-blue">Aprende por módulos.</span>';
  }

  if (!root) root = createRoot(grid);
  root.render(<Grid />);
}

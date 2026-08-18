import { createRoot, Root } from 'react-dom/client';
import './openCourse.css';

const asset=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`;
const courses=[
{id:'cybersecurity',level:'PRINCIPIANTE',title:'Analista Junior en Ciberseguridad',description:'Amenazas, endpoints y fundamentos de seguridad.',hours:'120 h',image:'course-support.webp'},
{id:'defense',level:'INTERMEDIO',title:'Cybersecurity Defense Analyst',description:'Monitoreo, análisis y respuesta a incidentes SOC.',hours:'30 h',image:'course-network-lab.webp'},
{id:'ethical-hacking',level:'INTERMEDIO',title:'Hacker Ético',description:'Evaluación responsable de vulnerabilidades.',hours:'70 h',image:'course-wireless.webp'}
];
let root:Root|null=null;
function Grid(){return <>{courses.map(c=><a key={c.id} className="oc-card tw-relative" href={`#formacion`}><div className="oc-media"><img src={asset(c.image)} alt={c.title}/><span className="oc-level">{c.level}</span></div><div className="oc-body"><small>OPEN COURSE CCT</small><h3>{c.title}</h3><p>{c.description}</p><div className="oc-meta">◷ {c.hours} · Abrir aula ↗</div></div></a>)}</>}
export function mountOpenCourse(){const grid=document.querySelector<HTMLElement>('#view-formacion .open-course-grid');if(!grid)return;const section=grid.closest('section');section?.classList.add('open-course-v3-section');const heading=section?.querySelector('.open-course-heading');const kicker=heading?.querySelector('.v2-kicker');const title=heading?.querySelector('h2');if(kicker)kicker.textContent='OPEN COURSE CCT';if(title)title.innerHTML='Elige una ruta. <span>Aprende por módulos.</span>';if(!root)root=createRoot(grid);root.render(<Grid/>);}

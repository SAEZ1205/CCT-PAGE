const COURSE_CATALOG = {
  cybersecurity: {
    title: 'Analista Junior en Ciberseguridad', level: 'Principiante', duration: '120 horas', provider: 'CCT Learning Lab',
    modules: [
      ['Panorama de la ciberseguridad','Amenazas, actores y principios de protección.'],
      ['Fundamentos de redes','Tráfico, protocolos y puntos de exposición.'],
      ['Sistemas y endpoints','Controles básicos en estaciones y servidores.'],
      ['Gestión de vulnerabilidades','Identificación, priorización y remediación.'],
      ['Seguridad de acceso','Identidades, privilegios y autenticación.'],
      ['Monitoreo inicial','Logs, indicadores y alertas.'],
      ['Respuesta a incidentes','Contención, recuperación y aprendizaje.'],
      ['Proyecto integrador','Diseña una defensa básica documentada.']
    ]
  },
  defense: {
    title: 'Cybersecurity Defense Analyst', level: 'Intermedio', duration: '30 horas', provider: 'CCT Learning Lab',
    modules: [
      ['Operaciones de un SOC','Roles, procesos y flujo de una alerta.'],
      ['Telemetría y registros','Fuentes de datos para observar una red.'],
      ['Detección de amenazas','Indicadores, reglas y anomalías.'],
      ['Triage de incidentes','Validación, severidad y prioridades.'],
      ['Respuesta coordinada','Contención y comunicación efectiva.'],
      ['Caso final SOC','Investiga una secuencia de eventos simulada.']
    ]
  },
  'ethical-hacking': {
    title: 'Hacker Ético', level: 'Intermedio', duration: '70 horas', provider: 'CCT Learning Lab',
    modules: [
      ['Ética, alcance y autorización','Reglas para evaluar seguridad responsablemente.'],
      ['Reconocimiento','Superficie de ataque y recopilación de información.'],
      ['Enumeración de servicios','Puertos, versiones y exposición.'],
      ['Análisis de vulnerabilidades','Validación sin causar daño.'],
      ['Seguridad web','Errores frecuentes y controles preventivos.'],
      ['Reporte técnico','Evidencia, riesgo y recomendaciones.'],
      ['Evaluación final','Construye un informe profesional de hallazgos.']
    ]
  }
};

const params = new URLSearchParams(location.search);
const courseKey = COURSE_CATALOG[params.get('course')] ? params.get('course') : 'cybersecurity';
const course = COURSE_CATALOG[courseKey];
let activeModule = 0;
const progressKey = `cct_course_progress_${courseKey}`;
let completed = new Set(JSON.parse(localStorage.getItem(progressKey) || '[]'));

const $ = (selector) => document.querySelector(selector);
const moduleNav = $('#moduleNav');
const lessonContent = $('#lessonContent');

function renderModuleNav(query = ''){
  const normalized = query.trim().toLowerCase();
  const rows = course.modules.map((module, index) => ({module,index})).filter(({module}) => !normalized || module.join(' ').toLowerCase().includes(normalized));
  moduleNav.innerHTML = rows.length ? rows.map(({module,index}) => `
    <button class="module-button ${index === activeModule ? 'active' : ''} ${completed.has(index) ? 'complete' : ''}" data-module="${index}" type="button">
      <span class="module-number">${String(index + 1).padStart(2,'0')}</span><div><strong>${module[0]}</strong><small>${index === course.modules.length - 1 ? 'Proyecto / evaluación' : 'Lección guiada'}</small></div><span class="module-state">${completed.has(index) ? '✓' : '›'}</span>
    </button>`).join('') : '<p class="empty-search">No encontramos un módulo con ese nombre.</p>';
  moduleNav.querySelectorAll('[data-module]').forEach((button) => button.addEventListener('click', () => selectModule(Number(button.dataset.module))));
}

function renderLesson(){
  const [title,description] = course.modules[activeModule];
  const topics = [
    ['Conceptos esenciales',`Comprende el vocabulario y las decisiones principales de ${title.toLowerCase()}.`],
    ['Aplicación guiada','Sigue un escenario corto para conectar la teoría con una situación real.'],
    ['Comprobación','Responde preguntas de control y registra lo que necesitas reforzar.']
  ];
  lessonContent.innerHTML = `
    <span class="lesson-kicker">MÓDULO ${String(activeModule + 1).padStart(2,'0')} · ${course.provider}</span>
    <h1>${title}</h1><p class="lesson-lead">${description} Esta vista funciona como la estructura del aula: contenido, recursos y evaluaciones podrán conectarse después a la plataforma que use el CCT.</p>
    <div class="lesson-meta"><span>${course.level}</span><span>${course.duration} en total</span><span>${course.modules.length} módulos</span></div>
    <div class="objective-panel"><div class="objective-card"><span>OBJETIVO</span><h2>Qué aprenderás</h2><p>Reconocer conceptos, tomar decisiones y explicar el proceso con claridad técnica.</p></div><div class="objective-card"><span>EVIDENCIA</span><h2>Qué vas a producir</h2><p>Una práctica corta o entregable que demuestre lo aprendido en este módulo.</p></div></div>
    <div class="topic-list">${topics.map((topic,index) => `<div class="topic-row"><span>${activeModule + 1}.${index + 1}</span><div><h3>${topic[0]}</h3><p>${topic[1]}</p></div><b>${index === 2 ? 'CONTROL' : 'LECCIÓN'}</b></div>`).join('')}</div>
    <div class="lesson-note"><strong>Prototipo funcional:</strong> el avance se guarda localmente en el navegador. Los videos, evaluaciones y archivos reales pueden añadirse sin cambiar esta interfaz.</div>`;
  $('#breadcrumbModule').textContent = `Módulo ${activeModule + 1}: ${title}`;
  $('#prevModule').disabled = activeModule === 0;
  $('#nextModule').disabled = activeModule === course.modules.length - 1;
  $('#completeModule').classList.toggle('done', completed.has(activeModule));
  $('#completeModule').textContent = completed.has(activeModule) ? 'Módulo completado ✓' : 'Marcar como completado ✓';
}

function renderProgress(){
  const percent = Math.round((completed.size / course.modules.length) * 100);
  $('#progressLabel').textContent = `${percent}%`;
  $('#progressBar').style.width = `${percent}%`;
}

function selectModule(index){
  activeModule = Math.max(0,Math.min(index,course.modules.length - 1));
  renderModuleNav($('#moduleSearch').value);
  renderLesson();
  window.scrollTo({top:0,behavior:'smooth'});
  if (innerWidth <= 820) $('#moduleSidebar').classList.remove('open');
}

function toggleComplete(){
  if (completed.has(activeModule)) completed.delete(activeModule); else completed.add(activeModule);
  localStorage.setItem(progressKey,JSON.stringify([...completed]));
  renderModuleNav($('#moduleSearch').value); renderLesson(); renderProgress();
}

document.title = `${course.title} | Open Course CCT`;
$('#headerCourseName').textContent = course.title;
$('#moduleSearch').addEventListener('input',(event) => renderModuleNav(event.target.value));
$('#prevModule').addEventListener('click',() => selectModule(activeModule - 1));
$('#nextModule').addEventListener('click',() => selectModule(activeModule + 1));
$('#completeModule').addEventListener('click',toggleComplete);
$('#sidebarToggle').addEventListener('click',() => $('#moduleSidebar').classList.toggle('open'));
$('#themeToggle').addEventListener('click',() => document.body.classList.toggle('high-contrast'));
renderModuleNav(); renderLesson(); renderProgress();

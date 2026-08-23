import { useEffect } from 'react';
import { beforeMainMarkup, footerMarkup, afterMainMarkup } from './layout/markup';
import { inicioMarkup } from './pages/inicio';
import { nosotrosMarkup } from './pages/nosotros';
import { formacionMarkup } from './pages/formacion';
import { comunidadMarkup } from './pages/comunidad';
import { eventosMarkup } from './pages/eventos';
import { telconMarkup } from './pages/telcon';
import { recursosMarkup } from './pages/recursos';
import { bootLegacyRuntime } from './legacy/runtime';
import { initCareerExperience } from './features/home/career';
import { initHomeCalendar } from './features/home/calendar';
import { initNosotros } from './features/nosotros/nosotros';
import { initFormation } from './features/formation/formation';
import { initOpenCourseFormation } from './features/formation/openCourse';
import { initCommunity } from './features/community/community';
import { initEvents } from './features/events/events';
import { initKeyboardAccessibility, initRevealMotion } from './features/shared/ui';

const viewsMarkup = [
  inicioMarkup,
  nosotrosMarkup,
  formacionMarkup,
  comunidadMarkup,
  eventosMarkup,
  telconMarkup,
  recursosMarkup,
].join('\n');

const appMarkup = `
${beforeMainMarkup}
<main id="appMain" class="app-main" role="main">
${viewsMarkup}
${footerMarkup}
</main>
${afterMainMarkup}
`;

const featureInitializers = [
  ['Inicio · Conoce tu carrera', initCareerExperience],
  ['Inicio · Calendario', initHomeCalendar],
  ['Nosotros', initNosotros],
  ['Formación', initFormation],
  ['Open Course', initOpenCourseFormation],
  ['Comunidad', initCommunity],
  ['Eventos', initEvents],
] as const;

function initFeaturesSafely() {
  featureInitializers.forEach(([name, init]) => {
    try {
      init();
    } catch (error) {
      console.error(`[CCT] La sección ${name} no pudo inicializarse:`, error);
    }
  });

  try {
    initRevealMotion();
    initKeyboardAccessibility();
  } catch (error) {
    console.error('[CCT] No pudieron inicializarse los comportamientos compartidos:', error);
  }
}

export default function App() {
  useEffect(() => {
    void bootLegacyRuntime()
      .then(initFeaturesSafely)
      .catch((error) => {
        console.error('[CCT] Falló el arranque del runtime base:', error);
        initFeaturesSafely();
      });
  }, []);

  return <div className="cct-react-shell" dangerouslySetInnerHTML={{ __html: appMarkup }} />;
}

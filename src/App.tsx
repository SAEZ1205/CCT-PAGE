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
import { initOpenCourseFormation } from './features/formation/openCourse';

const viewsMarkup = [
  inicioMarkup,
  nosotrosMarkup,
  formacionMarkup,
  comunidadMarkup,
  eventosMarkup,
  telconMarkup,
  recursosMarkup
].join('\n');

const appMarkup = `
${beforeMainMarkup}
<main id="appMain" class="app-main" role="main">
${viewsMarkup}
${footerMarkup}
</main>
${afterMainMarkup}
`;

export default function App() {
  useEffect(() => {
    // Primero se estabiliza el DOM histórico; después React/TS monta Open Course.
    // Así ninguna capa posterior vuelve a sobrescribir las tarjetas.
    void bootLegacyRuntime().then(() => {
      initOpenCourseFormation();
    });
  }, []);

  return <div className="cct-react-shell" dangerouslySetInnerHTML={{ __html: appMarkup }} />;
}

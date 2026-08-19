import { initNavigation } from './navigation';
import { initRevealMotion } from './reveal';
import { initInicio } from '../inicio/init';
import { initNosotros } from '../nosotros/init';
import { initFormation } from '../formation/init';

type Initializer = () => void;

function safeInit(name: string, initializer: Initializer) {
  try {
    initializer();
  } catch (error) {
    console.error(`[CCT] No se pudo inicializar ${name}:`, error);
  }
}

export function initSite() {
  safeInit('navegación', initNavigation);
  safeInit('inicio', initInicio);
  safeInit('nosotros', initNosotros);
  safeInit('formación', initFormation);

  // La visibilidad nunca debe depender de que otra sección cargue bien.
  safeInit('reveal', initRevealMotion);

  document.querySelectorAll<HTMLElement>('.cct-reveal').forEach((node) => {
    node.classList.add('is-visible');
  });

  const activeView = document.querySelector<HTMLElement>('.view[data-view].active');
  if (!activeView) {
    document.querySelector<HTMLElement>('.view[data-view="inicio"]')?.classList.add('active');
  }
}

import { initNavigation } from './navigation';
import { initRevealMotion } from './reveal';
import { initInicio } from '../inicio/init';
import { initNosotros } from '../nosotros/init';
import { initFormation } from '../formation/init';

export function initSite(){
  initNavigation();
  initInicio();
  initNosotros();
  initFormation();
  initRevealMotion();
}

import { useEffect } from 'react';
import { headerMarkup, footerMarkup } from './layout/markup';
import { inicioMarkup } from './pages/inicio';
import { nosotrosMarkup } from './pages/nosotros';
import { formacionMarkup } from './pages/formacion';
import { comunidadMarkup } from './pages/comunidad';
import { eventosMarkup } from './pages/eventos';
import { telconMarkup } from './pages/telcon';
import { recursosMarkup } from './pages/recursos';
import { initSite } from './features/site/init';

const views=[inicioMarkup,nosotrosMarkup,formacionMarkup,comunidadMarkup,eventosMarkup,telconMarkup,recursosMarkup].join('\n');
const markup=`${headerMarkup}<main id="appMain" class="app-main" role="main">${views}${footerMarkup}</main>`;

export default function App(){useEffect(()=>{initSite()},[]);return <div className="cct-react-shell tw-min-h-screen" dangerouslySetInnerHTML={{__html:markup}}/>}

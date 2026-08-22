(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}?v=20260822-board`, BASE).href;

  const CSS = `
    #view-nosotros .about-photo-main{min-height:390px!important;overflow:hidden!important;background:#10141f!important;border-radius:24px!important;position:relative!important}
    #view-nosotros .about-photo-main>img{display:none!important}
    #view-nosotros .board-collage{position:absolute;inset:0;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(2,1fr);gap:2px;background:#111827}
    #view-nosotros .board-collage img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center 18%!important;display:block!important;filter:none!important;transform:scale(1.01)}
    #view-nosotros .board-collage img:nth-child(2n){object-position:center 22%!important}
    #view-nosotros .about-photo-main::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(0deg,rgba(6,9,15,.5),transparent 42%)}
    #view-nosotros .about-photo-main span{position:absolute!important;z-index:2!important;left:22px!important;bottom:18px!important;color:#fff!important}
    #view-nosotros .about-hero .inner-hero-content{max-width:1000px!important;padding-top:clamp(100px,12vh,155px)!important;padding-bottom:clamp(92px,12vh,145px)!important}
    #view-nosotros .about-hero .inner-hero-content .v2-kicker{color:#00caff!important;font-size:.72rem!important;letter-spacing:.19em!important;font-weight:900!important}
    #view-nosotros .about-hero .inner-hero-content .v2-kicker::before{background:#00caff!important}
    html body #view-nosotros section.about-hero .container.inner-hero-content>h1{margin:18px 0 20px!important;max-width:1000px!important;font-size:clamp(5.2rem,10.5vw,10.4rem)!important;line-height:.84!important;letter-spacing:-.065em!important;color:#fff!important;-webkit-text-fill-color:#fff!important;background:none!important;font-weight:900!important;text-transform:uppercase!important}
    #view-nosotros .about-hero .inner-hero-content p{max-width:720px!important;color:rgba(255,255,255,.82)!important;font-size:clamp(1rem,1.35vw,1.18rem)!important;line-height:1.65!important}
    #view-nosotros .about-hero .inner-hero-content p strong{color:#d52b3d!important;font-weight:900!important}
    #view-nosotros .about-story-copy .v2-kicker{color:#b82034!important}
    #view-nosotros .about-story-copy .v2-kicker::before{background:#b82034!important}
    #view-nosotros .about-story-copy h3{max-width:700px!important}
    #view-nosotros .about-story-copy h3 .nosotros-red,#view-nosotros .about-story-copy p strong{color:#b82034!important}
    @media(max-width:720px){#view-nosotros .about-photo-main{min-height:280px!important}#view-nosotros .board-collage{grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(2,1fr)}html body #view-nosotros section.about-hero .container.inner-hero-content>h1{font-size:clamp(4rem,18vw,6.4rem)!important}}
  `;

  function init(){
    let style=document.getElementById('nosotrosStableStyles');
    if(!style){style=document.createElement('style');style.id='nosotrosStableStyles';document.head.appendChild(style)}
    style.textContent=CSS;
    const view=document.getElementById('view-nosotros'); if(!view) return;
    const hero=view.querySelector('.about-hero .inner-hero-content');
    if(hero){
      const kicker=hero.querySelector('.v2-kicker'); const title=hero.querySelector('h1'); const desc=hero.querySelector('p');
      if(kicker) kicker.textContent='CCT · FIEE UNI';
      if(title) title.textContent='NOSOTROS';
      if(desc) desc.innerHTML='Una comunidad estudiantil que convierte las telecomunicaciones en <strong>aprendizaje, proyectos y oportunidades.</strong>';
    }
    const photoWrap=view.querySelector('.about-photo-main');
    if(photoWrap && !photoWrap.querySelector('.board-collage')){
      const collage=document.createElement('div');
      collage.className='board-collage';
      const people=['alexandra.png','andy.png','eliane.png','fernando.png','johann.png','jorge.png','juan.png','kevin.png','maria.png','patrick.png'];
      collage.innerHTML=people.map((name,i)=>`<img src="${asset(`team/${name}`)}" alt="Integrante ${i+1} de la Junta Directiva CCT" loading="eager" decoding="async">`).join('');
      photoWrap.prepend(collage);
    }
    const label=view.querySelector('.about-photo-main span'); if(label) label.textContent='Junta Directiva CCT · FIEE UNI';
    const story=view.querySelector('.about-story-copy');
    if(story){
      const kicker=story.querySelector('.v2-kicker'); const title=story.querySelector('h3'); const text=story.querySelector('p');
      if(kicker) kicker.textContent='JUNTA DIRECTIVA';
      if(title) title.innerHTML='El CCT se mueve porque hay <span class="nosotros-red">un equipo detrás.</span>';
      if(text) text.innerHTML='La Junta Directiva organiza y conecta las áreas que hacen posible el CCT: <strong>formación, eventos, difusión, proyectos y comunidad.</strong> Distintas responsabilidades, una misma meta: abrir más oportunidades para los estudiantes de Telecomunicaciones.';
    }
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

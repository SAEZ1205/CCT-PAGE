(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}`, BASE).href;

  const CSS = `
    #view-nosotros .about-photo-main{
      min-height:360px!important;
      overflow:hidden!important;
      background:#f3f4f6!important;
      border-radius:24px!important;
    }
    #view-nosotros .about-photo-main img{
      width:100%!important;height:100%!important;min-height:360px!important;
      object-fit:cover!important;object-position:center 45%!important;
      display:block!important;opacity:1!important;visibility:visible!important;
    }
    #view-nosotros .about-story-copy h3 .nosotros-red{color:#b82034!important}
    #view-nosotros .about-story-copy p strong{color:#b82034!important;font-weight:800}
    #view-nosotros .about-hero .inner-hero-content h1,
    #view-nosotros .about-hero .inner-hero-content h1 span{color:#b82034!important}
    @media(max-width:720px){
      #view-nosotros .about-photo-main,#view-nosotros .about-photo-main img{min-height:250px!important}
    }
  `;

  function init(){
    if(!document.getElementById('nosotrosV3Styles')){
      const style=document.createElement('style');
      style.id='nosotrosV3Styles'; style.textContent=CSS; document.head.appendChild(style);
    }
    const view=document.getElementById('view-nosotros');
    if(!view) return;

    const photo=view.querySelector('.about-photo-main img');
    if(photo){
      photo.src=asset('nosotros-equipo-v3.webp');
      photo.alt='Equipo del Centro Cultural de Telecomunicaciones CCT UNI';
    }

    const story=view.querySelector('.about-story-copy');
    if(story){
      const kicker=story.querySelector('.v2-kicker');
      const title=story.querySelector('h3');
      const text=story.querySelector('p');
      if(kicker) kicker.textContent='NUESTRA HISTORIA';
      if(title) title.innerHTML='Una comunidad que <span class="nosotros-red">crece compartiendo.</span>';
      if(text) text.innerHTML='El CCT acompaña la formación universitaria fuera del aula. <strong>Academias, eventos y proyectos</strong> reúnen a estudiantes de distintas generaciones para aprender, asumir retos reales y construir una comunidad que deja camino para quienes vienen después.';
    }
  }
  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();
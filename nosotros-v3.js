(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}?v=20260822b`, BASE).href;

  const CSS = `
    #view-nosotros .about-photo-main{
      min-height:360px!important;
      overflow:hidden!important;
      background:#f3f4f6!important;
      border-radius:24px!important;
    }
    #view-nosotros .about-photo-main img{
      width:100%!important;height:100%!important;min-height:360px!important;
      object-fit:cover!important;object-position:center 48%!important;
      display:block!important;opacity:1!important;visibility:visible!important;
    }

    #view-nosotros .about-hero .inner-hero-content{
      max-width:980px!important;
      padding-top:clamp(96px,12vh,150px)!important;
      padding-bottom:clamp(90px,12vh,140px)!important;
    }
    #view-nosotros .about-hero .inner-hero-content .v2-kicker{
      color:#00caff!important;
      font-size:.72rem!important;
      letter-spacing:.18em!important;
      font-weight:900!important;
    }
    #view-nosotros .about-hero .inner-hero-content .v2-kicker::before{
      background:#00caff!important;
    }
    #view-nosotros .about-hero .inner-hero-content h1{
      margin:18px 0 18px!important;
      max-width:980px!important;
      font-size:clamp(5rem,10vw,10rem)!important;
      line-height:.82!important;
      letter-spacing:-.065em!important;
      color:#fff!important;
      font-weight:900!important;
      text-transform:uppercase!important;
    }
    #view-nosotros .about-hero .inner-hero-content h1 span{
      color:#00caff!important;
    }
    #view-nosotros .about-hero .inner-hero-content h1::after{
      content:' · CCT';
      color:#00caff;
      font-size:.28em;
      letter-spacing:.015em;
      vertical-align:middle;
      margin-left:10px;
      white-space:nowrap;
    }
    #view-nosotros .about-hero .inner-hero-content p{
      max-width:700px!important;
      color:rgba(255,255,255,.82)!important;
      font-size:clamp(1rem,1.35vw,1.18rem)!important;
      line-height:1.65!important;
    }
    #view-nosotros .about-hero .inner-hero-content p strong{
      color:#00caff!important;
    }
    #view-nosotros .about-hero .inner-hero-scroll{
      color:#fff!important;
      border-color:rgba(255,255,255,.35)!important;
    }

    #view-nosotros .about-story-copy h3{max-width:650px!important}
    #view-nosotros .about-story-copy h3 .nosotros-red{color:#b82034!important}
    #view-nosotros .about-story-copy p strong{color:#b82034!important;font-weight:850}
    #view-nosotros .about-story-copy .v2-kicker{color:#b82034!important}
    #view-nosotros .about-story-copy .v2-kicker::before{background:#b82034!important}

    @media(max-width:720px){
      #view-nosotros .about-photo-main,#view-nosotros .about-photo-main img{min-height:250px!important}
      #view-nosotros .about-hero .inner-hero-content{padding-top:90px!important;padding-bottom:80px!important}
      #view-nosotros .about-hero .inner-hero-content h1{font-size:clamp(4rem,18vw,6.4rem)!important}
      #view-nosotros .about-hero .inner-hero-content h1::after{display:block;margin:14px 0 0;font-size:.22em}
    }
  `;

  function init(){
    if(!document.getElementById('nosotrosV4Styles')){
      const style=document.createElement('style');
      style.id='nosotrosV4Styles';
      style.textContent=CSS;
      document.head.appendChild(style);
    }
    const view=document.getElementById('view-nosotros');
    if(!view) return;

    const hero=view.querySelector('.about-hero .inner-hero-content');
    if(hero){
      const kicker=hero.querySelector('.v2-kicker');
      const title=hero.querySelector('h1');
      const desc=hero.querySelector('p');
      if(kicker) kicker.textContent='CCT · FIEE UNI';
      if(title) title.innerHTML='NOSOTROS';
      if(desc) desc.innerHTML='Una comunidad estudiantil que convierte las telecomunicaciones en <strong>aprendizaje, proyectos y oportunidades.</strong>';
    }

    const photo=view.querySelector('.about-photo-main img');
    if(photo){
      photo.src=asset('equipo-cct-2026.webp');
      photo.alt='Equipo del Centro Cultural de Telecomunicaciones CCT UNI';
    }
    const label=view.querySelector('.about-photo-main span');
    if(label) label.textContent='Equipo CCT · FIEE UNI';

    const story=view.querySelector('.about-story-copy');
    if(story){
      const kicker=story.querySelector('.v2-kicker');
      const title=story.querySelector('h3');
      const text=story.querySelector('p');
      if(kicker) kicker.textContent='NUESTRA HISTORIA';
      if(title) title.innerHTML='La carrera también se construye <span class="nosotros-red">en comunidad.</span>';
      if(text) text.innerHTML='El CCT conecta a estudiantes de distintas generaciones para que la formación no termine en el aula. <strong>Academias, eventos, proyectos y experiencias compartidas</strong> convierten el conocimiento en algo que circula, crece y queda para quienes vienen después.';
    }
  }

  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();
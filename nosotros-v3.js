(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}?v=20260822g`, BASE).href;

  const CSS = `
    #view-nosotros .about-photo-main{
      min-height:360px!important;
      overflow:hidden!important;
      background-color:#111520!important;
      background-size:cover!important;
      background-position:center 48%!important;
      background-repeat:no-repeat!important;
      border-radius:24px!important;
    }
    #view-nosotros .about-photo-main img{
      width:100%!important;height:100%!important;min-height:360px!important;
      object-fit:cover!important;object-position:center 48%!important;
      display:block!important;opacity:1!important;visibility:visible!important;
      image-rendering:auto!important;
      position:absolute!important;inset:0!important;z-index:0!important;
    }
    #view-nosotros .about-photo-main::after{
      content:''!important;
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      pointer-events:none!important;
      background:linear-gradient(0deg,rgba(7,9,14,.52) 0%,rgba(7,9,14,0) 38%)!important;
    }
    #view-nosotros .about-photo-main span{z-index:2!important}

    #view-nosotros .about-hero .inner-hero-content{
      max-width:1000px!important;
      padding-top:clamp(100px,12vh,155px)!important;
      padding-bottom:clamp(92px,12vh,145px)!important;
    }
    #view-nosotros .about-hero .inner-hero-content .v2-kicker{
      color:#00caff!important;
      font-size:.72rem!important;
      letter-spacing:.19em!important;
      font-weight:900!important;
    }
    #view-nosotros .about-hero .inner-hero-content .v2-kicker::before{background:#00caff!important}
    html body #view-nosotros section.about-hero .container.inner-hero-content > h1{
      margin:18px 0 20px!important;
      max-width:1000px!important;
      font-size:clamp(5.2rem,10.5vw,10.4rem)!important;
      line-height:.84!important;
      letter-spacing:-.065em!important;
      color:#fff!important;
      -webkit-text-fill-color:#fff!important;
      background:none!important;
      background-image:none!important;
      font-weight:900!important;
      text-transform:uppercase!important;
    }
    html body #view-nosotros section.about-hero .container.inner-hero-content > h1::after{content:''!important;display:none!important}
    #view-nosotros .about-hero .inner-hero-content p{
      max-width:720px!important;
      color:rgba(255,255,255,.82)!important;
      font-size:clamp(1rem,1.35vw,1.18rem)!important;
      line-height:1.65!important;
    }
    #view-nosotros .about-hero .inner-hero-content p strong{color:#d52b3d!important;font-weight:900!important}
    #view-nosotros .about-hero .inner-hero-scroll{color:#fff!important;border-color:rgba(255,255,255,.38)!important}

    #view-nosotros .about-story-copy h3{max-width:650px!important}
    #view-nosotros .about-story-copy h3 .nosotros-red{color:#b82034!important}
    #view-nosotros .about-story-copy p strong{color:#b82034!important;font-weight:850}
    #view-nosotros .about-story-copy .v2-kicker{color:#b82034!important}
    #view-nosotros .about-story-copy .v2-kicker::before{background:#b82034!important}

    @media(max-width:720px){
      #view-nosotros .about-photo-main,#view-nosotros .about-photo-main img{min-height:250px!important}
      #view-nosotros .about-hero .inner-hero-content{padding-top:90px!important;padding-bottom:80px!important}
      html body #view-nosotros section.about-hero .container.inner-hero-content > h1{font-size:clamp(4rem,18vw,6.4rem)!important}
    }
  `;

  function init(){
    let style=document.getElementById('nosotrosV4Styles');
    if(!style){
      style=document.createElement('style');
      style.id='nosotrosV4Styles';
      document.head.appendChild(style);
    }
    style.textContent=CSS;

    const view=document.getElementById('view-nosotros');
    if(!view) return;

    const hero=view.querySelector('.about-hero .inner-hero-content');
    if(hero){
      const kicker=hero.querySelector('.v2-kicker');
      const title=hero.querySelector('h1');
      const desc=hero.querySelector('p');
      if(kicker){
        kicker.textContent='CCT · FIEE UNI';
        kicker.style.setProperty('color','#00caff','important');
      }
      if(title){
        title.textContent='NOSOTROS';
        title.style.setProperty('color','#fff','important');
        title.style.setProperty('-webkit-text-fill-color','#fff','important');
        title.style.setProperty('background','none','important');
        title.style.setProperty('background-image','none','important');
      }
      if(desc) desc.innerHTML='Una comunidad estudiantil que convierte las telecomunicaciones en <strong>aprendizaje, proyectos y oportunidades.</strong>';
    }

    const photoUrl=asset('equipo-cct-2026.webp');
    const photoWrap=view.querySelector('.about-photo-main');
    if(photoWrap){
      photoWrap.style.backgroundImage=`url("${photoUrl}")`;
      photoWrap.style.backgroundSize='cover';
      photoWrap.style.backgroundPosition='center 48%';
    }

    const photo=view.querySelector('.about-photo-main img');
    if(photo){
      photo.removeAttribute('loading');
      photo.loading='eager';
      photo.decoding='sync';
      photo.src=photoUrl;
      photo.alt='Equipo del Centro Cultural de Telecomunicaciones CCT UNI';
      photo.style.opacity='1';
      photo.style.filter='none';
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
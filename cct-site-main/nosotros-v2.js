(() => {
  const current = document.currentScript;
  const SCRIPT_BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}`, SCRIPT_BASE).href;

  const CSS = `
    #view-nosotros .about-hero .inner-hero-content{max-width:760px}
    #view-nosotros .about-hero .inner-hero-content h1{font-size:clamp(3.1rem,7vw,6.8rem);line-height:.9;letter-spacing:-.055em;margin-bottom:16px}
    #view-nosotros .about-hero .inner-hero-content p{max-width:560px;font-size:clamp(.95rem,1.3vw,1.08rem);line-height:1.6;color:rgba(255,255,255,.75)}
    #view-nosotros .about-photo-main img{object-fit:cover;object-position:center 42%;width:100%;height:100%;display:block}
    #view-nosotros .about-photo-main{min-height:360px}
    #view-nosotros .about-story-copy h3{max-width:620px}
    @media(max-width:720px){
      #view-nosotros .about-photo-main{min-height:270px}
      #view-nosotros .about-hero .inner-hero-content h1{font-size:clamp(3rem,16vw,5rem)}
    }
  `;

  function injectStyles(){
    if (document.getElementById('nosotrosV2Styles')) return;
    const style = document.createElement('style');
    style.id = 'nosotrosV2Styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function initNosotrosV2(){
    injectStyles();
    const view = document.getElementById('view-nosotros');
    if (!view || view.dataset.nosotrosV2 === 'ready') return;
    view.dataset.nosotrosV2 = 'ready';

    const hero = view.querySelector('.about-hero .inner-hero-content');
    if (hero){
      const kicker = hero.querySelector('.v2-kicker');
      const title = hero.querySelector('h1');
      const desc = hero.querySelector('p');
      if (kicker) kicker.textContent = 'CCT · FIEE UNI';
      if (title) title.innerHTML = 'NOSOTROS';
      if (desc) desc.textContent = 'Estudiantes que comparten conocimiento, crean oportunidades y hacen comunidad alrededor de las telecomunicaciones.';
    }

    const photo = view.querySelector('.about-photo-main img');
    if (photo){
      photo.src = asset('nosotros-equipo.webp');
      photo.alt = 'Equipo del Centro Cultural de Telecomunicaciones CCT UNI';
    }
    const photoLabel = view.querySelector('.about-photo-main span');
    if (photoLabel) photoLabel.textContent = 'Comunidad CCT · FIEE UNI';

    const story = view.querySelector('.about-story-copy');
    if (story){
      const kicker = story.querySelector('.v2-kicker');
      const title = story.querySelector('h3');
      const text = story.querySelector('p');
      if (kicker) kicker.textContent = 'NUESTRA HISTORIA';
      if (title) title.textContent = 'Personas que convierten la carrera en comunidad.';
      if (text) text.textContent = 'El CCT reúne a estudiantes que aprenden, comparten y construyen juntos. Formación técnica, eventos y proyectos se convierten en espacios donde cada generación puede dejar algo útil para la siguiente.';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNosotrosV2);
  else initNosotrosV2();
})();

(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}?v=20260822-board-slider`, BASE).href;

  const CSS = `
    #view-nosotros .about-photo-main{
      min-height:390px!important;
      aspect-ratio:16/9!important;
      overflow:hidden!important;
      background:#10141f!important;
      border-radius:24px!important;
      position:relative!important;
      isolation:isolate!important;
    }
    #view-nosotros .about-photo-main>img{display:none!important}
    #view-nosotros .board-collage{display:none!important}
    #view-nosotros .board-slider{
      position:absolute!important;
      inset:0!important;
      z-index:0!important;
      overflow:hidden!important;
      background:#10141f!important;
    }
    #view-nosotros .board-slide{
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      object-position:center center!important;
      display:block!important;
      opacity:0!important;
      filter:none!important;
      transform:none!important;
      image-rendering:auto!important;
      transition:opacity .9s ease-in-out!important;
      will-change:opacity!important;
    }
    #view-nosotros .board-slide.is-active{opacity:1!important}
    #view-nosotros .board-slide:nth-child(2){object-position:center 47%!important}
    #view-nosotros .about-photo-main::after{
      content:'';
      position:absolute;
      inset:0;
      z-index:1;
      pointer-events:none;
      background:linear-gradient(0deg,rgba(6,9,15,.35),transparent 34%)!important;
    }
    #view-nosotros .about-photo-main span{
      position:absolute!important;
      z-index:2!important;
      left:22px!important;
      bottom:18px!important;
      color:#fff!important;
    }
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
    @media(max-width:720px){
      #view-nosotros .about-photo-main{min-height:250px!important;aspect-ratio:16/9!important}
      html body #view-nosotros section.about-hero .container.inner-hero-content>h1{font-size:clamp(4rem,18vw,6.4rem)!important}
    }
    @media(prefers-reduced-motion:reduce){
      #view-nosotros .board-slide{transition:none!important}
    }
  `;

  async function loadSlideBase64(file){
    const response = await fetch(asset(file), { cache:'no-store' });
    if(!response.ok) throw new Error(`No se pudo cargar ${file}`);
    return (await response.text()).trim();
  }

  async function mountBoardSlider(photoWrap){
    const oldCollage = photoWrap.querySelector('.board-collage');
    if(oldCollage) oldCollage.remove();
    const oldSlider = photoWrap.querySelector('.board-slider');
    if(oldSlider) oldSlider.remove();

    const slider = document.createElement('div');
    slider.className = 'board-slider';
    slider.setAttribute('aria-label','Fotografías de la Junta Directiva CCT');
    photoWrap.prepend(slider);

    try{
      const [first, second] = await Promise.all([
        loadSlideBase64('nosotros-slide-1.b64'),
        loadSlideBase64('nosotros-slide-2.b64')
      ]);

      const sources = [
        `data:image/webp;base64,${first}`,
        `data:image/webp;base64,${second}`
      ];

      const images = sources.map((src,index) => {
        const img = document.createElement('img');
        img.className = `board-slide${index === 0 ? ' is-active' : ''}`;
        img.src = src;
        img.alt = index === 0
          ? 'Junta Directiva del Centro Cultural de Telecomunicaciones CCT UNI'
          : 'Integrantes de la Junta Directiva CCT frente a la FIEE UNI';
        img.loading = 'eager';
        img.decoding = 'async';
        slider.appendChild(img);
        return img;
      });

      await Promise.all(images.map(img => img.decode?.().catch(()=>{}) ?? Promise.resolve()));

      let active = 0;
      if(photoWrap.dataset.sliderTimer){
        clearInterval(Number(photoWrap.dataset.sliderTimer));
      }
      const timer = window.setInterval(() => {
        images[active].classList.remove('is-active');
        active = (active + 1) % images.length;
        images[active].classList.add('is-active');
      }, 5000);
      photoWrap.dataset.sliderTimer = String(timer);
    }catch(error){
      console.error('[CCT] No se pudieron cargar las fotos de la Junta Directiva', error);
    }
  }

  function init(){
    let style=document.getElementById('nosotrosStableStyles');
    if(!style){style=document.createElement('style');style.id='nosotrosStableStyles';document.head.appendChild(style)}
    style.textContent=CSS;

    const view=document.getElementById('view-nosotros');
    if(!view) return;

    const hero=view.querySelector('.about-hero .inner-hero-content');
    if(hero){
      const kicker=hero.querySelector('.v2-kicker');
      const title=hero.querySelector('h1');
      const desc=hero.querySelector('p');
      if(kicker) kicker.textContent='CCT · FIEE UNI';
      if(title) title.textContent='NOSOTROS';
      if(desc) desc.innerHTML='Una comunidad estudiantil que convierte las telecomunicaciones en <strong>aprendizaje, proyectos y oportunidades.</strong>';
    }

    const photoWrap=view.querySelector('.about-photo-main');
    if(photoWrap) mountBoardSlider(photoWrap);

    const label=view.querySelector('.about-photo-main span');
    if(label) label.textContent='Junta Directiva CCT · FIEE UNI';

    const story=view.querySelector('.about-story-copy');
    if(story){
      const kicker=story.querySelector('.v2-kicker');
      const title=story.querySelector('h3');
      const text=story.querySelector('p');
      if(kicker) kicker.textContent='JUNTA DIRECTIVA';
      if(title) title.innerHTML='El CCT se mueve porque hay <span class="nosotros-red">un equipo detrás.</span>';
      if(text) text.innerHTML='La Junta Directiva organiza y conecta las áreas que hacen posible el CCT: <strong>formación, eventos, difusión, proyectos y comunidad.</strong> Distintas responsabilidades, una misma meta: abrir más oportunidades para los estudiantes de Telecomunicaciones.';
    }
  }

  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();

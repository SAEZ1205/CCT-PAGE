(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}`, BASE).href;

  const CSS = `
    #view-nosotros .about-story-copy h3 .nosotros-red,
    #view-nosotros .about-story-copy p strong,
    #view-nosotros .about-hero .inner-hero-content h1,
    #view-nosotros .about-hero .inner-hero-content h1 span{color:#b82034!important}

    #view-formacion .formation-hero,
    #view-formacion .formation-hero-content{min-height:560px!important;background:#070b12!important}
    #view-formacion .academy-earth-v3{background:#070b12!important}
    #view-formacion .academy-earth-v3 img{display:block!important;opacity:1!important;visibility:visible!important;filter:brightness(.7) saturate(1.05)!important}
    #view-formacion .academy-earth-copy .kicker{color:#18b7f1!important}
    #view-formacion .academy-earth-copy h1{color:#fff!important}
    #view-formacion .academy-earth-copy h1 span{color:#18b7f1!important}
    #view-formacion .academy-earth-copy p{color:rgba(255,255,255,.78)!important}

    #view-formacion .certification-orbit{background:#fff!important}
    #view-formacion .cert-v3-head .v2-kicker{color:#b82034!important}
    #view-formacion .cert-v3-head h2{color:#0b1220!important}
    #view-formacion .cert-v3-head h2 span{color:#b82034!important}

    #view-formacion .open-course-v3-section{background:#0b0e17!important;color:#fff!important}
    #view-formacion .open-course-v3-section .v2-kicker{color:#18b7f1!important}
    #view-formacion .open-course-v3-section .open-course-heading h2{color:#fff!important}
    #view-formacion .open-course-v3-section .open-course-heading h2 span{color:#18b7f1!important}
    #view-formacion .course-v3-body small{color:#18b7f1!important}
    #view-formacion .course-v3-body h3{color:#fff!important}
    #view-formacion .course-v3-body p{color:rgba(255,255,255,.66)!important}
    #view-formacion .course-v3-meta{color:#cbd6e4!important}

    #view-formacion .course-v3-media{background:#111722!important}
    #view-formacion .course-v3-media img{display:block!important;opacity:1!important;visibility:visible!important;object-fit:cover!important;object-position:center!important}

    @media(max-width:600px){
      #view-formacion .formation-hero,#view-formacion .formation-hero-content{min-height:430px!important}
    }
  `;

  function addStyles(){
    if(document.getElementById('formationV5Styles')) return;
    const style=document.createElement('style');
    style.id='formationV5Styles';
    style.textContent=CSS;
    document.head.appendChild(style);
  }

  function fixNosotros(){
    const view=document.getElementById('view-nosotros');
    if(!view) return;
    const photo=view.querySelector('.about-photo-main img');
    if(photo){
      photo.src=asset('nosotros-equipo-v3.webp');
      photo.onerror=()=>{ photo.src=asset('nosotros-equipo.webp'); };
      photo.alt='Equipo del Centro Cultural de Telecomunicaciones CCT UNI';
    }
    const title=view.querySelector('.about-story-copy h3');
    if(title) title.innerHTML='La carrera también se construye <span class="nosotros-red">en comunidad.</span>';
    const text=view.querySelector('.about-story-copy p');
    if(text) text.innerHTML='El CCT conecta a estudiantes de distintas generaciones para que la formación no termine en el aula. <strong>Academias, eventos, proyectos y experiencias compartidas</strong> convierten el conocimiento en algo que circula, crece y queda para quienes vienen después.';
  }

  function fixHero(){
    const img=document.querySelector('#view-formacion .academy-earth-v3 img');
    if(img){
      img.src=asset('formation-earth.webp');
      img.onerror=()=>{ img.src=asset('micro-earth.webp'); };
    }
    const kicker=document.querySelector('#view-formacion .academy-earth-copy .kicker');
    if(kicker) kicker.textContent='FORMACIÓN Y ACADEMIAS';
    const title=document.querySelector('#view-formacion .academy-earth-copy h1');
    if(title) title.innerHTML='ACADEMIA <span>CCT</span>';
  }

  function fixCourses(){
    const data=[
      ['cybersecurity','course-support.webp'],
      ['defense','course-network-lab.webp'],
      ['ethical-hacking','course-wireless.webp']
    ];
    const cards=[...document.querySelectorAll('#view-formacion .course-v3-card')];
    cards.forEach((card,i)=>{
      const img=card.querySelector('.course-v3-media img');
      if(!img) return;
      const file=data[i]?.[1];
      if(file){
        img.src=asset(file);
        img.onerror=()=>{ img.style.display='none'; };
      }
    });
  }

  function init(){
    addStyles();
    fixNosotros();
    fixHero();
    fixCourses();
  }

  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();

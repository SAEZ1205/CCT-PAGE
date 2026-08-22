(() => {
  const current = document.currentScript;
  const BASE = current?.src ? new URL('.', current.src) : new URL('./', window.location.href);
  const asset = (name) => new URL(`assets/${name}?v=20260822-community`, BASE).href;

  const teleItems = [
    { img: 'teleinforma-amazon.webp', tag: 'TELEINFORMA', title: 'Tecnología que cambia cómo nos conectamos', text: 'Noticias y contexto para entender mejor el mundo de las telecomunicaciones.' },
    { img: 'teleinforma_card.png', tag: 'ACTUALIDAD', title: 'Lo importante, explicado desde Telecom', text: 'Una selección visual de noticias y tendencias para la comunidad CCT.' },
    { img: 'flyer-huawei-courses.webp', tag: 'INDUSTRIA · FORMACIÓN', title: 'Oportunidades Huawei para estudiantes', text: 'Formación, industria y nuevas rutas para seguir creciendo fuera del aula.' }
  ];

  const familyItems = [
    { img:'event-community-group.webp', tag:'COMUNIDAD', title:'Una comunidad que crece junta' },
    { img:'event-auditorium.webp', tag:'EVENTOS', title:'Auditorios que se llenan de ideas' },
    { img:'feria-stem-2023.webp', tag:'DIFUSIÓN', title:'Compartimos la carrera con nuevas generaciones' },
    { img:'visit-network-operations.webp', tag:'FAMILIA CCT', title:'Telecomunicaciones también se construye en equipo' }
  ];

  const CSS = `
    #view-comunidad .teleinforma-curated{background:#f7f8fb!important;padding:70px 0!important}
    #view-comunidad .teleinforma-curated .v2-kicker{color:#00aeea!important}
    #view-comunidad .teleinforma-curated .v2-kicker::before{background:#00aeea!important}
    #view-comunidad .teleinforma-curated .v2-heading-row h2 span{color:#00aeea!important}
    #view-comunidad .tele-curated-grid{display:grid!important;grid-template-columns:minmax(0,1.7fr) minmax(220px,.65fr) minmax(220px,.65fr)!important;gap:16px!important;align-items:stretch!important;position:relative!important}
    #view-comunidad .tele-main-story,#view-comunidad .tele-side-story{border-radius:22px!important;overflow:hidden!important;border:1px solid rgba(12,18,31,.1)!important;background:#fff!important;box-shadow:0 18px 45px rgba(16,24,40,.08)!important;text-decoration:none!important;position:relative!important}
    #view-comunidad .tele-main-story{min-height:560px!important;display:grid!important;grid-template-columns:1.04fr .96fr!important}
    #view-comunidad .tele-main-story img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;min-height:560px!important}
    #view-comunidad .tele-main-story>div{padding:34px!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important}
    #view-comunidad .tele-main-story h3{font-size:clamp(1.8rem,3.2vw,3.25rem)!important;line-height:1!important;letter-spacing:-.04em!important;margin:10px 0 12px!important;color:#0b1020!important}
    #view-comunidad .tele-main-story p{color:#687386!important;line-height:1.65!important}
    #view-comunidad .tele-main-story a{margin-top:18px!important;color:#00aeea!important;font-weight:900!important}
    #view-comunidad .tele-side-story{display:flex!important;flex-direction:column!important;min-height:560px!important;cursor:pointer!important;transition:.25s!important}
    #view-comunidad .tele-side-story:hover{transform:translateY(-4px)!important;border-color:#00aeea!important}
    #view-comunidad .tele-side-story img{height:390px!important;width:100%!important;object-fit:cover!important;display:block!important}
    #view-comunidad .tele-side-story>div{padding:18px!important}
    #view-comunidad .tele-side-story h3{font-size:1.02rem!important;line-height:1.2!important;color:#0b1020!important;margin:7px 0!important}
    #view-comunidad .tele-side-story span{color:#d52b3d!important;font-size:.58rem!important;font-weight:900!important;letter-spacing:.08em!important}
    #view-comunidad .tele-controls{display:flex;gap:10px;position:absolute;right:16px;top:-58px;z-index:5}
    #view-comunidad .tele-arrow{width:42px;height:42px;border-radius:50%;border:1px solid #d9dee8;background:#fff;color:#0b1020;font-size:1.25rem;font-weight:900;cursor:pointer;box-shadow:0 8px 20px rgba(15,23,42,.08)}
    #view-comunidad .tele-arrow:hover{background:#0b1020;color:#fff}
    #view-comunidad .tele-story-enter{animation:teleEnter .38s ease both}@keyframes teleEnter{from{opacity:.25;transform:translateX(18px)}to{opacity:1;transform:none}}

    #view-comunidad .cct-family{background:#0b0e17!important;color:#fff!important;padding:72px 0!important}
    #view-comunidad .cct-family .v2-kicker{color:#00caff!important}
    #view-comunidad .cct-family .v2-kicker::before{background:#00caff!important}
    #view-comunidad .cct-family .v2-heading-row h2 span{color:#00caff!important}
    #view-comunidad .family-mosaic{display:grid!important;grid-template-columns:1.45fr 1fr 1fr!important;grid-template-rows:260px 260px!important;gap:14px!important}
    #view-comunidad .family-mosaic figure{margin:0!important;position:relative!important;border-radius:20px!important;overflow:hidden!important;background:#151a25!important}
    #view-comunidad .family-mosaic .family-wide{grid-row:1/3!important}
    #view-comunidad .family-mosaic .family-tall{grid-row:auto!important}
    #view-comunidad .family-mosaic img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;transition:opacity .7s ease,transform 4s ease!important}
    #view-comunidad .family-mosaic figure.is-fading img{opacity:.08!important;transform:scale(1.035)!important}
    #view-comunidad .family-mosaic figcaption{position:absolute!important;left:0;right:0;bottom:0!important;padding:42px 18px 16px!important;color:#fff!important;background:linear-gradient(transparent,rgba(4,7,12,.88))!important;font-weight:800!important}
    #view-comunidad .family-mosaic figcaption span{display:block!important;color:#00caff!important;font-size:.58rem!important;letter-spacing:.1em!important;margin-bottom:4px!important}

    #view-comunidad .section-interviews{display:none!important}
    #view-comunidad .voices-cct{background:#fff!important;padding:72px 0!important;color:#0b1020!important}
    #view-comunidad .voices-layout{display:grid!important;grid-template-columns:minmax(280px,.8fr) minmax(0,1.2fr)!important;gap:50px!important;align-items:center!important}
    #view-comunidad .voices-owl{height:520px!important;border-radius:28px!important;background:radial-gradient(circle at 50% 35%,#eefaff 0,#e8edf5 55%,#dfe5ee 100%)!important;overflow:hidden!important;position:relative!important;display:flex!important;align-items:flex-end!important;justify-content:center!important}
    #view-comunidad .voices-owl img{width:92%!important;height:96%!important;object-fit:contain!important;object-position:center bottom!important;display:block!important}
    #view-comunidad .voices-owl span{position:absolute!important;left:22px!important;top:22px!important;background:#d52b3d!important;color:#fff!important;padding:8px 12px!important;border-radius:999px!important;font-size:.6rem!important;font-weight:900!important;letter-spacing:.1em!important}
    #view-comunidad .voices-copy .v2-kicker{color:#00aeea!important}
    #view-comunidad .voices-copy h2{font-size:clamp(2.2rem,4.7vw,4.8rem)!important;line-height:.94!important;letter-spacing:-.05em!important;margin:10px 0 16px!important}
    #view-comunidad .voices-copy p{color:#6a7485!important;font-size:1rem!important;line-height:1.65!important;max-width:650px!important}
    #view-comunidad .voice-topics{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:10px!important;margin:24px 0!important}
    #view-comunidad .voice-topics span{background:#0b1020!important;color:#fff!important;border-radius:14px!important;padding:16px!important;font-size:.72rem!important;font-weight:800!important}
    #view-comunidad .voices-copy>a{display:inline-flex!important;background:#00caff!important;color:#07101c!important;padding:13px 18px!important;border-radius:999px!important;text-decoration:none!important;font-weight:900!important}

    @media(max-width:980px){#view-comunidad .tele-curated-grid{grid-template-columns:1fr 1fr!important}#view-comunidad .tele-main-story{grid-column:1/-1!important}.tele-controls{top:-54px!important}#view-comunidad .family-mosaic{grid-template-columns:1fr 1fr!important;grid-template-rows:340px 240px 240px!important}#view-comunidad .family-mosaic .family-wide{grid-column:1/-1!important;grid-row:auto!important}#view-comunidad .voices-layout{grid-template-columns:1fr!important}#view-comunidad .voices-owl{height:430px!important}}
    @media(max-width:640px){#view-comunidad .tele-curated-grid{grid-template-columns:1fr!important}#view-comunidad .tele-main-story{grid-template-columns:1fr!important;min-height:0!important}#view-comunidad .tele-main-story img{min-height:0!important;height:430px!important}#view-comunidad .tele-side-story{min-height:0!important}#view-comunidad .tele-side-story img{height:430px!important}#view-comunidad .family-mosaic{display:flex!important;flex-direction:column!important}#view-comunidad .family-mosaic figure{height:300px!important}#view-comunidad .voice-topics{grid-template-columns:1fr!important}}
  `;

  let teleIndex = 0;
  function renderTele() {
    const grid = document.querySelector('#view-comunidad .tele-curated-grid');
    if (!grid) return;
    const indexes = [0,1,2].map((n)=>(teleIndex+n)%teleItems.length);
    const [main,a,b] = indexes.map(i=>teleItems[i]);
    grid.innerHTML = `
      <div class="tele-controls"><button class="tele-arrow" type="button" data-dir="-1" aria-label="Anterior">←</button><button class="tele-arrow" type="button" data-dir="1" aria-label="Siguiente">→</button></div>
      <article class="tele-main-story tele-story-enter"><img src="${asset(main.img)}" alt="${main.title}"><div><span class="feed-tag cyan">${main.tag}</span><h3>${main.title}</h3><p>${main.text}</p><a href="https://www.instagram.com/cct_uni_fiee/" target="_blank" rel="noopener">Ver publicación en Instagram ↗</a></div></article>
      <article class="tele-side-story tele-story-enter" data-step="1"><img src="${asset(a.img)}" alt="${a.title}"><div><span>${a.tag}</span><h3>${a.title}</h3><b>Ver como principal →</b></div></article>
      <article class="tele-side-story tele-story-enter" data-step="2"><img src="${asset(b.img)}" alt="${b.title}"><div><span>${b.tag}</span><h3>${b.title}</h3><b>Ver como principal →</b></div></article>`;
    grid.querySelectorAll('.tele-arrow').forEach(btn=>btn.addEventListener('click',()=>{teleIndex=(teleIndex+Number(btn.dataset.dir)+teleItems.length)%teleItems.length;renderTele()}));
    grid.querySelectorAll('.tele-side-story').forEach(card=>card.addEventListener('click',()=>{teleIndex=(teleIndex+Number(card.dataset.step))%teleItems.length;renderTele()}));
  }

  function initFamily() {
    const figures = [...document.querySelectorAll('#view-comunidad .family-mosaic figure')];
    if (!figures.length) return;
    let order = familyItems.map((_, i) => i);
    const shuffle = () => {
      const next = familyItems.map((_, i) => i);
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      if (next.some((value, i) => value === order[i])) next.push(next.shift());
      return next;
    };

    const paint = (animate = false) => {
      if (animate) figures.forEach((figure) => figure.classList.add('is-fading'));
      const delay = animate ? 520 : 0;
      setTimeout(() => {
        figures.forEach((figure, i) => {
          const item = familyItems[order[i % order.length]];
          const img = figure.querySelector('img');
          const cap = figure.querySelector('figcaption');
          if (img) {
            img.src = asset(item.img);
            img.alt = item.title;
            img.removeAttribute('loading');
          }
          if (cap) cap.innerHTML = `<span>${item.tag}</span>${item.title}`;
          figure.dataset.familyIndex = String(order[i % order.length]);
          figure.classList.remove('is-fading');
        });
      }, delay);
    };

    paint(false);
    setInterval(() => {
      if (document.hidden) return;
      order = shuffle();
      paint(true);
    }, 3900);
  }

  function initVoices(){const img=document.querySelector('#view-comunidad .voices-owl img');if(img){img.src=asset('owl-guide.webp');img.alt='Búho CCT presentando Voces CCT'}const k=document.querySelector('#view-comunidad .voices-copy .v2-kicker');if(k)k.textContent='VOCES CCT · ENTREVISTAS';const h=document.querySelector('#view-comunidad .voices-copy h2');if(h)h.textContent='Personas detrás de la carrera.';const p=document.querySelector('#view-comunidad .voices-copy p');if(p)p.textContent='Conversaciones breves con egresados, estudiantes y docentes: decisiones reales, aprendizajes y consejos que no siempre aparecen en la malla curricular.'}

  function init(){if(!document.getElementById('communityStyles')){const s=document.createElement('style');s.id='communityStyles';s.textContent=CSS;document.head.appendChild(s)}renderTele();initFamily();initVoices()}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

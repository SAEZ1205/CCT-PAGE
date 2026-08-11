// ============================================
// GLOBAL STATE
// ============================================
let currentCarouselIndex = { story: 0 };
let heroIndex = 0;
let heroTimer = null;

const HERO_FEATURES = [
    {
        tag: 'FORMACIÓN',
        title: 'Cursos y Academias',
        desc: 'Academia Cisco & Huawei + cursos de especialización del CCT.',
        primary: { text: 'Ver formación', action: () => navigateTo('#formacion') },
        secondary: { text: 'Ver recursos', action: () => navigateTo('#recursos') }
    },
    {
        tag: 'TELCON',
        title: 'TELCON',
        desc: 'El congreso nacional de telecomunicaciones del CCT: bases, categorías y cronograma.',
        primary: { text: 'Ir a TELCON', action: () => navigateTo('#telcon') },
        secondary: { text: 'Contacto TELCON', action: () => openTelconContactModal() }
    },
    {
        tag: 'ASESORÍA',
        title: 'Asesoría Académica',
        desc: 'Orientación y soporte académico entre estudiantes y miembros del CCT.',
        primary: { text: 'Solicitar asesoría', action: () => openAsesoriaModal() },
        secondary: { text: 'Ver recursos', action: () => navigateTo('#recursos') }
    },
    {
        tag: 'ICT',
        title: 'ICT & Competencias',
        desc: 'Rutas, práctica y acompañamiento para competencias y certificaciones.',
        primary: { text: 'Ver información', action: () => openIctInfoModal() },
        secondary: { text: 'Formación', action: () => navigateTo('#formacion') }
    },
    {
        tag: 'HISTORIAS',
        title: 'Conoce tu carrera',
        desc: 'Entrevistas de egresados y estudiantes: experiencias reales que inspiran.',
        primary: { text: 'Ver entrevistas', action: () => navigateTo('#historias') },
        secondary: { text: 'Teleinforma', action: () => navigateTo('#comunidad') }
    }
];

// ============================================
// TELEINFORMA DATA (archivo editorial real)
// ============================================
// Tipos: 'noticia' | 'comunicado' | 'nota'
const TELEINFORMA_ITEMS = [
    { id: 1, type: 'noticia', cat: 'COMUNICACIONES SATELITALES', date: 'Teleinforma', title: 'Amazon LEO: internet desde el espacio', excerpt: 'El gigante tecnológico busca ampliar la conectividad satelital.', image: 'assets/teleinforma-amazon.webp', body: 'Una mirada CCT a las nuevas constelaciones satelitales y su impacto en las telecomunicaciones.' },
    { id: 2, type: 'comunicado', cat: 'FORMACIÓN', date: '07 de Agosto, 2026', title: 'Nuevos cursos Huawei disponibles', excerpt: 'Formación online y asíncrona para estudiantes UNI.', image: 'assets/flyer-huawei-courses.webp', body: 'Orientación e inscripción en cursos de Huawei ICT Academy.' },
    { id: 3, type: 'nota', cat: 'COMUNIDAD', date: '28 de Julio, 2026', title: 'El CCT celebra al Perú', excerpt: 'Un saludo a nuestra historia, cultura y esfuerzo compartido.', image: 'assets/flyer-fiestas-patrias.webp', body: 'Publicación institucional por Fiestas Patrias.' }
];

function updateHeroFeature(index){
    const tagEl = document.getElementById('heroFeatureTag');
    const titleEl = document.getElementById('heroFeatureTitle');
    const descEl = document.getElementById('heroFeatureDesc');
    const primaryBtn = document.getElementById('heroPrimaryBtn');
    const secondaryBtn = document.getElementById('heroSecondaryBtn');

    const item = HERO_FEATURES[index] || HERO_FEATURES[0];

    if (tagEl) tagEl.textContent = item.tag;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;

    if (primaryBtn){
        primaryBtn.textContent = item.primary.text;
        primaryBtn.onclick = item.primary.action;
    }
    if (secondaryBtn){
        secondaryBtn.textContent = item.secondary.text;
        secondaryBtn.onclick = item.secondary.action;
    }
}
let currentFormStep = 1;
const totalFormSteps = 3;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setupWelcomeContent();
    initWelcomeToast();
    initCookieNotice();
    initAppShell();
    initHeroCarousel();
    initHeroVideo();
    initResourcesFilters();
    initBoardMemberPhotos();
    initConvocatoriaForm();
    initAcademyEnrollments();
    initCctV2Experience();
});




// ============================================
// EVENTOS HERO — VIDEO BOOMERANG
// ============================================
let eventosBoomerang = null;

function initEventosBoomerang(){
    const f = document.getElementById('eventosBoomF');
    const r = document.getElementById('eventosBoomR');
    if (!f || !r) return;

    // Ensure initial state
    f.classList.add('is-active');
    r.classList.remove('is-active');

    // Some browsers won't autoplay if not muted
    f.muted = true;
    r.muted = true;

    const show = (which) => {
        if (which === 'f'){
            f.classList.add('is-active');
            r.classList.remove('is-active');
        } else {
            r.classList.add('is-active');
            f.classList.remove('is-active');
        }
    };

    const safePlay = async (vid) => {
        try {
            // Start from beginning
            vid.currentTime = 0;
        } catch(_) {}
        try {
            await vid.play();
        } catch(_) {
            // Autoplay might be blocked; do nothing
        }
    };

    const playForward = async () => {
        show('f');
        try { r.pause(); } catch(_) {}
        await safePlay(f);
    };

    const playReverse = async () => {
        show('r');
        try { f.pause(); } catch(_) {}
        await safePlay(r);
    };

    // Chain ended events to create boomerang
    f.addEventListener('ended', () => {
        if (!eventosBoomerang?.enabled) return;
        playReverse();
    });
    r.addEventListener('ended', () => {
        if (!eventosBoomerang?.enabled) return;
        playForward();
    });

    eventosBoomerang = {
        enabled: false,
        start(){
            this.enabled = true;
            // Give the browser a frame so the view is visible before playback
            requestAnimationFrame(() => playForward());
        },
        stop(){
            this.enabled = false;
            try { f.pause(); } catch(_) {}
            try { r.pause(); } catch(_) {}
        }
    };
}

// ============================================
// HERO CAROUSEL (INICIO)
// ============================================
function initHeroCarousel(){
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.hero-track');
    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(carousel.querySelectorAll('.hero-dot'));

    if (!track || slides.length === 0) return;

    const clampIndex = (i) => {
        const n = slides.length;
        return ((i % n) + n) % n;
    };

    const render = () => {
        track.style.transform = `translateX(-${heroIndex * 100}%)`;
        dots.forEach((d, idx) => d.classList.toggle('active', idx === heroIndex));
        updateHeroFeature(heroIndex);
    };

    window.goHero = (i) => {
        heroIndex = clampIndex(i);
        render();
        restartHeroTimer();
    };

    window.moveHero = (dir) => {
        heroIndex = clampIndex(heroIndex + dir);
        render();
        restartHeroTimer();
    };

    const restartHeroTimer = () => {
        if (heroTimer) clearInterval(heroTimer);
        heroTimer = setInterval(() => {
            heroIndex = clampIndex(heroIndex + 1);
            render();
        }, 5500);
    };

    // Pause on hover (desktop)
    carousel.addEventListener('mouseenter', () => {
        if (heroTimer) clearInterval(heroTimer);
        heroTimer = null;
    });
    carousel.addEventListener('mouseleave', () => {
        restartHeroTimer();
    });

    // Dot click
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => window.goHero(idx));
    });

    render();
    restartHeroTimer();
}

// ============================================
// HERO VIDEO (INICIO: reproduce 1 vez y se congela en el último frame)
// ============================================
function initHeroVideo(){
    const v = document.getElementById('heroVideo');
    if (!v) return;

    const start = async () => {
        try {
            v.pause();
            v.currentTime = 0;
            await v.play();
        } catch (e) {
            // Autoplay puede bloquearse en algunos navegadores
        }
    };

    const freezeLastFrame = () => {
        try {
            v.pause();
            const t = (isFinite(v.duration) && v.duration > 0) ? Math.max(0, v.duration - 0.05) : v.currentTime;
            v.currentTime = t;
        } catch (e) {}
    };

    v.addEventListener('ended', freezeLastFrame);

    // Arranca al cargar (si ya hay metadata, arranca directo)
    if (v.readyState >= 1) {
        start();
    } else {
        v.addEventListener('loadedmetadata', start, { once: true });
    }

    // Ahorra recursos cuando se sale de la vista inicio
    const onViewChange = () => {
        const activeView = document.querySelector('.view.active')?.dataset?.view || 'inicio';
        if (activeView !== 'inicio') {
            try { v.pause(); } catch (e) {}
        }
    };

    window.addEventListener('hashchange', onViewChange);
}

// ============================================
// WELCOME TOAST
// ============================================

function setupWelcomeContent(){ /* no-op — new popup uses static HTML */ }

function initWelcomeToast() {
    // Siempre mostrar el popup al cargar
    setTimeout(() => {
        const toast = document.getElementById('welcomeToast');
        if (toast) toast.classList.add('active');
    }, 600);
}

function goToConvocatoriasFromWelcome(){
    closeWelcomeToast();
    navigateTo('#convocatorias');
}

function goToAreasFromWelcome(){
    closeWelcomeToast();
    navigateTo('#areas');
}

function closeWelcomeToast() {
    const toast = document.getElementById('welcomeToast');
    if (toast) toast.classList.remove('active');
}

// ============================================
// COOKIE NOTICE
// ============================================
function initCookieNotice() {
    const cookieAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookieAccepted) {
        setTimeout(() => {
            document.getElementById('cookieNotice').classList.add('active');
        }, 1000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieNotice').classList.remove('active');
}

function rejectCookies() {
    document.getElementById('cookieNotice').classList.remove('active');
}


// ============================================
// APP SHELL (Tabs-like navigation / views)
// ============================================
let currentViewKey = 'inicio';
let galleryIndex = 0;

function initAppShell() {
    const appMain = document.getElementById('appMain');
    const header = document.getElementById('mainHeader');

    // Header shadow based on app scroll
    if (appMain && header) {
        appMain.addEventListener('scroll', () => {
            if (appMain.scrollTop <= 0) {
                header.style.boxShadow = 'none';
            } else {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            }
        });
    }

    // Intercept anchor navigation and route inside the app
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();
            navigateTo(href);
        });
    });

    // Initial route
    handleRoute(location.hash || '#inicio');

    // Back/forward
    window.addEventListener('hashchange', () => handleRoute(location.hash || '#inicio'));
}

function navigateTo(hash) {
    if (!hash.startsWith('#')) hash = `#${hash}`;
    if (location.hash !== hash) {
        history.pushState(null, '', hash);
    }
    handleRoute(hash);

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    const burgerBtn = document.getElementById('burgerBtn');
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (burgerBtn) burgerBtn.classList.remove('active');
}

function handleRoute(hash) {
    const appMain = document.getElementById('appMain');
    if (!appMain) return;

    const target = document.querySelector(hash);

    // If target doesn't exist, fallback to inicio
    if (!target) {
        activateView('inicio');
        setActiveNav('inicio');
        appMain.scrollTo({ top: 0, behavior: 'auto' });
        return;
    }

    const viewEl = target.closest('.view');
    const viewKey = viewEl?.dataset?.view || 'inicio';

    activateView(viewKey);
    setActiveNav(viewKey);

    // Scroll to target inside the app container
    requestAnimationFrame(() => {
        const headerHeight = document.getElementById('mainHeader')?.offsetHeight || 0;
        const appTop = appMain.getBoundingClientRect().top;

        // If the scroll container starts under the header (appTop ~= headerHeight),
        // do NOT subtract the header height. If it starts at the top (appTop ~= 0),
        // subtract it so the target doesn't hide behind the fixed header.
        const overlapOffset = (appTop < headerHeight * 0.5) ? headerHeight : 0;

        const targetTop = target.getBoundingClientRect().top - appTop + appMain.scrollTop - overlapOffset - 16;
        appMain.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    });
}

function activateView(viewKey) {
    currentViewKey = viewKey;

    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.dataset.view === viewKey);
    });

    // Reset scroll when changing top-level view
    const appMain = document.getElementById('appMain');
    if (appMain) appMain.scrollTo({ top: 0, behavior: 'auto' });

    // Start/stop boomerang video when entering/leaving Eventos
    if (eventosBoomerang){
        if (viewKey === 'eventos') eventosBoomerang.start();
        else eventosBoomerang.stop();
    }
}

function setActiveNav(viewKey) {
    const activeHash = `#${viewKey}`;
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === activeHash);
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const burgerBtn = document.getElementById('burgerBtn');

    if (mobileMenu) mobileMenu.classList.toggle('active');
    if (burgerBtn) burgerBtn.classList.toggle('active');
}

function moveGallery(direction) {
    const track = document.getElementById('eventsGalleryTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.gallery-card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = 18;

    galleryIndex += direction;

    if (galleryIndex < 0) galleryIndex = cards.length - 1;
    if (galleryIndex >= cards.length) galleryIndex = 0;

    const scrollAmount = galleryIndex * (cardWidth + gap);
    track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
}


// ============================================
// CAROUSEL
// ============================================
function moveCarousel(carouselName, direction) {
    const carousel = document.getElementById(`${carouselName}Carousel`);
    const track = carousel.querySelector('.carousel-track');
    const cards = track.querySelectorAll('.story-card');
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem
    
    currentCarouselIndex[carouselName] += direction;
    
    // Loop carousel
    if (currentCarouselIndex[carouselName] < 0) {
        currentCarouselIndex[carouselName] = cards.length - 1;
    } else if (currentCarouselIndex[carouselName] >= cards.length) {
        currentCarouselIndex[carouselName] = 0;
    }
    
    const scrollAmount = currentCarouselIndex[carouselName] * (cardWidth + gap);
    track.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}


// ============================================
// TELEINFORMA FILTERS
// ============================================
function initTeleinformaFilters(){
    const section = document.querySelector('.section-community');
    const filterBar = section ? section.querySelector('.news-filters') : null;
    const featureEl = document.getElementById('teleFeature');
    const listEl = document.getElementById('teleList');
    const prevBtn = document.getElementById('telePrev');
    const nextBtn = document.getElementById('teleNext');

    if (!filterBar || !featureEl || !listEl) return;

    const buttons = Array.from(filterBar.querySelectorAll('.news-filter-btn'));

    let currentFilter = 'todo';
    let featuredIndex = 0;
    let rotationTimer = null;
    let paused = false;

    const esc = (s) => String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const filteredItems = () => {
        const list = TELEINFORMA_ITEMS.slice();
        if (currentFilter === 'todo') return list;
        return list.filter(x => x.type === currentFilter);
    };

    const setActiveButton = (filter) => {
        buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === filter));
    };

    const renderFeature = (item) => {
        featureEl.innerHTML = `
            <div class="tele-feature-media">
                <img src="${esc(item.image)}" alt="${esc(item.title)}">
            </div>
            <div class="tele-feature-body">
                <div class="tele-meta">
                    <span class="tele-kicker">${esc(item.cat)}</span>
                    <span class="tele-dot">•</span>
                    <span class="tele-date">${esc(item.date)}</span>
                </div>
                <h3 class="tele-title">${esc(item.title)}</h3>
                <p class="tele-excerpt">${esc(item.excerpt)}</p>
                <span class="tele-cta">Abrir →</span>
            </div>
        `;
        featureEl.onclick = () => openNewsModal(item.id);
        featureEl.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openNewsModal(item.id);
            }
        };
    };

    const renderList = (items) => {
        listEl.innerHTML = items.map((it, idx) => `
            <div class="tele-list-item ${idx === featuredIndex ? 'active' : ''}" data-index="${idx}" data-id="${it.id}">
                <div class="tele-mini">
                    <div class="tele-thumb"><img src="${esc(it.image)}" alt="${esc(it.title)}"></div>
                    <div class="tele-mini-body">
                        <div class="tele-mini-meta">
                            <span class="tele-mini-cat">${esc(it.cat)}</span>
                            <span class="tele-mini-date">${esc(it.date)}</span>
                        </div>
                        <div class="tele-mini-title">${esc(it.title)}</div>
                    </div>
                </div>
                <button class="tele-open-btn" type="button" data-open-id="${it.id}" aria-label="Abrir">→</button>
            </div>
        `).join('');
    };

    const render = (resetFeatured = false) => {
        const items = filteredItems();
        if (items.length === 0){
            featureEl.innerHTML = `<div class="tele-empty">No hay publicaciones para este filtro.</div>`;
            listEl.innerHTML = '';
            return;
        }

        if (resetFeatured){
            // Para que no salga siempre TELCON, elegimos un índice pseudo-aleatorio estable por día.
            featuredIndex = (new Date().getDate() % items.length);
        }
        featuredIndex = Math.max(0, Math.min(featuredIndex, items.length - 1));

        renderFeature(items[featuredIndex]);
        renderList(items);
    };

    const stepFeatured = (dir) => {
        const items = filteredItems();
        if (items.length === 0) return;
        featuredIndex = (featuredIndex + dir + items.length) % items.length;
        render(false);
    };

    const startRotation = () => {
        stopRotation();
        rotationTimer = setInterval(() => {
            if (paused) return;
            if (document.hidden) return;
            stepFeatured(+1);
        }, 8000);
    };

    const stopRotation = () => {
        if (rotationTimer) clearInterval(rotationTimer);
        rotationTimer = null;
    };

    // Filters
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            currentFilter = filter || 'todo';
            setActiveButton(currentFilter);
            render(true);
            startRotation();
        });
    });

    // List interactions: click cambia destacada; flecha abre modal.
    listEl.addEventListener('click', (e) => {
        const openBtn = e.target.closest('[data-open-id]');
        if (openBtn){
            e.stopPropagation();
            const id = Number(openBtn.getAttribute('data-open-id'));
            openNewsModal(id);
            return;
        }
        const item = e.target.closest('.tele-list-item');
        if (!item) return;
        const idx = Number(item.getAttribute('data-index'));
        if (!Number.isFinite(idx)) return;
        featuredIndex = idx;
        paused = true;
        render(false);
        // Reanuda rotación luego de un rato
        setTimeout(() => { paused = false; }, 12000);
    });

    // Prev/Next
    if (prevBtn) prevBtn.addEventListener('click', () => { paused = true; stepFeatured(-1); setTimeout(() => { paused = false; }, 12000); });
    if (nextBtn) nextBtn.addEventListener('click', () => { paused = true; stepFeatured(+1); setTimeout(() => { paused = false; }, 12000); });

    // Pause on hover
    section.addEventListener('mouseenter', () => { paused = true; });
    section.addEventListener('mouseleave', () => { paused = false; });

    // First render
    setActiveButton(currentFilter);
    render(true);
    startRotation();
}


// ============================================
// RESOURCES FILTERS + SEARCH
// ============================================
function initResourcesFilters(){
    const layout = document.querySelector('.resources-layout');
    if (!layout) return;

    const panel = document.getElementById('resourcesPanel');
    const searchInput = document.getElementById('resourceSearch');
    const buttons = Array.from(layout.querySelectorAll('.resources-sidebar .cat-btn'));

    if (!panel) return;

    // La propiedad `folder` debe coincidir con el nombre real de la carpeta en SharePoint.
    // Nunca se usa el Drive general como reemplazo: cada curso genera su propia ruta.
    const CURRICULUM = {
        1: [
            { code: 'BAE01', name: 'Actividades Extracurriculares', folder: 'BAE01 Actividades Extracurriculares' },
            { code: 'BFI01', name: 'Física I', folder: 'BFI01 Física 1' },
            { code: 'BIC01', name: 'Introducción a la Computación', folder: 'BIC01 Introducción a la Computación' },
            { code: 'BMA01', name: 'Cálculo Diferencial (Cálculo I)', folder: 'BMA01 Cálculo Diferencial' },
            { code: 'BMA03', name: 'Álgebra Lineal', folder: 'BMA03 Álgebra Lineal' },
            { code: 'BRN01', name: 'Realidad Nacional, Constitución y DD.HH.', folder: 'BRN01 Realidad Nacional, Constitución y DD.HH.' },
            { code: 'CBS01', name: 'Fundamentos de Programación', folder: 'CBS01 Fundamentos de Programación' }
        ],
        2: [
            { code: 'BFI05', name: 'Fundamentos de Ing. Térmica y de Fluidos', folder: 'BFI05 Fundamentos de Ing. Térmica y de Fluidos' },
            { code: 'BMA02', name: 'Cálculo Integral (Cálculo II)', folder: 'BMA02 Cálculo Integral' },
            { code: 'BMA09', name: 'Algoritmos y Estructuras de Datos I', folder: 'BMA09 Algoritmos y Estructuras de Datos I' },
            { code: 'BQU01', name: 'Química I', folder: 'BQU01 Química I' },
            { code: 'BRC01', name: 'Redacción y Comunicación', folder: 'BRC01 Redacción y Comunicación' },
            { code: 'CBS02', name: 'Sistemas Operativos I', folder: 'CBS02 Sistemas Operativos I' }
        ],
        3: [
            { code: 'BEG01', name: 'Economía General', folder: 'BEG01 Economía General' },
            { code: 'BFI03', name: 'Fundamentos de Electricidad, Magnetismo y Óptica', folder: 'BFI03 Fundamentos de Electricidad, Magnetismo y Óptica' },
            { code: 'BMA05', name: 'Ecuaciones Diferenciales', folder: 'BMA05 Ecuaciones Diferenciales' },
            { code: 'BMA10', name: 'Probabilidades y Estadística', folder: 'BMA10 Probabilidades y Estadística' },
            { code: 'BMA15', name: 'Programación Orientada a Objetos', folder: 'BMA15 Programación Orientada a Objetos' },
            { code: 'EE306', name: 'Electrotecnia e Instalación de Redes', folder: 'EE306 Electrotecnia e Instalación de Redes' }
        ],
        4: [
            { code: 'BEF01', name: 'Ética y Filosofía Política', folder: 'BEF01 Ética y Filosofía Política' },
            { code: 'BIE01', name: 'Idioma Extranjero / Lengua Nativa (Intermedio)', folder: 'BIE01 Idioma Extranjero Lengua Nativa (Intermedio)' },
            { code: 'BMA07', name: 'Cálculo Vectorial', folder: 'BMA07 Cálculo Vectorial' },
            { code: 'BMA18', name: 'Métodos Numéricos', folder: 'BMA18 Métodos Numéricos' },
            { code: 'CBN01', name: 'Redes de Datos I', folder: 'CBN01 Redes de Datos I' },
            { code: 'EE320', name: 'Circuitos Eléctricos I', folder: 'EE320 Circuitos Eléctricos I' },
            { code: 'EE410', name: 'Análisis de Señales y Sistemas', folder: 'EE410 Análisis de Señales y Sistemas' }
        ],
        5: [
            { code: 'BMA22', name: 'Procesos Estocásticos y Teoría de la Información', folder: 'BMA22 Procesos Estocásticos y Teoría de la Información' },
            { code: 'CBS05', name: 'Inteligencia Artificial I', folder: 'CBS05 Inteligencia Artificial I' },
            { code: 'EE428', name: 'Laboratorio de Electrónica I', folder: 'EE428 Laboratorio de Electrónica I' },
            { code: 'EE522', name: 'Electromagnetismo I', folder: 'EE522 Electromagnetismo I' },
            { code: 'TLN01', name: 'Enrutamiento y Conmutación de Redes de Datos', folder: 'TLN01 Enrutamiento y Conmutación de Redes de Datos' },
            { code: 'TLR01', name: 'Dispositivos de Radiofrecuencia', folder: 'TLR01 Dispositivos de Radiofrecuencia' }
        ],
        6: [
            { code: 'EE430', name: 'Sistemas de Comunicaciones I', folder: 'EE430 Sistemas de Comunicaciones I' },
            { code: 'EE458', name: 'Laboratorio de Electrónica II', folder: 'EE458 Laboratorio de Electrónica II' },
            { code: 'EE588', name: 'Electromagnetismo II', folder: 'EE588 Electromagnetismo II' },
            { code: 'EE604', name: 'Introducción a Microcontroladores', folder: 'EE604 Introducción a Microcontroladores' },
            { code: 'TLN02', name: 'Seguridad de Redes Empresariales', folder: 'TLN02 Seguridad de Redes Empresariales' },
            { code: 'TLR02', name: 'Circuitos de Radiofrecuencia', folder: 'TLR02 Circuitos de Radiofrecuencia' }
        ]
    };

    const SHAREPOINT = {
        origin: 'https://unipe-my.sharepoint.com/shared',
        list: '/personal/junior_veli_m_uni_pe/Documents',
        root: '/personal/junior_veli_m_uni_pe/Documents/TODOS LOS DRIVES FIEE UNI',
        viewId: '11c011a6-3222-42ed-be06-dd0779352257',
        cycleFolders: {
            1: 'Drive 1er Ciclo',
            2: 'Drive 2do Ciclo',
            3: 'Drive 3er Ciclo',
            4: 'Drive 4to Ciclo',
            5: 'Drive 5to Ciclo',
            6: 'Drive 6to Ciclo'
        }
    };

    let cycle = 1;

    function getCourseDriveUrl(cycleNum, course){
        const cycleFolder = SHAREPOINT.cycleFolders[cycleNum];
        if (!cycleFolder || !course.folder) return '';

        const folderPath = `${SHAREPOINT.root}/${cycleFolder}/${course.folder}`;
        return `${SHAREPOINT.origin}?id=${encodeURIComponent(folderPath)}&listurl=${encodeURIComponent(SHAREPOINT.list)}&viewid=${encodeURIComponent(SHAREPOINT.viewId)}`;
    }

    function renderCycle(cycleNum, query=''){
        const q = (query || '').trim().toLowerCase();
        const list = (CURRICULUM[cycleNum] || []).filter(c => {
            if (!q) return true;
            return (`${c.code} ${c.name}`.toLowerCase()).includes(q);
        });

        panel.innerHTML = `
            <div class="resources-headrow">
                <h3>${cycleNum}.º ciclo</h3>
                <span class="muted">${list.length} curso(s)</span>
            </div>
            <div class="courses-grid">
                ${list.map(c => {
                    const courseUrl = getCourseDriveUrl(cycleNum, c);
                    return `
                    <a class="course-card" href="${courseUrl}" target="_blank" rel="noopener" aria-label="Abrir la carpeta de ${c.name} en Drive">
                        <div class="course-code">${c.code}</div>
                        <div class="course-name">${c.name}</div>
                        <div class="course-cta">Abrir carpeta del curso ↗</div>
                    </a>
                `}).join('')}
            </div>
        `;
    }

    function render(){
        const q = searchInput ? searchInput.value : '';
        renderCycle(cycle, q);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cycle = parseInt(btn.getAttribute('data-cycle'), 10);

            render();
        });
    });

    if (searchInput){
        searchInput.addEventListener('input', render);
    }

    render();
}

// ============================================
// CALENDAR
// ============================================
function initCalendar() {
    const calendar = document.getElementById('calendarWidget');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    renderCalendar(calendar, currentMonth, currentYear);
}

function renderCalendar(container, month, year) {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    let html = `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <button onclick="changeMonth(-1)" style="padding: 8px; background: #F6F7F9; border-radius: 4px; font-weight: 600;">‹</button>
                <h4 style="margin: 0; font-size: 1.1rem;">${monthNames[month]} ${year}</h4>
                <button onclick="changeMonth(1)" style="padding: 8px; background: #F6F7F9; border-radius: 4px; font-weight: 600;">›</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center;">
                <div style="font-family: Montserrat; font-size: 13px; font-weight: 600; color: #667085; padding: 8px;">D</div>
                <div style="font-family: Montserrat; font-size: 13px; font-weight: 600; color: #667085; padding: 8px;">L</div>
                <div style="font-family: Montserrat; font-size: 13px; font-weight: 600; color: #667085; padding: 8px;">M</div>
                <div style="font-family: Montserrat; font-size: 13px; font-weight: 600; color: #667085; padding: 8px;">M</div>
                <div style="font-family: Montserrat; font-size: 13px; font-weight: 600; color: #667085; padding: 8px;">J</div>
                <div style="font-family: Montserrat; font-size: 13px; font-weight: 600; color: #667085; padding: 8px;">V</div>
                <div style="font-family: Montserrat; font-size: 13px; font-weight: 600; color: #667085; padding: 8px;">S</div>
    `;
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div style="padding: 8px;"></div>';
    }
    
    // Calendar days
    const today = new Date();
    const eventDays = [15, 20, 25, 28]; // Days with events
    
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const hasEvent = eventDays.includes(day);
        
        let dayStyle = 'padding: 8px; border-radius: 4px; font-family: Montserrat; cursor: pointer; transition: all 0.2s;';
        
        if (isToday) {
            dayStyle += 'background: linear-gradient(135deg, #7A1F2B 0%, #4A0F18 100%); color: white; font-weight: 700;';
        } else if (hasEvent) {
            dayStyle += 'background: rgba(122, 31, 43, 0.1); color: #7A1F2B; font-weight: 600;';
        }
        
        html += `<div style="${dayStyle}" onmouseover="this.style.background='#F6F7F9'" onmouseout="this.style.background='${isToday ? 'linear-gradient(135deg, #7A1F2B 0%, #4A0F18 100%)' : hasEvent ? 'rgba(122, 31, 43, 0.1)' : 'transparent'}'">${day}</div>`;
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

function changeMonth(delta) {
    currentCalendarMonth += delta;
    
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    } else if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    
    const calendar = document.getElementById('calendarWidget');
    renderCalendar(calendar, currentCalendarMonth, currentCalendarYear);
}

// ============================================
// EVENT FILTERS
// ============================================
function filterEvents(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const events = document.querySelectorAll('.event-item');
    
    // Update active filter
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter events
    events.forEach(event => {
        if (category === 'todos' || event.dataset.category === category) {
            event.style.display = 'grid';
        } else {
            event.style.display = 'none';
        }
    });
}

// ============================================
// TABS
// ============================================
function switchTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ============================================
// CONVOCATORIA MODAL
// ============================================
function openConvocatoriaModal(preselectAreaKey = null) {
    const modal = document.getElementById('convocatoriaModal');
    if (!modal) return;

    modal.classList.add('active');

    // Always start at step 1 (datos personales)
    currentFormStep = 1;
    updateFormStep();

    // Optional: preselect area of interest (when user clicks "Postular" from Sobre Nosotros)
    if (preselectAreaKey) {
        const areaRadio = modal.querySelector(`input[name="area"][value="${preselectAreaKey}"]`);
        if (areaRadio) areaRadio.checked = true;

        // Subtle hint message (non-intrusive)
        const hint = modal.querySelector('#preselectHint');
        if (hint) {
            const areaLabel = modal.querySelector(`input[name="area"][value="${preselectAreaKey}"]`)?.closest('label')?.innerText?.trim();
            hint.textContent = areaLabel ? `Área preseleccionada: ${areaLabel}` : 'Área preseleccionada.';
            hint.classList.add('active');
        }
    }
}


function closeConvocatoriaModal() {
    document.getElementById('convocatoriaModal').classList.remove('active');
}

function initConvocatoriaForm() {
    const form = document.getElementById('convocatoriaForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit();
        });
    }
}

function nextFormStep() {
    if (currentFormStep < totalFormSteps) {
        // Validate current step
        const currentSection = document.querySelector(`.form-section[data-section="${currentFormStep}"]`);
        const requiredInputs = currentSection.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim() && input.type !== 'radio') {
                isValid = false;
                input.style.borderColor = '#EF4444';
            } else if (input.type === 'radio') {
                const radioGroup = currentSection.querySelectorAll(`[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    isValid = false;
                }
            } else {
                input.style.borderColor = '#E4E7EC';
            }
        });
        
        if (isValid) {
            currentFormStep++;
            updateFormStep();
        } else {
            alert('Por favor completa todos los campos requeridos');
        }
    }
}

function prevFormStep() {
    if (currentFormStep > 1) {
        currentFormStep--;
        updateFormStep();
    }
}

function updateFormStep() {
    // Update stepper
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= currentFormStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.querySelector(`.form-section[data-section="${currentFormStep}"]`).classList.add('active');
    
    // Update buttons
    const prevBtn = document.querySelector('.form-actions .btn-secondary');
    const nextBtn = document.querySelector('.form-actions .btn-primary[onclick="nextFormStep()"]');
    const submitBtn = document.querySelector('.form-actions .btn-primary[type="submit"]');
    
    if (currentFormStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    if (currentFormStep === totalFormSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function handleFormSubmit() {
    const formData = new FormData(document.getElementById('convocatoriaForm'));
    
    // Show loading state
    const submitBtn = document.querySelector('.form-actions .btn-primary[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert('¡Postulación enviada con éxito! Te contactaremos pronto.');
        closeConvocatoriaModal();
        document.getElementById('convocatoriaForm').reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        currentFormStep = 1;
        updateFormStep();
    }, 1500);
}

// ============================================
// MODALS (Generic)
// ============================================
function openStoryModal(storyId) {
    // In a real implementation, this would open a modal with full story content
    alert(`Abriendo entrevista #${storyId}. En producción, esto abriría un modal con el contenido completo.`);
}

const AREA_INFO = {
        direccion: {
            title: 'Dirección Ejecutiva',
            description: 'Lidera la gestión estratégica del CCT y coordina el trabajo de todas las áreas.',
            director: 'Jorge Cordova M. (Presidente) · Johann Rios S. (Vicepresidente)',
            activities: [
                'Planificación estratégica anual',
                'Coordinación con autoridades y aliados',
                'Supervisión de áreas y proyectos',
                'Gestión de convenios institucionales'
            ],
            howToJoin: 'Postula en “Sobre Nosotros → Convocatorias” y selecciona Dirección Ejecutiva / Soporte.'
        },
        secretaria: {
            title: 'Secretaría General',
            description: 'Soporte operativo del CCT: organización interna, documentación y coordinación.',
            director: 'Fernando Flores Q.',
            activities: [
                'Actas y documentos internos',
                'Coordinación de reuniones',
                'Gestión de membresía y asistencia',
                'Soporte logístico general'
            ],
            howToJoin: 'Postula en Convocatorias y elige Secretaría General.'
        },
        relaciones: {
            title: 'Relaciones Públicas',
            description: 'Difusión institucional, comunicación externa, Teleinforma y cobertura.',
            director: 'Alexandra Cornejo Q.',
            activities: [
                'Teleinforma (noticias y comunicados)',
                'Entrevistas (Historias que inspiran)',
                'Relación con invitados y aliados',
                'Cobertura de eventos (foto/video)'
            ],
            howToJoin: 'Postula en Convocatorias y selecciona Relaciones Públicas.'
        },
        marketing: {
            title: 'Marketing',
            description: 'Marca CCT, campañas y contenido visual para redes y eventos.',
            director: 'Kevin Huaripata C.',
            activities: [
                'Diseño de piezas gráficas',
                'Gestión de redes sociales',
                'Campañas de convocatoria y eventos',
                'Estrategia de marca y posicionamiento'
            ],
            howToJoin: 'Postula en Convocatorias y selecciona Marketing.'
        },
        finanzas: {
            title: 'Economía y Finanzas',
            description: 'Presupuesto, gastos, auspicios y rendición de cuentas.',
            director: 'Eliane Antara G.',
            activities: [
                'Presupuestos por actividad',
                'Gestión de auspicios y fondos',
                'Control de gastos y caja',
                'Rendición y reportes'
            ],
            howToJoin: 'Postula en Convocatorias y selecciona Economía y Finanzas.'
        },
        asuntos: {
            title: 'Asuntos Académicos',
            description: 'Coordina academias, cursos del CCT y apoyo académico.',
            director: 'Patrick Vela C.',
            activities: [
                'Academia Cisco & Huawei',
                'Cursos y capacitaciones CCT',
                'Asesorías/tutorías',
                'Planificación y seguimiento académico'
            ],
            howToJoin: 'Postula en Convocatorias y selecciona Asuntos Académicos.'
        },
        capacitacion: {
            title: 'Programas de Capacitación Tecnológica',
            description: 'Talleres prácticos, laboratorios y actividades técnicas.',
            director: 'Andy Reyna S.',
            activities: [
                'Talleres técnicos y hands-on',
                'Laboratorios y demos',
                'Actividades de extensión',
                'Soporte técnico a eventos'
            ],
            howToJoin: 'Postula en Convocatorias y selecciona Capacitación Tecnológica.'
        },
        proyectos: {
            title: 'Proyectos e Investigación',
            description: 'Proyectos, prototipos e investigación aplicada en telecom y redes.',
            director: 'María Evangelista A.',
            activities: [
                'Prototipos y demos',
                'Proyectos de redes/telecom',
                'Investigación aplicada',
                'Documentación técnica'
            ],
            howToJoin: 'Postula en Convocatorias y selecciona Proyectos e Investigación.'
        },
        cisco: {
            title: 'Academia Local Cisco',
            description: 'Soporte a NetAcad, cohorts, badges y seguimiento a participantes.',
            director: 'Juan Pizarro E.',
            activities: [
                'Gestión de cohorts NetAcad',
                'Soporte a estudiantes e instructores',
                'Seguimiento a badges/certificaciones',
                'Coordinación con la academia'
            ],
            howToJoin: 'Postula en Convocatorias y selecciona Academia Local Cisco.'
        }
};

const BOARD_MEMBERS = {
    jorge:    { name: 'Jorge Cordova M.',        role: 'Presidente',                 areaKey: 'direccion',   areaLabel: 'Dirección Ejecutiva',            photo: 'assets/team/jorge.png' },
    johann:   { name: 'Johann Rios S.',          role: 'Vicepresidente',             areaKey: 'direccion',   areaLabel: 'Dirección Ejecutiva',            photo: 'assets/team/johann.png' },
    fernando: { name: 'Fernando Flores Q.',      role: 'Secretario General',         areaKey: 'secretaria',  areaLabel: 'Secretaría General',             photo: 'assets/team/fernando.png' },
    alexandra:{ name: 'Alexandra Cornejo Q.',    role: 'Dir. Relaciones Públicas',   areaKey: 'relaciones',  areaLabel: 'Relaciones Públicas',            photo: 'assets/team/alexandra.png' },
    eliane:   { name: 'Eliane Antara G.',        role: 'Dir. Economía y Finanzas',   areaKey: 'finanzas',    areaLabel: 'Economía y Finanzas',            photo: 'assets/team/eliane.png' },
    kevin:    { name: 'Kevin Huaripata C.',      role: 'Dir. Marketing',             areaKey: 'marketing',   areaLabel: 'Marketing',                      photo: 'assets/team/kevin.png' },
    patrick:  { name: 'Patrick Vela C.',         role: 'Dir. Asuntos Académicos',    areaKey: 'asuntos',     areaLabel: 'Asuntos Académicos',             photo: 'assets/team/patrick.png' },
    andy:     { name: 'Andy Reyna S.',           role: 'Dir. Capacitación Tecnológica', areaKey: 'capacitacion', areaLabel: 'Programas de Capacitación',     photo: 'assets/team/andy.png' },
    maria:    { name: 'María Evangelista A.',    role: 'Dir. Proyectos e Investigación', areaKey: 'proyectos', areaLabel: 'Proyectos e Investigación',      photo: 'assets/team/maria.png' },
    juan:     { name: 'Juan Pizarro E.',         role: 'Rep. Academia Local Cisco',  areaKey: 'cisco',       areaLabel: 'Academia Local Cisco',           photo: 'assets/team/juan.png' }
};

function initBoardMemberPhotos(){
    const cards = document.querySelectorAll('.board-card-v2');
    if (!cards || cards.length === 0) return;

    cards.forEach((card) => {
        const onclick = card.getAttribute('onclick') || '';
        const match = onclick.match(/openMemberModal\('([^']+)'\)/);
        const key = match ? match[1] : null;
        if (!key || !BOARD_MEMBERS[key] || !BOARD_MEMBERS[key].photo) return;

        const photoBox = card.querySelector('.board-photo-placeholder');
        if (!photoBox) return;

        photoBox.style.backgroundImage = `url('${BOARD_MEMBERS[key].photo}')`;
        photoBox.classList.add('has-photo');
        photoBox.setAttribute('title', BOARD_MEMBERS[key].name);
        photoBox.setAttribute('aria-label', `Foto de ${BOARD_MEMBERS[key].name}`);
    });
}


function openAreaModal(areaKey) {

    const info = AREA_INFO[areaKey];
    if (!info) return;

    const activitiesHTML = info.activities.map(a => `<li>${a}</li>`).join('');
    const bodyHTML = `
        <p class="modal-lead">${info.description}</p>
        <div class="modal-meta">
            <div><strong>Encargado(a):</strong> ${info.director}</div>
        </div>
        <h3 class="modal-subtitle">Actividades</h3>
        <ul class="modal-list">${activitiesHTML}</ul>
        <div class="modal-callout"><strong>¿Cómo unirte?</strong> ${info.howToJoin}</div>
    `;

    openDynamicModal('areaModal', info.title, bodyHTML);
}

function openMemberModal(memberKey){
    const member = BOARD_MEMBERS[memberKey];
    if (!member) return;

    const area = AREA_INFO[member.areaKey] || {};
    const initials = (member.name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();

    const photo = (member.photo && member.photo.trim())
        ? `<img src="${member.photo}" alt="${member.name}">`
        : '';

    const activitiesHTML = (area.activities && area.activities.length)
        ? area.activities.map(a => `<li>${a}</li>`).join('')
        : `<li>Actividades del área por definir.</li>`;

    const howToJoin = area.howToJoin || 'Revisa la sección de Convocatorias y postula al área correspondiente.';
    const director = area.director || member.name;

    const body = `
        <div class="member-profile">
            <div class="member-photo">
                ${photo}
                <div class="member-initials">${initials || 'CCT'}</div>
            </div>

            <div class="member-info">
                <h3>${member.name}</h3>

                <div class="member-meta">
                    <span class="member-badge">${member.role}</span>
                    <span class="member-badge alt">${member.areaLabel}</span>
                </div>

                <p class="member-desc">${area.description || 'Miembro de la Junta Directiva del CCT-UNI.'}</p>

                <div class="member-area-card">
                    <div class="member-area-head">
                        <div class="member-area-title">Información del área</div>
                        <div class="member-area-director"><strong>Encargado(a):</strong> ${director}</div>
                    </div>

                    <div class="member-subtitle">Actividades del área</div>
                    <ul class="member-list">${activitiesHTML}</ul>

                    <div class="member-callout">
                        <strong>¿Cómo unirte?</strong>
                        <span>${howToJoin}</span>
                    </div>
                </div>

                <div class="member-actions">
                    <button class="btn-primary btn-pill" type="button" onclick="closeDynamicModal('memberModal')">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;

    const meta = `<p style="margin-top:8px;color:var(--gray-text);font-weight:600">${member.role} • ${member.areaLabel}</p>`;
    // Modal más ancho que alto (mejor proporción visual para perfil)
    openDynamicModal('memberModal', 'Perfil del miembro', body, meta, 'modal-profile');
}

function closeAreaModal() {
    const modal = document.getElementById('areaModal');
    if (modal) {
        modal.remove();
    }

}

function openInterviewModal(id){
    const data = {
        1: {kicker:'EGRESADO', title:'De la UNI a redes core', who:'Egresado CCT (placeholder)', body:'Hablamos sobre rutas de certificación, proyectos que sí suman y cómo prepararte para entrevistas técnicas.'},
        2: {kicker:'ESTUDIANTE', title:'Mi primer laboratorio en GNS3', who:'Estudiante CCT (placeholder)', body:'Cómo planificar un lab, documentar tu trabajo y aprender más rápido con feedback.'},
        3: {kicker:'COMUNIDAD', title:'Aprender con equipo', who:'Mentores CCT (placeholder)', body:'Mentorías, retos, disciplina y comunidad: lo que te acelera cuando recién empiezas.'}
    };
    const item = data[id];
    if (!item) return;

    const meta = `<p style="margin-top:8px;color:var(--text-tertiary)"><strong>${item.kicker}</strong> • ${item.who}</p>`;
    const body = `<p style="line-height:1.8;margin:0 0 12px 0;color:var(--text-secondary)">${item.body}</p>
                  <p style="margin:0;color:var(--text-tertiary)">*Contenido placeholder: en producción aquí iría video, fotos y transcripción.</p>
                  <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
                    <a href="#inicio" class="btn-primary btn-pill">Conoce tu carrera</a>
                    <button class="btn-secondary btn-pill" onclick="closeDynamicModal('interviewModal')">Cerrar</button>
                  </div>`;
    openDynamicModal('interviewModal', item.title, body, meta);
}

function openProjectModal(id){
    const data = {
        1: {tag:'SDN / CLOUD', title:'Laboratorio remoto en Azure', body:'VM Ubuntu + GNS3 server + VPN + automatización. Ideal para prácticas 24/7 y demos.'},
        2: {tag:'NETWORKING', title:'Topologías CCNA', body:'Labs guiados: VLAN, STP, OSPF, NAT. Documentación y checklist.'},
        3: {tag:'AUTOMATION', title:'Scripts para redes', body:'Inventario, backups, validación y reportes. Python + Ansible (placeholder).'},
        4: {tag:'TELECOM', title:'Maquetas y demos', body:'LAN/WAN/MAN, routing, seguridad y demostraciones para ferias.'}
    };
    const item = data[id];
    if (!item) return;

    const meta = `<p style="margin-top:8px;color:var(--text-tertiary)"><strong>${item.tag}</strong></p>`;
    const body = `<p style="line-height:1.8;margin:0 0 12px 0;color:var(--text-secondary)">${item.body}</p>
                  <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
                    <a href="#recursos" class="btn-primary btn-pill">Ver recursos</a>
                    <button class="btn-secondary btn-pill" onclick="closeDynamicModal('projectModal')">Cerrar</button>
                  </div>`;
    openDynamicModal('projectModal', item.title, body, meta);
}

function openAsesoriaModal(){
    const body = `
        <p>Este apartado es para <strong>asesorías del CCT</strong> (académicas / orientación / soporte técnico).</p>
        <div class="callout">
            <h4>¿Cómo funciona?</h4>
            <ul class="bullet">
                <li>Describe tu consulta y el tema.</li>
                <li>Indica tu disponibilidad y medio preferido.</li>
                <li>El equipo te responderá con una propuesta de horario.</li>
            </ul>
            <p class="muted">Formulario / link: pendiente de configuración.</p>
        </div>
    `;
    openDynamicModal('asesoriaModal', 'Solicitar asesoría', body);
}

function openTelconContactModal(){
    const body = `
        <p>Este apartado es para <strong>consultas de TELCON</strong> (evento), independiente de la Convocatoria CCT.</p>
        <div class="callout">
            <h4>Contacto</h4>
            <ul class="bullet">
                <li>Correo: <em>(por definir)</em></li>
                <li>Instagram: <strong>@cct_uni_fiee</strong></li>
                <li>Facebook: <strong>/CCTFIEE</strong></li>
            </ul>
        </div>
        <p class="muted">Luego puedes reemplazar esta sección con un link a Google Forms o Drive.</p>
        <div class="modal-actions" style="margin-top:14px;">
            <button class="btn-primary" type="button" onclick="closeDynamicModal('telconContactModal')">Cerrar</button>
        </div>
    `;
    openDynamicModal('telconContactModal', 'Contacto TELCON', body);
}

function openIctInfoModal(){
    const body = `
        <p>Este apartado es para <strong>ICT / Competencias</strong> y actividades de preparación del CCT.</p>
        <div class="callout">
            <h4>¿Qué podrás encontrar?</h4>
            <ul class="bullet">
                <li>Rutas sugeridas (NetAcad / Huawei / labs)</li>
                <li>Sesiones de práctica y mentoría</li>
                <li>Material de estudio y simulacros</li>
            </ul>
        </div>
        <p class="muted">Links reales se integrarán cuando los tengas listos.</p>
        <div class="modal-actions" style="margin-top:14px;">
            <button class="btn-primary" type="button" onclick="closeDynamicModal('ictInfoModal')">Entendido</button>
        </div>
    `;
    openDynamicModal('ictInfoModal', 'ICT & Competencias', body);
}

function openEventVolunteerModal(){
    const body = `
        <p>Esta postulación es para <strong>apoyar eventos</strong> (voluntariado/logística), y es independiente de la convocatoria general del CCT.</p>
        <div class="callout">
            <h4>Qué puedes hacer</h4>
            <ul class="bullet">
                <li>Logística y registro</li>
                <li>Soporte audiovisual</li>
                <li>Coordinación con invitados</li>
                <li>Comunicación y difusión</li>
            </ul>
            <p class="muted">Formulario / link: pendiente de configuración.</p>
        </div>
    `;
    openDynamicModal('eventVolunteerModal', 'Voluntariado para Eventos', body);
}

function openTelconVolunteerModal(){
    const body = `
        <p>Este registro es para <strong>voluntariado/soporte en TELCON</strong> y no debe mezclarse con la convocatoria general del CCT.</p>
        <div class="callout">
            <h4>Opciones típicas</h4>
            <ul class="bullet">
                <li>Registro y acreditación</li>
                <li>Staff de salas</li>
                <li>Logística y producción</li>
                <li>Soporte a ponentes</li>
            </ul>
            <p class="muted">Formulario / link: pendiente de configuración.</p>
        </div>
    `;
    openDynamicModal('telconVolunteerModal', 'Voluntariado TELCON', body);
}
function openEventModal(eventId){
    const data = {
        101: {type:'CHARLA', date:'22 Feb 2026', title:'Introducción a redes core', place:'Auditorio FIEE (placeholder)', desc:'Conceptos clave, roles, rutas y hoja de ruta para empezar.'},
        102: {type:'TALLER', date:'01 Mar 2026', title:'Automatización con Python', place:'Lab CCT (placeholder)', desc:'Scripts para inventario, backups y validación de configuraciones.'},
        103: {type:'FERIA', date:'12 Mar 2026', title:'Expo Telecom UNI', place:'Campus UNI (placeholder)', desc:'Stands, demos y networking con estudiantes y egresados.'}
    };
    const item = data[eventId] || {type:'EVENTO', date:'Próximamente', title:`Evento #${eventId}`, place:'', desc:'Detalles en producción.'};

    const meta = `<p style="margin-top:8px;color:var(--text-tertiary)"><strong>${item.type}</strong> • ${item.date}${item.place ? ' • ' + item.place : ''}</p>`;
    const body = `<p style="line-height:1.8;margin:0 0 12px 0;color:var(--text-secondary)">${item.desc}</p>
                  <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
                    <a href="#eventos" class="btn-primary btn-pill">Ver agenda</a>
                    <button class="btn-secondary btn-pill" onclick="openConvocatoriaModal()">Quiero participar</button>
                    <button class="btn-secondary btn-pill" onclick="closeDynamicModal('eventModal')">Cerrar</button>
                  </div>`;
    openDynamicModal('eventModal', item.title, body, meta);
}

function openNewsModal(newsId){
    const item = TELEINFORMA_ITEMS.find(x => x.id === newsId);
    if (!item) return;

    const meta = `<p style="margin-top:8px;color:var(--text-tertiary)"><strong>${item.cat}</strong> • ${item.date}</p>`;
    const body = `
        <div style="display:grid;grid-template-columns: 1fr;gap:12px">
            <div style="border-radius:14px;overflow:hidden;border:1px solid rgba(0,0,0,0.08)">
                <img src="${item.image}" alt="${item.title}" style="width:100%;height:260px;object-fit:cover;display:block">
            </div>
            <p style="line-height:1.8;margin:0 0 10px 0;color:var(--text-secondary)">${item.body}</p>
            <p style="margin:0;color:var(--text-tertiary)">*Contenido placeholder: aquí irá el artículo completo / link real.</p>
            <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
                <a href="#comunidad" class="btn-primary btn-pill">Volver a Teleinforma</a>
                <button class="btn-secondary btn-pill" onclick="closeDynamicModal('newsModal')">Cerrar</button>
            </div>
        </div>
    `;

    openDynamicModal('newsModal', item.title, body, meta);
}


// ============================================
// DYNAMIC MODAL (news / interviews / projects / events)
// ============================================
function openDynamicModal(modalId, title, bodyHTML, metaHTML = '', containerClass = 'modal-large'){
    // Remove if exists
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modalHTML = `
        <div class="modal-overlay active" id="${modalId}" onclick="if(event.target === this) closeDynamicModal('${modalId}')">
            <div class="modal-container ${containerClass}">
                <button class="modal-close" onclick="closeDynamicModal('${modalId}')">&times;</button>
                <div class="modal-header">
                    <h2>${title}</h2>
                    ${metaHTML}
                </div>
                <div class="modal-body">
                    ${bodyHTML}
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeDynamicModal(modalId){
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
}

// ============================================
// CLOSE MODALS ON OVERLAY CLICK
// ============================================
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// Close modals with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// PERFORMANCE: Debounce for scroll events
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

console.log('CCT-UNI Website Loaded Successfully! 🚀');


// ============================================
// ACADEMIAS: INSCRIPCIONES (FORMULARIO)
// ============================================
const ACADEMY_PROGRAMS = {
  ccna_itn:      { label: 'CCNA 1 · Introduction to Networks', provider: 'Cisco Networking Academy' },
  ccna_srwe:     { label: 'CCNA 2 · Switching, Routing & Wireless Essentials', provider: 'Cisco Networking Academy' },
  ccna_ensa:     { label: 'CCNA 3 · Enterprise Networking, Security & Automation', provider: 'Cisco Networking Academy' },
  ccnp_security: { label: 'CCNP Security', provider: 'Cisco' },
  fortinet_fcp:  { label: 'Fortinet Certified Professional · Secure Networking', provider: 'Fortinet Training Institute' },
};

function initAcademyEnrollments(){
  const overlay = document.getElementById('enrollOverlay');
  const form = document.getElementById('enrollForm');
  if (!overlay || !form) return;

  // Abrir desde botones "Inscribirse"
  document.querySelectorAll('.academy-enroll-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.academy-card');
      const programId = card ? card.getAttribute('data-program') : '';
      openEnrollModal(programId);
    });
  });

  // Cerrar al hacer click fuera del cuadro
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeEnrollModal();
  });

  // Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeEnrollModal();
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()){
      form.reportValidity();
      return;
    }

    const payload = collectEnrollmentPayload();
    saveEnrollment(payload);

    // Mostrar éxito
    const stepForm = document.getElementById('enrollStepForm');
    const stepSuccess = document.getElementById('enrollStepSuccess');
    if (stepForm) stepForm.hidden = true;
    if (stepSuccess) stepSuccess.hidden = false;

    // Nota: el guardado persistente en servidor requiere un backend.
  });
}

function openEnrollModal(programId){
  const overlay = document.getElementById('enrollOverlay');
  const stepForm = document.getElementById('enrollStepForm');
  const stepSuccess = document.getElementById('enrollStepSuccess');
  const titleEl = document.getElementById('enrollTitle');
  const progEl = document.getElementById('enrollProgram');
  const progIdEl = document.getElementById('enrollProgramId');
  const form = document.getElementById('enrollForm');

  if (!overlay || !titleEl || !progEl || !progIdEl || !form) return;

  const meta = ACADEMY_PROGRAMS[programId] || { label: 'Programa', provider: 'CCT' };
  titleEl.textContent = 'Inscribirse';
  progEl.textContent = `Programa: ${meta.label} · ${meta.provider}`;
  progIdEl.value = programId || '';

  // reset UI
  if (stepForm) stepForm.hidden = false;
  if (stepSuccess) stepSuccess.hidden = true;

  form.reset();

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // focus
  const nameInput = document.getElementById('enrollName');
  if (nameInput) setTimeout(() => nameInput.focus(), 50);
}

function closeEnrollModal(){
  const overlay = document.getElementById('enrollOverlay');
  const form = document.getElementById('enrollForm');
  const stepForm = document.getElementById('enrollStepForm');
  const stepSuccess = document.getElementById('enrollStepSuccess');

  if (!overlay) return;

  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');

  if (form) form.reset();
  if (stepForm) stepForm.hidden = false;
  if (stepSuccess) stepSuccess.hidden = true;
}

function collectEnrollmentPayload(){
  const programId = (document.getElementById('enrollProgramId') || {}).value || '';
  const meta = ACADEMY_PROGRAMS[programId] || { label: 'Programa', provider: 'CCT' };

  return {
    timestamp: new Date().toISOString(),
    programId,
    program: meta.label,
    provider: meta.provider,
    name: (document.getElementById('enrollName') || {}).value || '',
    email: (document.getElementById('enrollEmail') || {}).value || '',
    phone: (document.getElementById('enrollPhone') || {}).value || '',
    cycle: (document.getElementById('enrollCycle') || {}).value || '',
    availability: (document.getElementById('enrollAvailability') || {}).value || '',
    notes: (document.getElementById('enrollNotes') || {}).value || ''
  };
}

function saveEnrollment(record){
  const key = 'cct_enrollments';
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(items)) items = [];
  } catch(_){
    items = [];
  }
  items.push(record);
  localStorage.setItem(key, JSON.stringify(items));
}

// ============================================
// CCT EXPERIENCE 2026 — interacciones editoriales
// ============================================
function initCctV2Experience(){
  initCareerExplorer();
  initEditorialAgenda();
  initAcademyOrbit();
  initRevealMotion();

  document.querySelectorAll('[role="button"][tabindex="0"]').forEach((element) => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    });
  });
}

function initCareerExplorer(){
  const output = document.getElementById('careerNodeCopy');
  const nodes = Array.from(document.querySelectorAll('.career-node'));
  if (!output || !nodes.length) return;

  nodes.forEach((node) => {
    const activate = () => {
      nodes.forEach((item) => item.classList.remove('active'));
      node.classList.add('active');
      output.textContent = node.dataset.career || '';
    };
    node.addEventListener('mouseenter', activate);
    node.addEventListener('focus', activate);
    node.addEventListener('click', activate);
  });
}

function initEditorialAgenda(){
  const buttons = Array.from(document.querySelectorAll('[data-agenda-filter]'));
  const items = Array.from(document.querySelectorAll('[data-agenda-category]'));
  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.agendaFilter;
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      items.forEach((item) => {
        const visible = filter === 'todo' || item.dataset.agendaCategory === filter;
        item.hidden = !visible;
      });
    });
  });
}

function initAcademyOrbit(){
  const orbit = document.getElementById('academyOrbit');
  const track = orbit?.querySelector('.academy-orbit-track');
  const cards = track ? Array.from(track.querySelectorAll('.academy-orbit-card')) : [];
  if (!orbit || !track || !cards.length) return;

  let paused = false;
  let activeIndex = 0;
  const move = (direction = 1) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    cards[activeIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  document.querySelectorAll('[data-orbit-dir]').forEach((button) => {
    button.addEventListener('click', () => {
      paused = true;
      move(Number(button.dataset.orbitDir) || 1);
      window.setTimeout(() => { paused = false; }, 7000);
    });
  });

  orbit.addEventListener('mouseenter', () => { paused = true; });
  orbit.addEventListener('mouseleave', () => { paused = false; });
  orbit.addEventListener('focusin', () => { paused = true; });
  orbit.addEventListener('focusout', () => { paused = false; });

  window.setInterval(() => {
    const formationView = document.getElementById('view-formacion');
    if (!paused && !document.hidden && formationView?.classList.contains('active')) move(1);
  }, 4600);
}

function initRevealMotion(){
  const elements = Array.from(document.querySelectorAll('.cct-reveal'));
  if (!elements.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}

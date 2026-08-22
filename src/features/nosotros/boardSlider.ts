import slideOneBase64 from '../../../assets/nosotros-slide-1.b64?raw';
import slideTwoBase64 from '../../../assets/nosotros-slide-2.b64?raw';

const STYLE_ID = 'nosotrosBoardSliderStyles';
const SLIDE_INTERVAL_MS = 5000;

const slideSources = [slideOneBase64, slideTwoBase64].map(
  (content) => `data:image/webp;base64,${content.trim()}`,
);

function ensureStyles() {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    #view-nosotros .about-photo-main {
      min-height: 390px !important;
      aspect-ratio: 16 / 9 !important;
      position: relative !important;
      overflow: hidden !important;
      border-radius: 24px !important;
      background: #10141f !important;
      isolation: isolate !important;
    }

    #view-nosotros .about-photo-main > img,
    #view-nosotros .about-photo-main > .board-collage {
      display: none !important;
    }

    #view-nosotros .board-slider {
      position: absolute !important;
      inset: 0 !important;
      z-index: 0 !important;
      overflow: hidden !important;
      background: #10141f !important;
    }

    #view-nosotros .board-slide {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      object-fit: cover !important;
      object-position: center center !important;
      opacity: 0 !important;
      filter: none !important;
      transform: none !important;
      image-rendering: auto !important;
      transition: opacity .95s ease-in-out !important;
      will-change: opacity !important;
    }

    #view-nosotros .board-slide.is-active {
      opacity: 1 !important;
    }

    #view-nosotros .board-slide:nth-child(2) {
      object-position: center 46% !important;
    }

    #view-nosotros .about-photo-main::after {
      content: '' !important;
      position: absolute !important;
      inset: 0 !important;
      z-index: 1 !important;
      pointer-events: none !important;
      background: linear-gradient(0deg, rgba(6, 9, 15, .28), transparent 30%) !important;
    }

    #view-nosotros .about-photo-main > span {
      position: absolute !important;
      left: 22px !important;
      bottom: 18px !important;
      z-index: 2 !important;
      color: #fff !important;
    }

    @media (max-width: 720px) {
      #view-nosotros .about-photo-main {
        min-height: 250px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #view-nosotros .board-slide {
        transition: none !important;
      }
    }
  `;
}

function preload(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo decodificar una foto de la Junta Directiva.'));
    image.src = src;
  });
}

export async function initBoardSlider() {
  const photoWrap = document.querySelector<HTMLElement>('#view-nosotros .about-photo-main');
  if (!photoWrap || photoWrap.dataset.boardSliderReady === 'true') return;

  ensureStyles();

  try {
    const preloaded = await Promise.all(slideSources.map(preload));

    const previousTimer = Number(photoWrap.dataset.boardSliderTimer || 0);
    if (previousTimer) window.clearInterval(previousTimer);

    photoWrap.querySelector('.board-slider')?.remove();
    photoWrap.querySelector('.board-collage')?.remove();

    const slider = document.createElement('div');
    slider.className = 'board-slider';
    slider.setAttribute('aria-label', 'Fotografías de la Junta Directiva CCT');

    const slides = preloaded.map((sourceImage, index) => {
      const image = document.createElement('img');
      image.className = `board-slide${index === 0 ? ' is-active' : ''}`;
      image.src = sourceImage.src;
      image.alt = index === 0
        ? 'Junta Directiva del Centro Cultural de Telecomunicaciones CCT UNI'
        : 'Integrantes de la Junta Directiva CCT frente a la FIEE UNI';
      image.decoding = 'async';
      slider.appendChild(image);
      return image;
    });

    photoWrap.prepend(slider);
    photoWrap.dataset.boardSliderReady = 'true';

    let activeIndex = 0;
    const timer = window.setInterval(() => {
      slides[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add('is-active');
    }, SLIDE_INTERVAL_MS);

    photoWrap.dataset.boardSliderTimer = String(timer);
  } catch (error) {
    console.error('[CCT] Slider de Junta Directiva:', error);
    // Nunca ocultamos el contenido existente si las fotos no pudieron decodificarse.
  }
}

import type { ReactNode } from 'react';

export type VisualMarqueeItem = {
  image: string;
  title: string;
  eyebrow?: string;
  description?: string;
};

type VisualMarqueeProps = {
  items: VisualMarqueeItem[];
  className?: string;
  renderOverlay?: (item: VisualMarqueeItem) => ReactNode;
};

/**
 * Carrusel visual continuo reutilizable para distintas páginas del CCT.
 * El diseño actual de Conoce tu Carrera sigue usando su capa legacy para
 * conservar exactamente el frontend; este componente deja preparado el patrón
 * para próximas migraciones a JSX puro.
 */
export function VisualMarquee({ items, className = '', renderOverlay }: VisualMarqueeProps) {
  const loop = [...items, ...items];
  return (
    <div className={`visual-marquee ${className}`} aria-label="Carrusel visual">
      <div className="visual-marquee__track">
        {loop.map((item, index) => (
          <figure className="visual-marquee__card" key={`${item.title}-${index}`}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <figcaption>
              {renderOverlay ? renderOverlay(item) : (
                <>
                  {item.eyebrow && <small>{item.eyebrow}</small>}
                  <strong>{item.title}</strong>
                  {item.description && <span>{item.description}</span>}
                </>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

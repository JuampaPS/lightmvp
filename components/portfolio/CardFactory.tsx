/**
 * CardFactory Component
 * 
 * Factory component that renders the appropriate card layout
 * based on the portfolio item configuration.
 * 
 * Layouts:
 * - 'fullscreen': Video or image covering entire card
 * - 'grid-layout': Text + gallery images in responsive grid
 * 
 * Follows the Factory Pattern to decouple card rendering logic
 * from the main portfolio component.
 */

import { PortfolioItem } from '@/data/portfolio-config';

/* --- COMPONENTES AUXILIARES --- */

interface MediaContentProps {
  src?: string;
  type?: 'video' | 'image';
  alt: string;
}

const MediaContent = ({ src, type, alt }: MediaContentProps) => {
  if (!src) return null;
  
  if (type === 'video') {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover rounded-xl"
        aria-label={alt}
      />
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-xl"
      loading="lazy"
      decoding="async"
    />
  );
};

/* --- LAYOUTS --- */

// 1. Fullscreen Layout (Video or image covering entire card)
interface FullscreenLayoutProps {
  item: PortfolioItem;
}

const FullscreenLayout = ({ item }: FullscreenLayoutProps) => {
  if (item.mediaType === 'video' && item.mediaSrc) {
    return (
      <video
        src={item.mediaSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        aria-label={item.title}
      />
    );
  }
  
  if (item.mediaType === 'image' && item.mediaSrc) {
    return (
      <img
        src={item.mediaSrc}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        loading="lazy"
        decoding="async"
      />
    );
  }
  
  return null;
};

// 2. Grid Layout (Text + gallery images in responsive grid)
// Mobile: Column layout (Text top, images below)
// Desktop: 2x2 Grid (Text in one cell, images fill remaining cells)
interface GridLayoutProps {
  item: PortfolioItem;
}

const GridLayout = ({ item }: GridLayoutProps) => {
  return (
    <div className="w-full h-full p-4 md:p-8 overflow-hidden">
      {/* MÓVIL: Flex Column | DESKTOP: Grid 2x2 */}
      <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 w-full h-full gap-2 md:gap-4">
        
        {/* CELDA 1: TEXTO (Siempre visible) */}
        <div className="flex flex-col items-center justify-center text-center p-4">
          {/* Títulos grandes responsive */}
          <h2 
            className="text-4xl md:text-5xl lg:text-7xl font-black italic uppercase leading-none mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item.title.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < item.title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h2>
          
          {/* Subtítulo (SWE-2025, DK-2025) - Fuente Monospace */}
          {item.subtitle && (
            <p className="font-mono text-sm md:text-xl opacity-90 tracking-widest mb-4">
              {item.subtitle}
            </p>
          )}

          {/* Descripción pequeña */}
          {item.description && (
            <p className="font-sans text-xs md:text-sm font-bold uppercase leading-tight max-w-md opacity-80 whitespace-pre-line">
              {item.description}
            </p>
          )}
        </div>

        {/* CELDA 2: IMAGEN 1 */}
        {item.galleryImages?.[0] && (
          <div className="w-full h-full overflow-hidden rounded-xl">
            <MediaContent 
              src={item.galleryImages[0]} 
              type="image" 
              alt={`${item.title} 1`} 
            />
          </div>
        )}

        {/* CELDA 3: IMAGEN 2 */}
        {item.galleryImages?.[1] && (
          <div className="w-full h-full overflow-hidden rounded-xl">
            <MediaContent 
              src={item.galleryImages[1]} 
              type="image" 
              alt={`${item.title} 2`} 
            />
          </div>
        )}

        {/* CELDA 4: IMAGEN 3 (Solo si existe, oculta en móvil) */}
        {item.galleryImages?.[2] && (
          <div className="w-full h-full overflow-hidden rounded-xl hidden md:block">
            <MediaContent 
              src={item.galleryImages[2]} 
              type="image" 
              alt={`${item.title} 3`} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* --- FACTORY --- */

interface CardFactoryProps {
  item: PortfolioItem;
}

/**
 * CardFactory - Renders the appropriate card layout based on item configuration
 * 
 * @param item - Portfolio item configuration
 */
export function CardFactory({ item }: CardFactoryProps) {
  switch (item.layout) {
    case 'fullscreen':
      return <FullscreenLayout item={item} />;
    case 'grid-layout':
    default:
      return <GridLayout item={item} />;
  }
}

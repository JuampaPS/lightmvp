/**
 * CardFactory Component
 * 
 * Factory component that renders the appropriate card layout
 * based on the portfolio item configuration.
 * 
 * Enterprise-grade optimizations:
 * - Next.js Image component for automatic optimization (Web Vitals)
 * - Video poster images for improved LCP
 * - Semantic HTML5 elements for accessibility
 * - Type-safe discriminated unions
 * 
 * Layouts:
 * - 'fullscreen': Video or image covering entire card
 * - 'grid-layout': Text + gallery images in responsive grid
 * 
 * Follows the Factory Pattern to decouple card rendering logic
 * from the main portfolio component.
 */

import Image from 'next/image';
import { FullscreenItem, GridItem, isFullscreenItem, isGridItem } from '@/data/portfolio-config';
import type { PortfolioItem } from '@/data/portfolio-config';

/* --- COMPONENTES AUXILIARES --- */

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/**
 * OptimizedImage - Wrapper around Next.js Image component
 * Optimizes images for Core Web Vitals (LCP, CLS)
 */
const OptimizedImage = ({ src, alt, priority = false, className = '' }: OptimizedImageProps) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover rounded-xl"
        priority={priority}
        quality={85}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
}

/**
 * OptimizedVideo - Video element with poster for LCP optimization
 */
const OptimizedVideo = ({ src, poster, alt, className = '' }: OptimizedVideoProps) => {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={`w-full h-full object-cover ${className}`}
      aria-label={alt}
    />
  );
};

/* --- LAYOUTS --- */

// 1. Fullscreen Layout (Video or image covering entire card)
interface FullscreenLayoutProps {
  item: FullscreenItem;
}

const FullscreenLayout = ({ item }: FullscreenLayoutProps) => {
  if (item.mediaType === 'video') {
    return (
      <OptimizedVideo
        src={item.mediaSrc}
        poster={item.videoPoster}
        alt={item.title}
        className="absolute inset-0"
      />
    );
  }

  if (item.mediaType === 'image') {
    return (
      <div className="absolute inset-0 w-full h-full">
        <OptimizedImage
          src={item.mediaSrc}
          alt={item.title}
          priority={false} // Lazy load fullscreen images by default
          className=""
        />
      </div>
    );
  }

  return null;
};

// 2. Grid Layout (Text + gallery images in responsive grid)
// Mobile: Column layout (Text top, images below)
// Desktop: 2x2 Grid (Text in one cell, images fill remaining cells)
interface GridLayoutProps {
  item: GridItem;
}

const GridLayout = ({ item }: GridLayoutProps) => {
  // First image gets priority for LCP optimization
  const firstImagePriority = true;

  return (
    <article className="w-full h-full p-4 md:p-8 overflow-hidden">
      {/* MÓVIL: Flex Column | DESKTOP: Grid 2x2 */}
      <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 w-full h-full gap-2 md:gap-4">
        
        {/* CELDA 1: TEXTO (Siempre visible) */}
        <header className="flex flex-col items-center justify-center text-center p-4">
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
        </header>

        {/* CELDA 2: IMAGEN 1 */}
        {item.galleryImages[0] && (
          <div className="w-full h-full overflow-hidden rounded-xl relative">
            <OptimizedImage
              src={item.galleryImages[0]}
              alt={`${item.title} - Image 1`}
              priority={firstImagePriority}
            />
          </div>
        )}

        {/* CELDA 3: IMAGEN 2 */}
        {item.galleryImages[1] && (
          <div className="w-full h-full overflow-hidden rounded-xl relative">
            <OptimizedImage
              src={item.galleryImages[1]}
              alt={`${item.title} - Image 2`}
              priority={false}
            />
          </div>
        )}

        {/* CELDA 4: IMAGEN 3 (Solo si existe, oculta en móvil) */}
        {item.galleryImages[2] && (
          <div className="w-full h-full overflow-hidden rounded-xl relative hidden md:block">
            <OptimizedImage
              src={item.galleryImages[2]}
              alt={`${item.title} - Image 3`}
              priority={false}
            />
          </div>
        )}
      </div>
    </article>
  );
};

/* --- FACTORY --- */

interface CardFactoryProps {
  item: PortfolioItem;
}

/**
 * CardFactory - Renders the appropriate card layout based on item configuration
 * 
 * Uses TypeScript type guards for runtime type narrowing
 * 
 * @param item - Portfolio item configuration (Discriminated Union)
 */
export function CardFactory({ item }: CardFactoryProps) {
  // TypeScript narrows the type based on the discriminated union
  if (isFullscreenItem(item)) {
    return <FullscreenLayout item={item} />;
  }

  if (isGridItem(item)) {
    return <GridLayout item={item} />;
  }

  // TypeScript exhaustiveness check - this should never happen
  const _exhaustive: never = item;
  return null;
}

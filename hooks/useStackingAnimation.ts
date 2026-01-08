/**
 * useStackingAnimation Hook
 * 
 * Custom hook that encapsulates all GSAP ScrollTrigger animation logic
 * for the portfolio stacking effect.
 * 
 * Uses gsap.context for proper memory cleanup and useLayoutEffect
 * to prevent FOUC (Flash of Unstyled Content).
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseStackingAnimationProps {
  wrapperRef: React.RefObject<HTMLElement>;
  cardsRef: React.MutableRefObject<HTMLElement[]>;
  totalItems: number;
}

// Animation configuration constants
const ANIMATION_DURATION = 1;
const SCROLL_SCRUB = 0.5; // Smoothness of scroll animation

/**
 * Función para esperar a que todas las imágenes estén cargadas
 * Crítico para producción donde las imágenes tardan más en cargar
 */
const waitForImages = (cards: HTMLElement[]): Promise<void> => {
  return new Promise((resolve) => {
    const images: (HTMLImageElement | HTMLVideoElement)[] = [];
    
    cards.forEach((card) => {
      if (card) {
        // Buscar imágenes Next.js (tienen un wrapper div)
        const nextImageWrappers = card.querySelectorAll('div[style*="position"] img');
        const regularImages = card.querySelectorAll('img:not(div[style*="position"] img)');
        const videos = card.querySelectorAll('video');
        
        nextImageWrappers.forEach((img) => images.push(img as HTMLImageElement));
        regularImages.forEach((img) => images.push(img as HTMLImageElement));
        videos.forEach((video) => images.push(video as HTMLVideoElement));
      }
    });

    if (images.length === 0) {
      resolve();
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        resolve();
      }
    };

    images.forEach((media) => {
      if (media instanceof HTMLImageElement) {
        // Para Next.js Image, verificar si está completo
        if (media.complete && media.naturalHeight !== 0) {
          checkComplete();
        } else {
          media.addEventListener('load', checkComplete, { once: true });
          media.addEventListener('error', checkComplete, { once: true });
        }
      } else if (media instanceof HTMLVideoElement) {
        if (media.readyState >= 2) {
          checkComplete();
        } else {
          media.addEventListener('loadeddata', checkComplete, { once: true });
          media.addEventListener('error', checkComplete, { once: true });
        }
      }
    });

    // Timeout de seguridad para producción (más tiempo que en desarrollo)
    setTimeout(() => {
      resolve();
    }, 5000);
  });
};

/**
 * Custom hook for managing portfolio stacking animations
 * 
 * @param wrapperRef - Reference to the wrapper container element
 * @param cardsRef - Mutable ref array containing all card elements
 * @param totalItems - Total number of portfolio items
 */
export function useStackingAnimation({
  wrapperRef,
  cardsRef,
  totalItems,
}: UseStackingAnimationProps) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Early return if wrapper is not available
    if (!wrapperRef.current) return;
    if (typeof window === 'undefined') return;

    let ctx: gsap.Context | null = null;

    const initAnimation = async () => {
      // Esperar a que todas las cards estén renderizadas
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0 || cards.length !== totalItems) {
        setTimeout(initAnimation, 100);
        return;
      }

      // Esperar a que todas las imágenes estén cargadas (crítico para producción)
      await waitForImages(cards);

      // Esperar un frame adicional para asegurar que el layout esté completo
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve(undefined);
          });
        });
      });

      // Create GSAP context for proper cleanup
      ctx = gsap.context(() => {
        // Create timeline with ScrollTrigger configuration
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: `+=${totalItems * 100}%`, // Duration depends on number of cards
            pin: true, // Pin the container during scroll
            scrub: SCROLL_SCRUB, // Link animation to scroll position
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timelineRef.current = tl;

        // Apply animation to each card (skip first card as it's the base)
        cards.forEach((card, index) => {
          if (!card || index === 0) return; // First card stays in place

          // Set z-index to ensure proper stacking order
          gsap.set(card, { zIndex: index + 1 });

          // Animate card from bottom (yPercent: 100) to position (yPercent: 0)
          tl.fromTo(
            card,
            {
              yPercent: 100, // Start completely below viewport
            },
            {
              yPercent: 0, // Move to final position
              duration: ANIMATION_DURATION,
              ease: 'none', // Linear easing for direct finger response
            }
          );
        });

        // Refrescar ScrollTrigger después de crear la animación
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          // Segundo refresh después de un pequeño delay para producción
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        });
      }, wrapperRef); // Scope GSAP context to wrapper
    };

    // Inicializar con un delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      initAnimation();
    }, typeof window !== 'undefined' && window.document.readyState === 'complete' ? 200 : 600);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (ctx) {
        ctx.revert(); // Revert all GSAP animations and kill ScrollTriggers
      }
    };
  }, [wrapperRef, cardsRef, totalItems]);

  return timelineRef;
}


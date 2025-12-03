"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only register ScrollTrigger on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CommunityHubItem {
  title: string;
  description: string;
  number: string;
  image?: string; // URL de la imagen opcional
}

interface CommunityHubHorizontalScrollProps {
  items: CommunityHubItem[];
  showWhyBunker?: boolean;
}

export function CommunityHubHorizontalScroll({ items, showWhyBunker = true }: CommunityHubHorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sectionRef.current || !containerRef.current) return;
    if (items.length === 0) return;

    const container = containerRef.current;
    const section = sectionRef.current;
    let scrollAnimation: gsap.core.Tween | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    // Wait for cards to be fully rendered
    const initScroll = () => {
      try {
        const cards = cardsRef.current.filter(Boolean);
        
        // Cada item genera 2 cards (texto + imagen), entonces el total debe ser items.length * 2
        const expectedCardsCount = items.length * 2;
        if (cards.length === 0 || cards.length !== expectedCardsCount) {
          setTimeout(initScroll, 100);
          return;
        }

        // Calculate total width needed for horizontal scroll
        let totalWidth = 0;
        cards.forEach((card, index) => {
          if (card) {
            const cardWidth = card.offsetWidth || card.getBoundingClientRect().width || 0;
            if (cardWidth > 0) {
              totalWidth += cardWidth;
              // Sin gaps entre cards para que se vean continuas
            }
          }
        });

        // Sin padding adicional - las cards ocupan toda la pantalla

        if (totalWidth === 0 || totalWidth < window.innerWidth) {
          // If width is 0 or too small, wait a bit more
          setTimeout(initScroll, 100);
          return;
        }

        // Set container width to enable horizontal scroll
        container.style.width = `${totalWidth}px`;

        // Calculate scroll distance
        const scrollDistance = totalWidth - window.innerWidth;

        // Kill existing scroll triggers for this section
        ScrollTrigger.getAll().forEach((trigger) => {
          try {
            if (trigger.trigger === section) {
              trigger.kill();
            }
          } catch (e) {
            // Ignore errors
          }
        });

        // Create horizontal scroll animation
        scrollAnimation = gsap.to(container, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        scrollTriggerInstance = scrollAnimation.scrollTrigger || null;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error initializing horizontal scroll:", error);
        }
      }
    };

    // Initialize after a short delay to ensure layout is complete
    const timeoutId = setTimeout(() => {
      initScroll();
    }, 300);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      try {
        if (scrollAnimation) {
          scrollAnimation.kill();
        }
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
        }
        ScrollTrigger.getAll().forEach((trigger) => {
          try {
            if (trigger.trigger === section) {
              trigger.kill();
            }
          } catch (e) {
            // Ignore errors
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error cleaning up scroll animation:", error);
        }
      }
    };
  }, [items]);

  return (
    <section
      ref={sectionRef}
      className="community-hub-horizontal-scroll relative min-h-screen bg-black overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-center">
        {showWhyBunker && (
          <div className="absolute top-1/2 left-2 sm:left-4 md:left-8 -translate-y-1/2 z-10">
            <div className="text-white text-sm sm:text-base md:text-xl lg:text-2xl font-bold uppercase tracking-wider opacity-70">
              Why Bunker?
            </div>
          </div>
        )}
        
        <div
          ref={containerRef}
          className="flex items-center gap-0 pl-8 sm:pl-12 md:pl-24 pr-4 sm:pr-8 will-change-transform"
          style={{ display: 'flex' }}
        >
          {items.flatMap((item, index) => {
            const cards: JSX.Element[] = [];
            
            // Tarjeta de TEXTO (siempre se crea)
            cards.push(
              <div
                key={`text-${index}`}
                ref={(el) => {
                  if (el) {
                    const cardIndex = index * 2;
                    cardsRef.current[cardIndex] = el;
                  }
                }}
                className="community-hub-card-text flex-shrink-0 w-screen sm:w-[50vw] h-screen bg-gradient-to-br from-neutral-900 to-black flex flex-col justify-between relative overflow-hidden p-4 sm:p-[10px] gap-2 sm:gap-[10px]"
              >
                <div className="relative z-10 flex flex-col justify-between h-full" style={{ paddingTop: '-40px', transform: 'translateY(-80px)' }}>
                  {/* Título principal */}
                  <div className="mt-auto mb-auto">
                    <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0 whitespace-pre-line">
                      {item.title}
                    </h3>
                  </div>
                  
                  {/* Números y descripción */}
                  <div className="flex flex-col gap-3 sm:gap-4" style={{ marginBottom: '-60px', marginTop: '-40px' }}>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-cyan-400 text-xl sm:text-2xl md:text-3xl font-bold">
                        {item.number}
                      </div>
                      <div className="text-neutral-400 text-lg sm:text-xl md:text-2xl font-bold">
                        {String(items.length).padStart(2, '0')}
                      </div>
                    </div>
                    <p className="text-neutral-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xl px-2 sm:px-0">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );

            // Tarjeta de IMAGEN (siempre se crea después del texto)
            const isVideo = item.image?.endsWith('.mp4') || item.image?.endsWith('.webm');
            cards.push(
              <div
                key={`image-${index}`}
                ref={(el) => {
                  if (el) {
                    const cardIndex = index * 2 + 1;
                    cardsRef.current[cardIndex] = el;
                  }
                }}
                className="community-hub-card-image flex-shrink-0 w-screen h-screen relative overflow-hidden"
              >
                {item.image ? (
                  isVideo ? (
                    <video
                      src={item.image}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-black flex items-center justify-center">
                    <div className="text-neutral-400 text-xl">Image {item.number}</div>
                  </div>
                )}
              </div>
            );

            return cards;
          })}
        </div>
      </div>
    </section>
  );
}


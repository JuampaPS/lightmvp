"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioItems } from "@/data/portfolioData";
import { 
  ANIMATION_CONSTANTS, 
  isMobileViewport, 
  getWindowWidth 
} from "@/types/animation";
import {
  getCardClassName,
  getCardBackgroundColor,
  getCardTextColor,
  isGridCard,
  isFullscreenCard,
} from "@/utils/cardHelpers";
import {
  MOBILE_CARD_STYLES,
  DESKTOP_CARD_STYLES,
  FULLSCREEN_CARD_STYLES,
} from "@/constants/cardStyles";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PortfolioStacking Component
 * 
 * Displays a stack of portfolio cards with scroll-linked animations using GSAP ScrollTrigger.
 * Cards animate in sequence: some slide from the right, others from the bottom, creating
 * a stacking effect as the user scrolls.
 * 
 * @component
 */
export function PortfolioStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const cardHeightRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Fallback color palette for cards without specific styling
   */
  const cardColors = [
    "#1565C0", // Blue
    "#303F9F", // Dark blue
    "#C2185B", // Pink/Magenta
    "#F57C00", // Orange
    "#00796B", // Teal
  ] as const;

  /**
   * Cleanup function to properly dispose of GSAP animations and ScrollTrigger
   * Prevents memory leaks by killing all active animations and removing event listeners
   */
  const cleanupAnimations = useCallback(() => {
    // Kill and nullify GSAP timeline
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
    // Kill and nullify ScrollTrigger instance
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
  }, []);

  /**
   * Initialize card animations using GSAP timeline
   * 
   * Sets up the animation sequence for all portfolio cards:
   * - Base cards (index 0) remain static with lowest z-index
   * - Fullscreen cards slide from right (desktop) or bottom (mobile)
   * - Grid cards slide from bottom to stack on top
   * 
   * @remarks
   * This function uses index-based logic. Future refactor should use
   * configuration-based approach for better maintainability.
   * 
   * @see {@link getCardAnimationConfig} for the planned configuration-based approach
   */
  const initCards = useCallback(() => {
    if (!animationRef.current) {
      animationRef.current = gsap.timeline({ paused: true });
    } else {
      animationRef.current.clear();
      animationRef.current.pause();
    }

    if (cards.current.length === 0) return;

    cardHeightRef.current = cards.current[0]?.offsetHeight || 0;

    if (cardHeightRef.current === 0) {
      setTimeout(() => {
        cardHeightRef.current = cards.current[0]?.offsetHeight || 0;
        if (cardHeightRef.current > 0) {
          initCards();
        }
      }, ANIMATION_CONSTANTS.INIT_RETRY_DELAY);
      return;
    }

    const isMobileCheck = isMobileViewport();
    const windowWidth = getWindowWidth();

    cards.current.forEach((card, index) => {
      if (!card) return;
      
      if (index === 0) {
        // Primera tarjeta (NGBG 25): posición inicial visible, z-index más bajo
        gsap.set(card, { 
          x: 0, 
          y: 0,
          zIndex: 1 // z-index: 1 (más bajo)
        });
      } else if (index === 2) {
        // fullpic25 (index 2): aparece desde la derecha (o desde abajo en móvil) con imagen
        // Se apila sobre la primera NGBG 25
        if (isMobileCheck) {
          // En móvil: aparece desde abajo
          gsap.set(card, { 
            y: cardHeightRef.current, // Comenzar desde abajo
            x: 0,
            zIndex: 2
          });
          animationRef.current?.to(
            card,
            {
              y: 0, // Posición final
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            0
          );
        } else {
          // En desktop: aparece desde la derecha
          gsap.set(card, { 
            x: window.innerWidth, // Comenzar completamente fuera de la pantalla a la derecha
            y: 0,
            zIndex: 2 // z-index: 2 (medio, sobre la primera NGBG 25)
          });
          
          // Animar desde la derecha hacia su posición final (x: 0) donde se apila sobre la primera NGBG 25
          // Duración: 0.5 segundos para llegar a la izquierda
          animationRef.current?.to(
            card,
            {
              x: 0, // Posición final: apilada sobre la primera NGBG 25
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            0
          );
        }
      } else if (index === 3) {
        // fullpic24 (index 3): aparece desde la derecha (o desde abajo en móvil) con imagen
        // Se apila sobre NGBG 24 (index 1)
        // Calcular cuándo debe comenzar: después de que NGBG 24 (index 1) termine
        // NGBG 24 termina en: 0.5 (cuando fullpic25 termina) + 0.5 (duración de NGBG 24 stacking) = 1 segundo
        const startTime = ANIMATION_CONSTANTS.BASE_DURATION + (1 * ANIMATION_CONSTANTS.BASE_DURATION); // 1 segundo
        
        if (isMobileCheck) {
          // En móvil: aparece desde abajo
          gsap.set(card, { 
            y: cardHeightRef.current, // Comenzar desde abajo
            x: 0,
            zIndex: index + 1 // z-index: 4
          });
          animationRef.current?.to(
            card,
            {
              y: 0, // Posición final
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime
          );
        } else {
          // En desktop: aparece desde la derecha
          gsap.set(card, { 
            x: window.innerWidth, // Comenzar completamente fuera de la pantalla a la derecha
            y: 0,
            zIndex: index + 1 // z-index: 4 (más alto)
          });
          
          // Animar desde la derecha hacia su posición final (x: 0) donde se apila sobre NGBG 24
          animationRef.current?.to(
            card,
            {
              x: 0, // Posición final: apilada sobre NGBG 24
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime // Comenzar después de que NGBG 24 termine
          );
        }
      } else if (index === 4) {
        // NGBG 25 duplicado (index 4): aparece desde abajo después de fullpic24
        // Se apila sobre fullpic24
        gsap.set(card, { 
          y: cardHeightRef.current, // Comenzar desde abajo
          x: 0,
          zIndex: 5 // z-index: 5
        });
        
        // Calcular cuándo debe comenzar: después de que fullpic24 termine
        // fullpic24 termina en: 1 segundo (startTime) + 0.5 (duración) = 1.5 segundos
        const startTime = ANIMATION_CONSTANTS.BASE_DURATION + (1 * ANIMATION_CONSTANTS.BASE_DURATION) + ANIMATION_CONSTANTS.BASE_DURATION; // 1.5 segundos
        
        animationRef.current?.to(
          card,
          {
            y: 0,
            duration: 0.5,
            ease: "none",
          },
          startTime
        );
      } else if (index === 5) {
        // fullpic25 duplicado (index 5): aparece desde la derecha (o desde abajo en móvil) después de NGBG 25 duplicado
        // Se apila sobre NGBG 25 duplicado
        // Calcular cuándo debe comenzar: después de que NGBG 25 duplicado termine
        // NGBG 25 duplicado termina en: 1.5 + 0.5 = 2 segundos
        const startTime = ANIMATION_CONSTANTS.BASE_DURATION + (1 * ANIMATION_CONSTANTS.BASE_DURATION) + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION; // 2 segundos
        
        if (isMobileCheck) {
          // En móvil: aparece desde abajo
          gsap.set(card, { 
            y: cardHeightRef.current, // Comenzar desde abajo
            x: 0,
            zIndex: 6 // z-index: 6
          });
          animationRef.current?.to(
            card,
            {
              y: 0, // Posición final
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime
          );
        } else {
          // En desktop: aparece desde la derecha
          gsap.set(card, { 
            x: window.innerWidth, // Comenzar completamente fuera de la pantalla a la derecha
            y: 0,
            zIndex: 6 // z-index: 6
          });
          
          animationRef.current?.to(
            card,
            {
              x: 0, // Posición final: apilada sobre NGBG 25 duplicado
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime
          );
        }
      } else if (index === 6) {
        // NGBG 24 duplicado (index 6): aparece desde abajo después de fullpic25 duplicado
        // Se apila sobre fullpic25 duplicado
        gsap.set(card, { 
          y: cardHeightRef.current, // Comenzar desde abajo
          x: 0,
          zIndex: 7 // z-index: 7
        });
        
        // Calcular cuándo debe comenzar: después de que fullpic25 duplicado termine
        // fullpic25 duplicado termina en: 2 + 0.5 = 2.5 segundos
        const startTime = ANIMATION_CONSTANTS.BASE_DURATION + (1 * ANIMATION_CONSTANTS.BASE_DURATION) + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION; // 2.5 segundos
        
        animationRef.current?.to(
          card,
          {
            y: 0,
            duration: 0.5,
            ease: "none",
          },
          startTime
        );
      } else if (index === 7) {
        // fullpic24 duplicado (index 7): aparece desde la derecha (o desde abajo en móvil) después de NGBG 24 duplicado
        // Se apila sobre NGBG 24 duplicado
        // Calcular cuándo debe comenzar: después de que NGBG 24 duplicado termine
        // NGBG 24 duplicado termina en: 2.5 + 0.5 = 3 segundos
        const startTime = ANIMATION_CONSTANTS.BASE_DURATION + (1 * ANIMATION_CONSTANTS.BASE_DURATION) + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION; // 3 segundos
        
        if (isMobileCheck) {
          // En móvil: aparece desde abajo
          gsap.set(card, { 
            y: cardHeightRef.current, // Comenzar desde abajo
            x: 0,
            zIndex: 8 // z-index: 8
          });
          animationRef.current?.to(
            card,
            {
              y: 0, // Posición final
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime
          );
        } else {
          // En desktop: aparece desde la derecha
          gsap.set(card, { 
            x: window.innerWidth, // Comenzar completamente fuera de la pantalla a la derecha
            y: 0,
            zIndex: 8 // z-index: 8
          });
          
          animationRef.current?.to(
            card,
            {
              x: 0, // Posición final: apilada sobre NGBG 24 duplicado
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime
          );
        }
      } else if (index === 8) {
        // Tarjeta blanca (index 8): aparece desde abajo después de fullpic24 duplicado (index 7)
        // Se apila sobre fullpic24 duplicado
        gsap.set(card, { 
          y: cardHeightRef.current, // Comenzar desde abajo
          x: 0,
          zIndex: 9 // z-index: 9
        });
        
        // Calcular cuándo debe comenzar: después de que fullpic24 duplicado termine
        // fullpic24 duplicado termina en: 3 + 0.5 = 3.5 segundos
        const startTime = ANIMATION_CONSTANTS.BASE_DURATION + (1 * ANIMATION_CONSTANTS.BASE_DURATION) + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION; // 3.5 segundos
        
        animationRef.current?.to(
          card,
          {
            y: 0,
            duration: ANIMATION_CONSTANTS.BASE_DURATION,
            ease: "none",
          },
          startTime
        );
      } else if (index === 9) {
        // Tarjeta negra fullscreen (index 9): aparece desde la derecha (o desde abajo en móvil) después de tarjeta blanca
        // Se apila sobre tarjeta blanca
        // Calcular cuándo debe comenzar: después de que tarjeta blanca termine
        // tarjeta blanca termina en: 3.5 + 0.5 = 4 segundos
        const startTime = ANIMATION_CONSTANTS.BASE_DURATION + (1 * ANIMATION_CONSTANTS.BASE_DURATION) + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION + ANIMATION_CONSTANTS.BASE_DURATION; // 4 segundos
        
        if (isMobileCheck) {
          // En móvil: aparece desde abajo
          gsap.set(card, { 
            y: cardHeightRef.current, // Comenzar desde abajo
            x: 0,
            zIndex: 10 // z-index: 10 (sobre tarjeta blanca que tiene z-index 9)
          });
          animationRef.current?.to(
            card,
            {
              y: 0, // Posición final
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime
          );
        } else {
          // En desktop: aparece desde la derecha
          gsap.set(card, { 
            x: window.innerWidth, // Comenzar completamente fuera de la pantalla a la derecha
            y: 0,
            zIndex: 10 // z-index: 10 (sobre tarjeta blanca que tiene z-index 9)
          });
          
          animationRef.current?.to(
            card,
            {
              x: 0, // Posición final: apilada sobre tarjeta blanca
              duration: ANIMATION_CONSTANTS.BASE_DURATION,
              ease: "none",
            },
            startTime
          );
        }
      } else {
        // NGBG 24 (index 1): comienza desde abajo, se apila DESPUÉS de que fullpic25 llegue a la izquierda
        // Se apila sobre la imagen full (fullpic25)
        gsap.set(card, { 
          y: index * cardHeightRef.current,
          x: 0,
          zIndex: 3 // z-index: 3 (más alto, se apila sobre la imagen full)
        });
        
        // Animar hacia arriba para apilarse DESPUÉS de que fullpic25 (index 2) termine su movimiento
        // fullpic25 termina en: 0.5 segundos (duración de su animación)
        animationRef.current?.to(
          card,
          {
            y: 0,
              duration: index * ANIMATION_CONSTANTS.BASE_DURATION,
            ease: "none",
          },
          ANIMATION_CONSTANTS.BASE_DURATION // Comenzar después de que fullpic25 termine su movimiento
        );
      }
    });
  }, []);

  /**
   * Handle window resize and mobile detection
   * 
   * Updates mobile state and refreshes ScrollTrigger on resize.
   * Uses debouncing to prevent excessive refreshes during window resize.
   * 
   * @remarks
   * Mobile breakpoint is defined in ANIMATION_CONSTANTS.MOBILE_BREAKPOINT (768px)
   */
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= ANIMATION_CONSTANTS.MOBILE_BREAKPOINT);
    };
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkMobile();
        // Refresh ScrollTrigger after resize with a small delay for better smoothness
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, ANIMATION_CONSTANTS.RESIZE_DEBOUNCE_DELAY);
    };
    
    checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Initialize ScrollTrigger and card animations
   */
  useEffect(() => {
    if (!wrapperRef.current || !cardsRef.current) return;

    const initScrollTrigger = () => {
      // Ensure cards are rendered
      if (cards.current.length === 0) {
        setTimeout(initScrollTrigger, ANIMATION_CONSTANTS.INIT_RETRY_DELAY);
        return;
      }

      // Recalculate card height
      const firstCard = cards.current[0];
      if (firstCard) {
        cardHeightRef.current = firstCard.offsetHeight || window.innerHeight;
      }

      // Initialize card animations
      initCards();

      // Kill existing ScrollTrigger if any
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // Detect mobile for scroll configuration
      const isMobileForScroll = isMobileViewport();
      
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        pin: true,
        pinSpacing: true,
        end: () => {
          // Recalculate height dynamically
          const currentHeight = cards.current[0]?.offsetHeight || cardHeightRef.current;
          const totalHeight = cards.current.length * currentHeight;
          return `+=${totalHeight}`;
        },
        scrub: isMobileForScroll 
          ? ANIMATION_CONSTANTS.MOBILE_SCRUB_VALUE 
          : ANIMATION_CONSTANTS.SCROLL_SCRUB_VALUE,
        anticipatePin: isMobileForScroll 
          ? ANIMATION_CONSTANTS.MOBILE_ANTICIPATE_PIN 
          : ANIMATION_CONSTANTS.DESKTOP_ANTICIPATE_PIN,
        fastScrollEnd: false,
        animation: animationRef.current || undefined,
        invalidateOnRefresh: true,
        onRefresh: () => {
          // Reinitialize cards when refreshed to ensure correct positions
          initCards();
          if (animationRef.current) {
            animationRef.current.pause();
          }
        },
      });

      ScrollTrigger.addEventListener("refreshInit", initCards);
    };

    const timeoutId = setTimeout(initScrollTrigger, ANIMATION_CONSTANTS.INIT_SCROLL_DELAY);

    return () => {
      clearTimeout(timeoutId);
      cleanupAnimations();
      ScrollTrigger.removeEventListener("refreshInit", initCards);
    };
  }, [initCards, cleanupAnimations]);

  return (
      <section 
        ref={wrapperRef} 
        className="portfolio-wrapper" 
        suppressHydrationWarning
        aria-label="Portfolio showcase with animated cards"
      >
        <div 
          ref={cardsRef} 
          className="portfolio-cards" 
          suppressHydrationWarning
          role="list"
          aria-label="Portfolio items"
        >
          {portfolioItems.map((item, index) => (
            <article
              key={item.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  cards.current[index] = el;
                }
              }}
              className={getCardClassName(index, item)}
              style={{ 
                backgroundColor: getCardBackgroundColor(index, item, cardColors),
                color: getCardTextColor(index)
              }}
              role="listitem"
              aria-label={`Portfolio item: ${item.title}`}
            >
              {isGridCard(index) ? (
                isMobile ? (
                  // Mobile version: text and 2 images
                  <div style={MOBILE_CARD_STYLES.container}>
                    <div style={MOBILE_CARD_STYLES.titleContainer}>
                      <div style={MOBILE_CARD_STYLES.titleWrapper}>
                        {item.title.split('\n').map((line, lineIndex) => {
                          const isDateLine = line.includes('DK -') || line.includes('SWE -') || line.includes('DK-') || line.includes('SWE-');
                          
                          if (isDateLine) {
                            // Renderizar fecha pequeña
                            const dateText = line.includes('DK - 2025') || line.includes('DK-2025') ? 'DK-2025' : line.includes('SWE - 2025') || line.includes('SWE-2025') ? 'SWE-2025' : line;
                            return (
                              <div
                                key={lineIndex}
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                                  fontWeight: 'normal',
                                  textAlign: 'center',
                                  color: 'inherit',
                                  opacity: 0.9,
                                  letterSpacing: '0.1em',
                                  marginTop: '4px'
                                }}
                              >
                                {dateText}
                              </div>
                            );
                          }
                          
                          // Renderizar título grande
                          const isMonospace = line.includes('SWE-') || line.includes('DK-');
                          return (
                            <div
                              key={lineIndex}
                              style={{
                                fontFamily: isMonospace ? 'monospace' : 'Inter, sans-serif',
                                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                                fontWeight: isMonospace ? 'normal' : '900',
                                fontStyle: isMonospace ? 'normal' : 'italic',
                                textTransform: isMonospace ? 'none' : 'uppercase',
                                lineHeight: '1',
                                letterSpacing: isMonospace ? '0.1em' : 'normal'
                              }}
                            >
                              {line}
                            </div>
                          );
                        })}
                      </div>
                      {index === 0 && !item.title.includes('SWE - 2025') && !item.title.includes('DK - 2025') && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '4px'
                        }}>
                          SWE-2025
                        </div>
                      )}
                      {index === 1 && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '4px'
                        }}>
                          SWE-2024
                        </div>
                      )}
                      {index === 6 && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '4px'
                        }}>
                          DK-2025
                        </div>
                      )}
                      {index === 8 && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '4px'
                        }}>
                          DK-2025
                        </div>
                      )}
                      {index === 0 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.6rem, 1.1vw, 0.75rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                          textAlign: 'center',
                          maxWidth: '95%',
                          color: 'inherit',
                          opacity: 0.8,
                          letterSpacing: '0.05em',
                          marginTop: '4px'
                        }}>
                          From concept to execution –<br />
                          2 days stage production<br />
                          at NGBG street festival<br />
                          2025 & 2024
                        </div>
                      )}
                      {index === 4 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.6rem, 1.1vw, 0.75rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                          textAlign: 'center',
                          maxWidth: '95%',
                          color: 'inherit',
                          opacity: '0.8',
                          letterSpacing: '0.05em',
                          marginTop: '4px'
                        }}>
                          Light show and projection mapping on 3d structures
                        </div>
                      )}
                      {index === 6 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.6rem, 1.1vw, 0.75rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                          textAlign: 'center',
                          maxWidth: '95%',
                          color: 'inherit',
                          opacity: 0.8,
                          letterSpacing: '0.05em',
                          marginTop: '4px'
                        }}>
                          Laser show in Klub Werkstatt's reimagined<br />
                          engine workshop — a custom concept<br />
                          crafted from our designs.
                        </div>
                      )}
                      {index === 8 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.6rem, 1.1vw, 0.75rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                          textAlign: 'center',
                          maxWidth: '95%',
                          color: 'inherit',
                          opacity: 0.8,
                          letterSpacing: '0.05em',
                          marginTop: '4px'
                        }}>
                          Halloween visuals at Kayak Bar —<br />
                          programmed and performed live.
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      flex: '1 1 auto',
                      width: '100%',
                      minHeight: 0
                    }}>
                      {item.images && item.images[0] && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '48%',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        </div>
                      )}
                      {item.images && item.images[1] && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '48%',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img
                            src={item.images[1]}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Desktop version: 2x2 grid with title and 3 images
                  <div style={DESKTOP_CARD_STYLES.grid}>
                    <div style={DESKTOP_CARD_STYLES.titleContainer}>
                      <div style={DESKTOP_CARD_STYLES.titleWrapper}>
                        {item.title.split('\n').map((line, lineIndex) => {
                          const isDateLine = line.includes('DK -') || line.includes('SWE -') || line.includes('DK-') || line.includes('SWE-');
                          
                          if (isDateLine) {
                            // Renderizar fecha pequeña
                            const dateText = line.includes('DK - 2025') || line.includes('DK-2025') ? 'DK-2025' : line.includes('SWE - 2025') || line.includes('SWE-2025') ? 'SWE-2025' : line;
                            return (
                              <div
                                key={lineIndex}
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                                  fontWeight: 'normal',
                                  textAlign: 'center',
                                  color: 'inherit',
                                  opacity: 0.9,
                                  letterSpacing: '0.1em',
                                  marginTop: '6px'
                                }}
                              >
                                {dateText}
                              </div>
                            );
                          }
                          
                          // Renderizar título grande
                          const isMonospace = line.includes('SWE-') || line.includes('DK-');
                          return (
                            <div
                              key={lineIndex}
                              style={{
                                fontFamily: isMonospace ? 'monospace' : 'Inter, sans-serif',
                                fontSize: index === 4 ? 'clamp(1.75rem, 5vw, 4rem)' : index === 6 ? 'clamp(2rem, 6vw, 5rem)' : 'clamp(2.5rem, 7vw, 6rem)',
                                fontWeight: isMonospace ? 'normal' : '900',
                                fontStyle: isMonospace ? 'normal' : 'italic',
                                textTransform: isMonospace ? 'none' : 'uppercase',
                                lineHeight: '1',
                                letterSpacing: isMonospace ? '0.1em' : 'normal'
                              }}
                            >
                              {line}
                            </div>
                          );
                        })}
                      </div>
                      {index === 0 && !item.title.includes('SWE - 2025') && !item.title.includes('DK - 2025') && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '6px'
                        }}>
                          SWE-2025
                        </div>
                      )}
                      {index === 1 && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '6px'
                        }}>
                          SWE-2024
                        </div>
                      )}
                      {index === 6 && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '6px'
                        }}>
                          DK-2025
                        </div>
                      )}
                      {index === 8 && (
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                          fontWeight: 'normal',
                          textAlign: 'center',
                          color: 'inherit',
                          opacity: 0.9,
                          letterSpacing: '0.1em',
                          marginTop: '6px'
                        }}>
                          DK-2025
                        </div>
                      )}
                      {index === 0 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.8rem, 1.25vw, 1.1rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.3',
                          textAlign: 'center',
                          maxWidth: '80%',
                          color: 'inherit',
                          opacity: 0.8,
                          letterSpacing: '0.05em',
                          marginTop: '16px'
                        }}>
                          From concept to execution –<br />
                          2 days stage production<br />
                          at NGBG street festival<br />
                          2025 & 2024
                        </div>
                      )}
                      {index === 4 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.8rem, 1.25vw, 1.1rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.3',
                          textAlign: 'center',
                          maxWidth: '80%',
                          color: 'inherit',
                          opacity: 0.8,
                          letterSpacing: '0.05em',
                          marginTop: '32px'
                        }}>
                          Light show and projection mapping on 3d structures
                        </div>
                      )}
                      {index === 6 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.8rem, 1.25vw, 1.1rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.3',
                          textAlign: 'center',
                          maxWidth: '80%',
                          color: 'inherit',
                          opacity: 0.8,
                          letterSpacing: '0.05em',
                          marginTop: '32px'
                        }}>
                          Laser show in Klub Werkstatt's reimagined<br />
                          engine workshop — a custom concept<br />
                          crafted from our designs.
                        </div>
                      )}
                      {index === 8 && (
                        <div style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 'clamp(0.8rem, 1.25vw, 1.1rem)',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.3',
                          textAlign: 'center',
                          maxWidth: '80%',
                          color: 'inherit',
                          opacity: 0.8,
                          letterSpacing: '0.05em',
                          marginTop: '32px'
                        }}>
                          Halloween visuals at Kayak Bar —<br />
                          programmed and performed live.
                        </div>
                      )}
                    </div>
                    {item.images && item.images[0] && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: '85%',
                            height: '85%',
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />
                      </div>
                    )}
                    {item.images && item.images[1] && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={item.images[1]}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: '85%',
                            height: '85%',
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />
                      </div>
                    )}
                    {item.images && item.images[2] && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={item.images[2]}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: '85%',
                            height: '85%',
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              ) : isFullscreenCard(index, item) ? (
                item.video ? (
                  <div style={FULLSCREEN_CARD_STYLES.container}>
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      aria-label={`Video for ${item.title}`}
                      onLoadedData={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                        // Force video playback
                        const video = e.currentTarget;
                        video.play().catch((error: unknown) => {
                          // Ignore autoplay errors (browser policy)
                          if (process.env.NODE_ENV === 'development') {
                            console.debug('Video autoplay prevented:', error);
                          }
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        position: 'relative'
                      }}
                    />
                  </div>
                ) : (
                  <div style={FULLSCREEN_CARD_STYLES.container}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      style={FULLSCREEN_CARD_STYLES.image}
                    />
                  </div>
                )
              ) : (
                <h2>{item.title}</h2>
              )}
            </article>
          ))}
        </div>
      </section>
  );
}


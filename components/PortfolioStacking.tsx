"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioItems } from "@/data/portfolioData";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Constants
const MOBILE_BREAKPOINT = 768;
const ANIMATION_DURATION = 0.5;
const INIT_RETRY_DELAY = 100;
const SCROLL_SCRUB_VALUE = 0.1; // Valor más bajo para scroll más suave
const INIT_SCROLL_DELAY = 200;
const RESIZE_DEBOUNCE_DELAY = 150;

export function PortfolioStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const cardHeightRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Array of different colors for each card
  const cardColors = [
    "#1565C0", // Blue
    "#303F9F", // Dark blue
    "#C2185B", // Pink/Magenta
    "#F57C00", // Orange
    "#00796B", // Teal
  ];

  const initCards = () => {
    if (!animationRef.current) {
      animationRef.current = gsap.timeline();
    } else {
      animationRef.current.clear();
    }

    if (cards.current.length === 0) return;

    cardHeightRef.current = cards.current[0]?.offsetHeight || 0;

    if (cardHeightRef.current === 0) {
      setTimeout(() => {
        cardHeightRef.current = cards.current[0]?.offsetHeight || 0;
        if (cardHeightRef.current > 0) {
          initCards();
        }
      }, INIT_RETRY_DELAY);
      return;
    }

    // Detectar si es móvil
    const isMobileCheck = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;

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
              duration: ANIMATION_DURATION,
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
              duration: ANIMATION_DURATION,
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
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION); // 1 segundo
        
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
              duration: ANIMATION_DURATION,
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
              duration: ANIMATION_DURATION,
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
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION; // 1.5 segundos
        
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
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION; // 2 segundos
        
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
              duration: ANIMATION_DURATION,
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
              duration: ANIMATION_DURATION,
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
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION; // 2.5 segundos
        
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
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION; // 3 segundos
        
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
              duration: ANIMATION_DURATION,
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
              duration: ANIMATION_DURATION,
              ease: "none",
            },
            startTime
          );
        }
      } else if (index === 8) {
        // NGBG 25 segunda duplicación (index 8): aparece desde abajo después de fullpic24 duplicado
        // Se apila sobre fullpic24 duplicado
        gsap.set(card, { 
          y: cardHeightRef.current, // Comenzar desde abajo
          x: 0,
          zIndex: 9 // z-index: 9
        });
        
        // Calcular cuándo debe comenzar: después de que fullpic24 duplicado termine
        // fullpic24 duplicado termina en: 3 + 0.5 = 3.5 segundos
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION; // 3.5 segundos
        
        animationRef.current?.to(
          card,
          {
            y: 0,
            duration: 0.5,
            ease: "none",
          },
          startTime
        );
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
            duration: index * ANIMATION_DURATION,
            ease: "none",
          },
          ANIMATION_DURATION // Comenzar después de que fullpic25 termine su movimiento
        );
      }
    });
  };

  // Detectar si es móvil y refrescar ScrollTrigger en resize
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
    checkMobile();
        // Refrescar ScrollTrigger después de resize con un pequeño delay para mejor suavidad
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, RESIZE_DEBOUNCE_DELAY);
    };
    
    checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || !cardsRef.current) return;

    let scrollTrigger: ScrollTrigger | null = null;

    const initScrollTrigger = () => {
      // Asegurar que las cards estén renderizadas
      if (cards.current.length === 0) {
        setTimeout(initScrollTrigger, INIT_RETRY_DELAY);
        return;
      }

      // Recalcular altura de cards
      const firstCard = cards.current[0];
      if (firstCard) {
        cardHeightRef.current = firstCard.offsetHeight || window.innerHeight;
      }

      initCards();

      // Matar ScrollTrigger existente si hay uno
      if (scrollTrigger) {
        scrollTrigger.kill();
      }

      scrollTrigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        pin: true,
        pinSpacing: true,
        end: () => {
          // Recalcular altura dinámicamente
          const currentHeight = cards.current[0]?.offsetHeight || cardHeightRef.current;
          const totalHeight = cards.current.length * currentHeight;
          return `+=${totalHeight}`;
        },
        scrub: SCROLL_SCRUB_VALUE,
        anticipatePin: 1.5,
        fastScrollEnd: false,
        animation: animationRef.current || undefined,
        invalidateOnRefresh: true,
        onRefresh: () => {
          initCards();
        },
      });

      ScrollTrigger.addEventListener("refreshInit", initCards);
    };

    const timeoutId = setTimeout(initScrollTrigger, INIT_SCROLL_DELAY);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.removeEventListener("refreshInit", initCards);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
      <div ref={wrapperRef} className="portfolio-wrapper" suppressHydrationWarning>
        <div ref={cardsRef} className="portfolio-cards" suppressHydrationWarning>
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) cards.current[index] = el;
              }}
              className={`portfolio-card ${(index === 2 || index === 3 || index === 5 || index === 7) && item.image ? 'portfolio-card-image' : ''} ${index === 0 || index === 1 || index === 4 || index === 6 || index === 8 ? 'portfolio-card-grid' : ''}`}
              style={{ 
                backgroundColor: (index === 2 || index === 3 || index === 5 || index === 7) && (item.video || item.image) ? '#000000' : index === 0 || index === 4 || index === 8 ? '#FFFFFF' : index === 1 || index === 6 ? '#000000' : cardColors[index % cardColors.length],
                color: index === 0 || index === 4 || index === 8 ? '#000000' : index === 1 || index === 6 ? '#FFFFFF' : undefined
              }}
            >
              {(index === 0 || index === 1 || index === 4 || index === 6 || index === 8) ? (
                isMobile ? (
                  // Versión móvil: texto y 2 fotos
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    padding: '16px',
                    gap: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: '0 0 auto',
                      gap: '6px'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '0',
                        marginTop: '8px'
                      }}>
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
                          stage production<br />
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
                          Light show and projection mapping<br />
                          for Little Vega events<br />
                          in Denmark and Sweden 2025.
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
                  // Versión desktop: grid 2x2 con título y 3 imágenes
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    width: '100%',
                    height: '100%',
                    gap: '8px',
                    padding: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      gap: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '0',
                        marginTop: '40px'
                      }}>
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
                          stage production<br />
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
                          Light show and projection mapping<br />
                          for Little Vega events<br />
                          in Denmark and Sweden 2025.
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
              ) : (index === 2 || index === 3 || index === 5 || index === 7) && (item.video || item.image) ? (
                (index === 2 || index === 5 || index === 7) && item.video ? (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000000',
                    overflow: 'hidden'
                  }}>
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      aria-label={`Video for ${item.title}`}
                      onLoadedData={(e) => {
                        // Forzar reproducción
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(() => {
                          // Ignorar errores de autoplay
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
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000000',
                    overflow: 'hidden'
                  }}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                  </div>
                )
              ) : (
                item.title
              )}
            </div>
          ))}
        </div>
      </div>
  );
}


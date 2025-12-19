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
// CAMBIO 1: Aumentamos scrub para suavizar el "freno" al hacer scroll hacia atrás
const SCROLL_SCRUB_VALUE = 0.5; 
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

    // Aseguramos altura
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

    const isMobileCheck = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;

    cards.current.forEach((card, index) => {
      if (!card) return;
      
      // CAMBIO 2: Usamos .fromTo en lugar de .set + .to para asegurar el reverse scroll

      if (index === 0) {
        // Primera tarjeta (Base): siempre quieta
        gsap.set(card, { 
          x: 0, 
          y: 0,
          zIndex: 1 
        });
      } else if (index === 2) {
        // fullpic25
        gsap.set(card, { zIndex: 2 }); // Z-index estático

        if (isMobileCheck) {
          animationRef.current?.fromTo(card, 
            { y: cardHeightRef.current, x: 0 }, // FROM
            { y: 0, duration: ANIMATION_DURATION, ease: "none" }, // TO
            0 // Start Time
          );
        } else {
          animationRef.current?.fromTo(card,
            { x: width, y: 0 }, // FROM
            { x: 0, duration: ANIMATION_DURATION, ease: "none" }, // TO
            0
          );
        }
      } else if (index === 3) {
        // fullpic24
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION);
        gsap.set(card, { zIndex: index + 1 });

        if (isMobileCheck) {
          animationRef.current?.fromTo(card,
            { y: cardHeightRef.current, x: 0 },
            { y: 0, duration: ANIMATION_DURATION, ease: "none" },
            startTime
          );
        } else {
          animationRef.current?.fromTo(card,
            { x: width, y: 0 },
            { x: 0, duration: ANIMATION_DURATION, ease: "none" },
            startTime
          );
        }
      } else if (index === 4) {
        // NGBG 25 duplicado
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION;
        gsap.set(card, { zIndex: 5, x: 0 });

        animationRef.current?.fromTo(card,
          { y: cardHeightRef.current },
          { y: 0, duration: 0.5, ease: "none" },
          startTime
        );
      } else if (index === 5) {
        // fullpic25 duplicado
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION;
        gsap.set(card, { zIndex: 6 });

        if (isMobileCheck) {
          animationRef.current?.fromTo(card,
            { y: cardHeightRef.current, x: 0 },
            { y: 0, duration: ANIMATION_DURATION, ease: "none" },
            startTime
          );
        } else {
          animationRef.current?.fromTo(card,
            { x: width, y: 0 },
            { x: 0, duration: ANIMATION_DURATION, ease: "none" },
            startTime
          );
        }
      } else if (index === 6) {
        // NGBG 24 duplicado
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION;
        gsap.set(card, { zIndex: 7, x: 0 });

        animationRef.current?.fromTo(card,
          { y: cardHeightRef.current },
          { y: 0, duration: 0.5, ease: "none" },
          startTime
        );
      } else if (index === 7) {
        // fullpic24 duplicado
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION;
        gsap.set(card, { zIndex: 8 });

        if (isMobileCheck) {
          animationRef.current?.fromTo(card,
            { y: cardHeightRef.current, x: 0 },
            { y: 0, duration: ANIMATION_DURATION, ease: "none" },
            startTime
          );
        } else {
          animationRef.current?.fromTo(card,
            { x: width, y: 0 },
            { x: 0, duration: ANIMATION_DURATION, ease: "none" },
            startTime
          );
        }
      } else if (index === 8) {
        // NGBG 25 segunda duplicación
        const startTime = ANIMATION_DURATION + (1 * ANIMATION_DURATION) + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION + ANIMATION_DURATION;
        gsap.set(card, { zIndex: 9, x: 0 });

        animationRef.current?.fromTo(card,
          { y: cardHeightRef.current },
          { y: 0, duration: 0.5, ease: "none" },
          startTime
        );
      } else {
        // NGBG 24 (index 1) y otros casos default
        gsap.set(card, { zIndex: 3, x: 0 });

        animationRef.current?.fromTo(card,
          { y: index * cardHeightRef.current },
          { y: 0, duration: index * ANIMATION_DURATION, ease: "none" },
          ANIMATION_DURATION
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
      if (cards.current.length === 0) {
        setTimeout(initScrollTrigger, INIT_RETRY_DELAY);
        return;
      }

      const firstCard = cards.current[0];
      if (firstCard) {
        cardHeightRef.current = firstCard.offsetHeight || window.innerHeight;
      }

      initCards();

      if (scrollTrigger) {
        scrollTrigger.kill();
      }

      scrollTrigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        pin: true,
        pinSpacing: true,
        end: () => {
          const currentHeight = cards.current[0]?.offsetHeight || cardHeightRef.current;
          // Ajuste para evitar flickering al final
          const totalHeight = cards.current.length * currentHeight; 
          return `+=${totalHeight}`;
        },
        scrub: SCROLL_SCRUB_VALUE, 
        anticipatePin: 1, // Reducido ligeramente para evitar saltos
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
                  // Versión móvil
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
                          Light show and projection mapping<br />
                          on 3d structures
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
                          Visual show in Klub Werkstatt's reimagined<br />
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
                  // Versión desktop
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
                          Light show and projection mapping<br />
                          on 3d structures
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
                          Visual show in Klub Werkstatt's reimagined<br />
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
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(() => {});
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

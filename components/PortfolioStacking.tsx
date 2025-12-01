"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioItems } from "@/data/portfolioData";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function PortfolioStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const cardHeightRef = useRef<number>(0);

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
      }, 100);
      return;
    }

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
        // fullpic25 (index 2): aparece desde la derecha (fuera de la pantalla) con imagen
        // Se apila sobre la primera NGBG 25
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
            duration: 0.5,
            ease: "none",
          },
          0
        );
      } else if (index === 3) {
        // fullpic24 (index 3): aparece desde la izquierda (fuera de la pantalla) con imagen
        // Se apila sobre NGBG 24 (index 1)
        gsap.set(card, { 
          x: -window.innerWidth, // Comenzar completamente fuera de la pantalla a la izquierda
          y: 0,
          zIndex: index + 1 // z-index: 4 (más alto)
        });
        
        // Calcular cuándo debe comenzar: después de que NGBG 24 (index 1) termine
        // NGBG 24 termina en: 0.5 (cuando fullpic25 termina) + 0.5 (duración de NGBG 24 stacking) = 1 segundo
        const startTime = 0.5 + (1 * 0.5); // 1 segundo
        
        // Animar desde la izquierda hacia su posición final (x: 0) donde se apila sobre NGBG 24
        animationRef.current?.to(
          card,
          {
            x: 0, // Posición final: apilada sobre NGBG 24
            duration: 0.5,
            ease: "none",
          },
          startTime // Comenzar después de que NGBG 24 termine
        );
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
        const startTime = 0.5 + (1 * 0.5) + 0.5; // 1.5 segundos
        
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
        // fullpic25 duplicado (index 5): aparece desde la derecha después de NGBG 25 duplicado
        // Se apila sobre NGBG 25 duplicado
        gsap.set(card, { 
          x: window.innerWidth, // Comenzar completamente fuera de la pantalla a la derecha
          y: 0,
          zIndex: 6 // z-index: 6
        });
        
        // Calcular cuándo debe comenzar: después de que NGBG 25 duplicado termine
        // NGBG 25 duplicado termina en: 1.5 + 0.5 = 2 segundos
        const startTime = 0.5 + (1 * 0.5) + 0.5 + 0.5; // 2 segundos
        
        animationRef.current?.to(
          card,
          {
            x: 0, // Posición final: apilada sobre NGBG 25 duplicado
            duration: 0.5,
            ease: "none",
          },
          startTime
        );
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
        const startTime = 0.5 + (1 * 0.5) + 0.5 + 0.5 + 0.5; // 2.5 segundos
        
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
        // fullpic24 duplicado (index 7): aparece desde la izquierda después de NGBG 24 duplicado
        // Se apila sobre NGBG 24 duplicado
        gsap.set(card, { 
          x: -window.innerWidth, // Comenzar completamente fuera de la pantalla a la izquierda
          y: 0,
          zIndex: 8 // z-index: 8
        });
        
        // Calcular cuándo debe comenzar: después de que NGBG 24 duplicado termine
        // NGBG 24 duplicado termina en: 2.5 + 0.5 = 3 segundos
        const startTime = 0.5 + (1 * 0.5) + 0.5 + 0.5 + 0.5 + 0.5; // 3 segundos
        
        animationRef.current?.to(
          card,
          {
            x: 0, // Posición final: apilada sobre NGBG 24 duplicado
            duration: 0.5,
            ease: "none",
          },
          startTime
        );
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
        const startTime = 0.5 + (1 * 0.5) + 0.5 + 0.5 + 0.5 + 0.5 + 0.5; // 3.5 segundos
        
        animationRef.current?.to(
          card,
          {
            y: 0,
            duration: 0.5,
            ease: "none",
          },
          startTime
        );
      } else if (index === 9) {
        // fullpic25 segunda duplicación (index 9): aparece desde la derecha después de NGBG 25 segunda duplicación
        // Se apila sobre NGBG 25 segunda duplicación
        gsap.set(card, { 
          x: window.innerWidth, // Comenzar completamente fuera de la pantalla a la derecha
          y: 0,
          zIndex: 10 // z-index: 10
        });
        
        // Calcular cuándo debe comenzar: después de que NGBG 25 segunda duplicación termine
        // NGBG 25 segunda duplicación termina en: 3.5 + 0.5 = 4 segundos
        const startTime = 0.5 + (1 * 0.5) + 0.5 + 0.5 + 0.5 + 0.5 + 0.5 + 0.5; // 4 segundos
        
        animationRef.current?.to(
          card,
          {
            x: 0, // Posición final: apilada sobre NGBG 25 segunda duplicación
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
            duration: index * 0.5,
            ease: "none",
          },
          0.5 // Comenzar después de que fullpic25 termine su movimiento (0.5 segundos)
        );
      }
    });
  };

  useEffect(() => {
    if (!wrapperRef.current || !cardsRef.current) return;

    let scrollTrigger: ScrollTrigger | null = null;

    const timeoutId = setTimeout(() => {
      initCards();

      scrollTrigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        pin: true,
        end: () => {
          const totalHeight = cards.current.length * cardHeightRef.current;
          return `+=${totalHeight}`;
        },
        scrub: true,
        animation: animationRef.current || undefined,
        invalidateOnRefresh: true,
        onRefresh: () => {
          initCards();
        },
      });

      ScrollTrigger.addEventListener("refreshInit", initCards);
    }, 100);

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
      <div ref={wrapperRef} className="portfolio-wrapper">
        <div ref={cardsRef} className="portfolio-cards">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) cards.current[index] = el;
              }}
              className={`portfolio-card ${(index === 2 || index === 3 || index === 5 || index === 7 || index === 9) && item.image ? 'portfolio-card-image' : ''} ${index === 0 || index === 1 || index === 4 || index === 6 || index === 8 ? 'portfolio-card-grid' : ''}`}
              style={{ 
                backgroundColor: index === 0 || index === 4 || index === 8 ? '#FFFFFF' : index === 1 || index === 6 ? '#000000' : cardColors[index % cardColors.length],
                color: index === 0 || index === 4 || index === 8 ? '#000000' : index === 1 || index === 6 ? '#FFFFFF' : undefined
              }}
            >
              {(index === 0 || index === 1 || index === 4 || index === 6 || index === 8) ? (
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    lineHeight: '1',
                    width: '100%',
                    height: '100%'
                  }}>
                    {item.title}
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
              ) : index === 1 ? (
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    lineHeight: '1',
                    width: '100%',
                    height: '100%'
                  }}>
                    {item.title}
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
              ) : (index === 2 || index === 3 || index === 5 || index === 7 || index === 9) && item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                item.title
              )}
            </div>
          ))}
        </div>
      </div>
  );
}


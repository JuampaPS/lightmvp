"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "ngbg25",
    title: "NGBG 25",
    category: "Festival",
    description: "Main stage de aniversario con timecode completo, diseño lumínico inmersivo y mezcla híbrida de fixtures LED, láser y humo criogénico.",
    tags: ["Timecode", "LED", "Láser", "Humo"],
  },
  {
    id: "werkstat",
    title: "WERKSTAT",
    category: "Club",
    description: "Venue modular itinerante con pixel mapping 360° y barras cinéticas reprogramables. Ajustable a tracklists híbridos y sesiones live.",
    tags: ["Pixel Mapping", "360°", "Barras Cinéticas"],
  },
  {
    id: "mapping",
    title: "MAPPING",
    category: "Immersive",
    description: "Instalación de mapping arquitectónico sobre superficie irregular con sincronización Resolume y control de luminancia en vivo.",
    tags: ["Resolume", "Mapping", "Arquitectónico"],
  },
  {
    id: "ngbg24",
    title: "NGBG 24",
    category: "Festival",
    description: "Edición previa con rig en voladizo, redundancia eléctrica IP65 y programación dinámica para dos escenarios principales.",
    tags: ["Rig", "IP65", "Dual Stage"],
  },
  {
    id: "history-venues",
    title: "HISTORY/VENUES",
    category: "Corporate",
    description: "Campaña de marca con recorrido interactivo y triggers RFID que activan escenas personalizadas por segmento de audiencia.",
    tags: ["RFID", "Interactivo", "Brand"],
  },
  {
    id: "production-cph",
    title: "PRODUCTION CPH",
    category: "Corporate",
    description: "Campaña de marca con recorrido interactivo y triggers RFID que activan escenas personalizadas por segmento de audiencia.",
    tags: ["RFID", "Interactivo", "Brand"],
  },
];

export function PortfolioStacking() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const cardHeightRef = useRef<number>(0);

  const initCards = () => {
    if (!animationRef.current) {
      animationRef.current = gsap.timeline();
    } else {
      animationRef.current.clear();
    }

    if (cards.current.length === 0) return;

    cardHeightRef.current = cards.current[0]?.offsetHeight || 0;

    cards.current.forEach((card, index) => {
      if (index > 0 && card) {
        // Increment y value of each card by cardHeight
        gsap.set(card, { y: index * cardHeightRef.current });
        // Animate each card back to 0 (for stacking)
        animationRef.current?.to(
          card,
          {
            y: 0,
            duration: index * 0.5,
            ease: "none",
          },
          0
        );
      }
    });
  };

  useEffect(() => {
    if (!wrapperRef.current || !headerRef.current || !cardsRef.current) return;

    let scrollTrigger: ScrollTrigger | null = null;

    // Wait for cards to be rendered
    const timeoutId = setTimeout(() => {
      // Initialize cards
      initCards();

      // Create ScrollTrigger
      scrollTrigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        pin: true,
        end: () => {
          const totalHeight =
            (cards.current.length * cardHeightRef.current) +
            (headerRef.current?.offsetHeight || 0);
          return `+=${totalHeight}`;
        },
        scrub: true,
        animation: animationRef.current || undefined,
        invalidateOnRefresh: true,
      });

      // Refresh on resize
      ScrollTrigger.addEventListener("refreshInit", initCards);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === wrapperRef.current) {
          trigger.kill();
        }
      });
      ScrollTrigger.removeEventListener("refreshInit", initCards);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <section id="portfolio">
      <div ref={wrapperRef} className="portfolio-wrapper">
        <div ref={headerRef} className="portfolio-header">
          BUNKER PRODUCTIONS<br />
          <span>PORTFOLIO</span>
        </div>

        <div ref={cardsRef} className="portfolio-cards">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) cards.current[index] = el;
              }}
              className={`portfolio-card ${index % 2 === 0 ? "portfolio-card-odd" : ""}`}
            >
              <div className="portfolio-card-content">
                <div className="portfolio-card-category">{item.category}</div>
                <div className="portfolio-card-title">{item.title}</div>
                <div className="portfolio-card-description">{item.description}</div>
                <div className="portfolio-card-tags">
                  {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="portfolio-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


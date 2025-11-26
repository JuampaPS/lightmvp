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
      
      if (index > 0) {
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
    <>
      <div className="spacer" style={{ height: '50vh' }}>
        Scroll Down
      </div>

      <div ref={wrapperRef} className="portfolio-wrapper">
        <div ref={cardsRef} className="portfolio-cards">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) cards.current[index] = el;
              }}
              className="portfolio-card"
              style={{ backgroundColor: cardColors[index % cardColors.length] }}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      <div className="spacer" style={{ height: '100vh', textAlign: 'center' }}>
        End of Portfolio
      </div>
    </>
  );
}


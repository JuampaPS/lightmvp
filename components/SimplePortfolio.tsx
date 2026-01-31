"use client";

/**
 * SimplePortfolio Component
 * 
 * Main orchestrator component for the portfolio stacking animation.
 * 
 * This component:
 * - Imports portfolio data from configuration
 * - Uses the stacking animation hook (desktop only)
 * - Renders cards using the CardFactory pattern
 * 
 * Enterprise-grade improvements:
 * - Semantic HTML5 elements (<section>, <article>)
 * - No hydration hacks - pure CSS for responsive behavior
 * - Type-safe with discriminated unions
 * - Mobile: Normal vertical scroll without stacking
 * - Desktop: Stacking animation effect
 * 
 * Architecture:
 * - Data-driven: All card configuration comes from portfolio-config.ts
 * - Separation of concerns: Animation logic in useStackingAnimation hook
 * - Component composition: Card rendering delegated to CardFactory
 */

import { useRef, useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio-config';
import { useStackingAnimation } from '@/hooks/useStackingAnimation';
import { CardFactory } from './portfolio/CardFactory';

export function SimplePortfolio() {
  const wrapperRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null = not determined yet

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Use custom hook for animation logic (only runs on desktop when wrapperRef is available)
  // Hook must be called unconditionally, but it checks internally if wrapperRef exists
  useStackingAnimation({
    wrapperRef: isMobile === false ? wrapperRef : { current: null } as React.RefObject<HTMLElement>,
    cardsRef,
    totalItems: PORTFOLIO_DATA.length,
  });

  // Wait for mobile detection before rendering
  if (isMobile === null) {
    return (
      <section
        className="relative w-full h-[100dvh] bg-black"
        aria-label="Portfolio showcase"
      >
        {/* Loading state - will be replaced immediately */}
      </section>
    );
  }

  // Mobile: Normal vertical scroll layout
  if (isMobile) {
    return (
      <>
        <section
          className="relative w-full bg-black"
          aria-label="Portfolio showcase"
        >
          {PORTFOLIO_DATA.map((item, index) => (
            <article
              key={item.id}
              className="relative w-full h-[100dvh] flex items-center justify-center text-white font-bold shadow-2xl"
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
                overflow: 'hidden',
              }}
              aria-label={item.title}
            >
              <CardFactory item={item} />
            </article>
          ))}
        </section>
      </>
    );
  }

  // Desktop: Stacking animation layout

  return (
    <>
      <section
        ref={wrapperRef}
        className="relative w-full h-[100dvh] overflow-hidden bg-black"
        aria-label="Portfolio showcase"
      >
        {PORTFOLIO_DATA.map((item, index) => (
          <article
            key={item.id}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-bold shadow-2xl"
            style={{
              backgroundColor: item.bgColor,
              color: item.textColor,
              zIndex: index, // Initial layer order
              overflow: 'hidden',
            }}
            aria-label={item.title}
          >
            <CardFactory item={item} />
          </article>
        ))}
      </section>
    </>
  );
}

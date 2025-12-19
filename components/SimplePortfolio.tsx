"use client";

/**
 * SimplePortfolio Component
 * 
 * Main orchestrator component for the portfolio stacking animation.
 * 
 * This component:
 * - Imports portfolio data from configuration
 * - Uses the stacking animation hook
 * - Renders cards using the CardFactory pattern
 * 
 * Enterprise-grade improvements:
 * - Semantic HTML5 elements (<section>, <article>)
 * - No hydration hacks - pure CSS for responsive behavior
 * - Type-safe with discriminated unions
 * 
 * Architecture:
 * - Data-driven: All card configuration comes from portfolio-config.ts
 * - Separation of concerns: Animation logic in useStackingAnimation hook
 * - Component composition: Card rendering delegated to CardFactory
 */

import { useRef } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio-config';
import { useStackingAnimation } from '@/hooks/useStackingAnimation';
import { CardFactory } from './portfolio/CardFactory';

export function SimplePortfolio() {
  const wrapperRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  // Use custom hook for animation logic
  useStackingAnimation({
    wrapperRef,
    cardsRef,
    totalItems: PORTFOLIO_DATA.length,
  });

  return (
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
  );
}

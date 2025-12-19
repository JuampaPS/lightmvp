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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Use custom hook for animation logic
  useStackingAnimation({
    wrapperRef,
    cardsRef,
    totalItems: PORTFOLIO_DATA.length,
  });

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-black"
    >
      {PORTFOLIO_DATA.map((item, index) => (
        <div
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
        >
          <CardFactory item={item} />
        </div>
      ))}
    </div>
  );
}
